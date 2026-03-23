import { api } from '@/lib/api';

// --- Types matching UI expectations ---

export interface Rate {
  sourcePhysical: number;
  ghsPhysical: number;
  ghsEcode: number;
  ngnPhysical: number;
  ngnEcode: number;
}

export interface GiftCard {
  id: string;          // Unique ID for keying (can be composite)
  assetName: string;   // Raw asset name from API (e.g. "Apple_US")
  productName: string; // e.g. "Apple"
  region: string;      // e.g. "US"
  amount: string;      // e.g. "50-100"
  rates: Rate;
  physicalId?: number; // ID for physical trade
  ecodeId?: number;    // ID for ecode trade
  logoUrl?: string;    // Brand logo URL
  brandNote?: string;  // Brand-specific note
}

export interface Category {
  name: string; // e.g. "Apple/iTunes"
  cards: GiftCard[];
  logoUrl?: string; // Icon/logo for the category
  note?: string;    // Note for the category
}

export interface RatesData {
  categories: Category[];
  lastUpdated: string;
}

// --- API Response Types ---

interface ApiGiftCardGroup {
  id: number;
  name: string;
  image_url: string;
  note: string | null;
  rates_count: number;
}

interface ApiRateItem {
  id: number;
  category: string;       // e.g. "gift_card"
  asset_name: string;     // e.g. "Asda"
  denomination: string;   // e.g. "100~500 (P)"
  country_code: string;   // e.g. "GB"
  type: 'physical' | 'ecode';
  rate: string;           // The payout rate
  status: string;
  gift_card?: {
    id: number;
    name: string;
    image_url: string;
    note: string | null;
  };
}

interface ApiRatesResponse {
  data: ApiRateItem[];
  meta?: {
    total: number;
  };
}

// --- Brand/Group Type ---
export interface GiftCardBrand extends ApiGiftCardGroup {}

// --- Helpers ---

// Helper to clean up asset names (Keep exact naming as requested)
const formatProductName = (assetName: string): string => {
  return assetName; // Keep exact naming
};

/**
 * Fetch all gift card groups (brands)
 */
export async function fetchGiftCardGroups(token?: string): Promise<GiftCardBrand[]> {
  try {
    const response = await api.get<{ success: boolean; data: ApiGiftCardGroup[] }>('/gift-cards', token);
    return response.data;
  } catch (error) {
    console.error('fetchGiftCardGroups Error:', error);
    return [];
  }
}

/**
 * Fetch and map rates from the API
 */
export async function fetchRates(token?: string): Promise<RatesData> {
  try {
    const response = await api.get<ApiRatesResponse>('/rates', token);
    const rawItems = response.data || [];

    // Grouping map: Key = "Asset_Country_Denomination"
    const groups: Record<string, GiftCard> = {};

    rawItems.forEach(item => {
      // Create a unique key for grouping physical/ecode variants
      const key = `${item.asset_name}_${item.country_code}_${item.denomination}`;

      if (!groups[key]) {
        groups[key] = {
          id: key, // Composite ID
          assetName: item.asset_name,
          productName: item.asset_name, // Exact name
          region: item.country_code,
          amount: item.denomination,
          rates: {
            sourcePhysical: parseFloat(item.rate || '0'), 
            ghsPhysical: 0,
            ghsEcode: 0,
            ngnPhysical: 0, 
            ngnEcode: 0, 
          },
          physicalId: item.type === 'physical' ? item.id : undefined,
          ecodeId: item.type === 'ecode' ? item.id : undefined,
          logoUrl: item.gift_card?.image_url,
          brandNote: item.gift_card?.note || undefined,
        };
      }

      // Update specific rates based on type
      const rateVal = parseFloat(item.rate || '0');
      
      if (item.type === 'physical') {
        groups[key].rates.ghsPhysical = rateVal;
        groups[key].physicalId = item.id;
        groups[key].rates.sourcePhysical = rateVal;
      } else {
        groups[key].rates.ghsEcode = rateVal;
        groups[key].ecodeId = item.id;
      }
    });

    // Transform grouped cards into Categories
    const categoriesMap: Record<string, Category> = {};

    Object.values(groups).forEach(card => {
        // Use the exact assetName as the category name
        const catName = card.assetName;

        if (!categoriesMap[catName]) {
            categoriesMap[catName] = {
                name: catName,
                cards: [],
                logoUrl: card.logoUrl,
                note: card.brandNote
            };
        }
        categoriesMap[catName].cards.push(card);
    });

    // Sort categories alphabetically
    const categories = Object.values(categoriesMap).sort((a, b) => a.name.localeCompare(b.name));

    // Sort cards within each category by amount (lowest to highest)
    categories.forEach(category => {
        category.cards.sort((a, b) => {
            // Helper to extract numeric value from amount string (e.g. "50-100" -> 50)
            const getAmountValue = (amt: string) => {
                const match = amt.match(/(\d+)/);
                return match ? parseInt(match[0], 10) : 0;
            };
            return getAmountValue(a.amount) - getAmountValue(b.amount);
        });
    });

    return {
      categories,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('RatesService Error:', error);
    throw error;
  }
}
