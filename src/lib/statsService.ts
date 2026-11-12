import { api } from '@/lib/api';

/** Aggregate figures from the backend's public `/stats` endpoint (paid trades only). */
export interface PublicStats {
  customersServed: number;
  tradesCompleted: number;
  totalPaidOutGhs: number;
  medianPayoutMinutes: number | null;
}

export interface StatFigure {
  value: string;
  label: string;
}

interface ApiStatsResponse {
  data?: {
    customers_served?: number;
    trades_completed?: number;
    total_paid_out_ghs?: number;
    median_payout_minutes?: number | null;
  };
}

/** Server-side. Returns null on any failure so pages quietly fall back to the fixed facts. */
export async function fetchPublicStats(): Promise<PublicStats | null> {
  try {
    const res = await api.get<ApiStatsResponse>('/stats');
    const d = res.data;
    if (!d) return null;
    return {
      customersServed: Number(d.customers_served ?? 0),
      tradesCompleted: Number(d.trades_completed ?? 0),
      totalPaidOutGhs: Number(d.total_paid_out_ghs ?? 0),
      medianPayoutMinutes: d.median_payout_minutes ?? null,
    };
  } catch (err) {
    console.error('Failed to fetch public stats:', err);
    return null;
  }
}

// Figures are rounded DOWN before the "+", so what we show is never more than the records support.
// Below these floors a number would look small, so it is left out rather than shown.
const MIN_CUSTOMERS = 100;
const MIN_PAID_OUT_GHS = 10_000;

function floorTo(n: number, step: number) {
  return Math.floor(n / step) * step;
}

export function formatCustomers(n: number): string | null {
  if (n < MIN_CUSTOMERS) return null;
  const step = n >= 1000 ? 100 : 10;
  return `${floorTo(n, step).toLocaleString('en-US')}+`;
}

export function formatPaidOut(ghs: number): string | null {
  if (ghs < MIN_PAID_OUT_GHS) return null;
  if (ghs >= 1_000_000) return `₵${(floorTo(ghs, 100_000) / 1_000_000).toFixed(1)}M+`;
  return `₵${(floorTo(ghs, 1000) / 1000).toLocaleString('en-US')}K+`;
}

/** Real figures that are large enough to show, in display order. */
export function realFigures(stats: PublicStats | null): StatFigure[] {
  if (!stats) return [];
  const out: StatFigure[] = [];
  const customers = formatCustomers(stats.customersServed);
  const paid = formatPaidOut(stats.totalPaidOutGhs);
  if (customers) out.push({ value: customers, label: 'customers have traded with us' });
  if (paid) out.push({ value: paid, label: 'paid out to date' });
  return out;
}
