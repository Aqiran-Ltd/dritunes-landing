// Google Sheets data fetching utility
// Fetches from internal API route which handles Service Account auth

export interface Rate {
  rmbPhysical: number;
  ghsPhysical: number;
  ghsEcode: number;
  ngnPhysical: number;
  ngnEcode: number;
}

export interface GiftCard {
  productName: string; // e.g. "Apple_US"
  region: string;      // e.g. "US"
  amount: string;      // e.g. "50-100"
  rates: Rate;
}

export interface Category {
  name: string; // e.g. "Apple/iTunes", "JD Sports"
  cards: GiftCard[];
}

export interface RatesData {
  categories: Category[];
  lastUpdated: string;
}

/**
 * Fetch data from internal API route
 */
export async function fetchRatesData(): Promise<RatesData> {
  console.log('Fetching rates from /api/rates...');

  try {
    const response = await fetch('/api/rates', {
      next: { revalidate: 300 } // Revalidate every 5 minutes if using App Router cache
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API responded with status: ${response.status}`);
    }

    const data: RatesData = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
}

/**
 * Get cached data with refresh capability
 */
let cachedData: RatesData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getRatesData(forceRefresh = false): Promise<RatesData> {
  const now = Date.now();

  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh && cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }

  // Fetch fresh data
  const data = await fetchRatesData();
  cachedData = data;
  cacheTimestamp = now;

  return data;
}
