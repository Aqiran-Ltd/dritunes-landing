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
}

export interface Category {
  name: string; // e.g. "Apple/iTunes"
  cards: GiftCard[];
}

export interface RatesData {
  categories: Category[];
  lastUpdated: string;
}

// --- API Response Types ---

interface ApiRateItem {
  id: number;
  category: string;       // e.g. "gift_card"
  asset_name: string;     // e.g. "Asda"
  denomination: string;   // e.g. "100~500 (P)"
  country_code: string;   // e.g. "GB"
  type: 'physical' | 'ecode';
  rate: string;           // The payout rate
  source_rate: string;    // The base rate before margin
  ngn_physical_rate: string | null;
  ngn_ecode_rate: string | null;
  margin: string;
  custom_margin: string | null;
  status: string;
}

interface ApiRatesResponse {
  data: ApiRateItem[];
  meta?: {
    total: number;
  };
}

// --- Helpers ---

// Helper to clean up asset names (e.g., "Apple_US" -> "Apple")
const formatProductName = (assetName: string): string => {
  return assetName.split('_')[0] || assetName;
};

// Helper to determine category group from asset name
const getCategoryName = (assetName: string): string => {
  const lower = assetName.toLowerCase();
  if (lower.includes('apple') || lower.includes('itunes')) return 'Apple/iTunes';
  if (lower.includes('steam')) return 'Steam';
  if (lower.includes('google')) return 'Google Play';
  if (lower.includes('amazon')) return 'Amazon';
  if (lower.includes('xbox') || lower.includes('microsoft')) return 'Xbox';
  if (lower.includes('vanilla') || lower.includes('visa')) return 'Visa/Vanilla';
  if (lower.includes('amex')) return 'American Express';
  if (lower.includes('sephora')) return 'Sephora';
  if (lower.includes('nordstrom')) return 'Nordstrom';
  if (lower.includes('nike')) return 'Nike';
  if (lower.includes('macys')) return 'Macy\'s';
  if (lower.includes('ebay')) return 'eBay';
  if (lower.includes('razer')) return 'Razer Gold';
  return 'Other';
};

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
          productName: formatProductName(item.asset_name),
          region: item.country_code,
          amount: item.denomination,
          rates: {
            sourcePhysical: parseFloat(item.source_rate || '0'), 
            ghsPhysical: 0,
            ghsEcode: 0,
            ngnPhysical: parseFloat(item.ngn_physical_rate || '0'),
            ngnEcode: parseFloat(item.ngn_ecode_rate || '0'),
          },
          physicalId: item.type === 'physical' ? item.id : undefined,
          ecodeId: item.type === 'ecode' ? item.id : undefined,
        };
      }

      // Update specific rates based on type
      const rateVal = parseFloat(item.rate || '0');
      
      if (item.type === 'physical') {
        groups[key].rates.ghsPhysical = rateVal;
        groups[key].physicalId = item.id;
        if (groups[key].rates.sourcePhysical === 0) groups[key].rates.sourcePhysical = parseFloat(item.source_rate || '0');
      } else {
        groups[key].rates.ghsEcode = rateVal;
        groups[key].ecodeId = item.id;
        if (groups[key].rates.sourcePhysical === 0) groups[key].rates.sourcePhysical = parseFloat(item.source_rate || '0');
      }
    });

    // Transform grouped cards into Categories
    const categoriesMap: Record<string, Category> = {};

    Object.values(groups).forEach(card => {
        // Use the grouping helper to categorize
        // We use the full asset name from the ID key to determine category
        const originalAssetName = card.id.split('_')[0] + (card.id.split('_')[1] ? '_' + card.id.split('_')[1] : ''); 
        // Actually, let's just use productName + known mappings
        const catName = getCategoryName(card.productName + '_' + card.region);

        if (!categoriesMap[catName]) {
            categoriesMap[catName] = {
                name: catName,
                cards: []
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
