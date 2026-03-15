// Re-uses the same base URL pattern as api.ts:
// Client-side → '/api/v1' (Next.js middleware injects x-api-key)
// Server-side  → direct backend URL with API_KEY header
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '/api/v1';
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  return `${backendUrl}/api/v1`;
};

function buildHeaders(token: string): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  // Server-side: inject key directly (client-side middleware does this)
  if (typeof window === 'undefined' && process.env.API_KEY) {
    h['x-api-key'] = process.env.API_KEY;
  }
  return h;
}

async function analyticsGet<T>(path: string, token: string): Promise<T> {
  const json = await analyticsFetch(path, token);
  return json.data as T;
}

async function analyticsFetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${getBaseUrl()}${path}`, { headers: buildHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Request failed: ${res.status}`);
  return json;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrendsSummary {
  trades: {
    current: number;
    previous: number;
    percentage_change: number | null;
  };
  volume: {
    current: number;
    previous: number;
    percentage_change: number | null;
  };
  pending_count: number;
  rejected_count: number;
  top_asset: string | null;
}

export interface TrendsVolume {
  labels: string[];
  dataset: {
    label: string;
    data: number[];
  };
  meta?: {
    days: number;
    metric: string;
    total: number;
  };
}

export interface TrendsDistribution {
  labels: string[];
  dataset: {
    counts: number[];
    payouts: number[];
    amounts: number[];
  };
  breakdown: Array<{
    asset_name: string;
    count: number;
    payout: number | string;
  }>;
  meta?: {
    days: number;
    asset_type: string;
    total_trades: number;
    total_payout: number;
  };
}

export interface TrendsRates {
  labels: string[];
  avg_dataset: number[];
  min_dataset: number[];
  max_dataset: number[];
  live_rates: Array<{
    id: number;
    asset_name: string;
    country_code: string;
    type: string;
    denomination: string;
    rate: string;
  }>;
}

export interface RateHistoryItem {
  id: number;
  rate_id: number;
  category: string;
  asset_name: string;
  old_rate: string;
  new_rate: string;
  old_source_rate: string;
  new_source_rate: string;
  old_margin: string;
  new_margin: string;
  action: 'created' | 'updated';
  changed_by: { id: number; name: string } | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  rate: {
    id: number;
    category: string;
    asset_name: string;
    denomination: string;
    country_code: string;
    type: string;
    rate: string;
    status: string;
  } | null;
}

export interface RateHistoryPage {
  data: RateHistoryItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

// ─── Fetch Helpers ────────────────────────────────────────────────────────────

export function fetchTrendsSummary(token: string, days = 30) {
  return analyticsGet<TrendsSummary>(`/trends/summary?days=${days}`, token);
}

export function fetchTrendsVolume(
  token: string,
  days = 30,
  metric: 'volume' | 'count' = 'volume'
) {
  return analyticsGet<TrendsVolume>(`/trends/volume?days=${days}&metric=${metric}`, token);
}

export function fetchTrendsDistribution(
  token: string,
  days = 30,
  asset_type?: 'crypto' | 'gift_card'
) {
  const q = new URLSearchParams({ days: String(days) });
  if (asset_type) q.set('asset_type', asset_type);
  return analyticsGet<TrendsDistribution>(`/trends/distribution?${q}`, token);
}

export function fetchTrendsRates(
  token: string,
  asset_name: string,
  days = 7,
  granularity: 'day' | 'hour' = 'day'
) {
  const q = new URLSearchParams({ asset_name, days: String(days), granularity });
  return analyticsGet<TrendsRates>(`/trends/rates?${q}`, token);
}

export async function fetchRateHistory(
  token: string,
  params: {
    page?: number;
    per_page?: number;
    asset_name?: string;
    category?: string;
    action?: string;
    from?: string;
    to?: string;
  } = {}
) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  q.set('per_page', String(params.per_page || 20));
  if (params.asset_name) q.set('asset_name', params.asset_name);
  if (params.category) q.set('category', params.category);
  if (params.action) q.set('action', params.action);
  if (params.from) q.set('from', params.from);
  if (params.to) q.set('to', params.to);
  
  const json = await analyticsFetch(`/rates/history?${q}`, token);
  return {
    data: json.data as RateHistoryItem[],
    meta: json.meta as RateHistoryPage['meta']
  };
}
