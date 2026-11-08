// Client for the token-authenticated buyer rate portal.
//
// Security notes:
//  - The token lives in sessionStorage only (tab-scoped, cleared on tab close) and is
//    never put in a URL, cookie or query string. Magic links carry it in the URL
//    *fragment* (#token=...), which browsers never send to servers or in Referer.
//  - Requests go through the same-origin proxy (/api/v1/buyer/*), which re-validates
//    the token format, schema, rate limits and lockouts before reaching the backend.

const BASE = '/api/v1/buyer';
const STORAGE_KEY = 'aqx_buyer_session';
const TOKEN_REGEX = /^[A-Za-z0-9]{32,128}$/;
const REQUEST_TIMEOUT_MS = 20_000;

export interface BuyerSheetItem {
  rate_id: number;
  country_code: string | null;
  denomination: string | null;
  type: string | null;
  /** Rate the site is currently using for this card (GH₵). */
  current_rate: number | null;
  /** Highest quote that goes live without approval; null when there is no limit. */
  ceiling: number | null;
  my_rate: number | null;
  /** Submitted but held for admin approval; not live yet. */
  pending_rate: number | null;
  expires_at: string | null;
  expired: boolean | null;
}

export interface BuyerSheetGroup {
  asset_name: string;
  items: BuyerSheetItem[];
}

export interface BuyerSheet {
  data: BuyerSheetGroup[];
  meta: {
    buyer: string;
    currency: string;
    quote_valid_hours: number;
    last_submitted_at: string | null;
  };
}

export interface BuyerSubmitResult {
  success: boolean;
  message: string;
  meta: {
    expires_at: string;
    /** rate_ids held for admin approval because they rose too far above the current rate */
    pending_approval: number[];
  };
}

export class BuyerApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function isValidToken(token: string): boolean {
  return TOKEN_REGEX.test(token);
}

export function loadToken(): string | null {
  try {
    const token = window.sessionStorage.getItem(STORAGE_KEY);
    return token && isValidToken(token) ? token : null;
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* storage unavailable: token stays in memory only */
  }
}

export function clearToken(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Pull a token from the URL fragment (#token=XYZ or #XYZ) and immediately scrub it
 * from the address bar / history so it cannot be copied, shared or re-read.
 */
export function consumeTokenFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;

  const candidate = hash.startsWith('token=') ? hash.slice(6) : hash;
  window.history.replaceState(null, '', window.location.pathname);

  return isValidToken(candidate) ? candidate : null;
}

async function call<T>(token: string, path: string, init: { method: 'GET' | 'POST'; body?: unknown }): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE}${path}`, {
      method: init.method,
      headers: {
        Accept: 'application/json',
        'X-Buyer-Token': token,
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      /* non-JSON error body */
    }

    if (!response.ok) {
      let message = typeof data?.message === 'string' ? data.message : 'Something went wrong.';
      if (response.status === 429) message = 'Too many requests. Please wait a moment and try again.';
      if (response.status === 401) message = 'Your access link is invalid or has been revoked.';
      throw new BuyerApiError(response.status, message);
    }

    return data as T;
  } catch (err) {
    if (err instanceof BuyerApiError) throw err;
    if ((err as Error)?.name === 'AbortError') {
      throw new BuyerApiError(0, 'The request timed out. Please try again.');
    }
    throw new BuyerApiError(0, 'Network error. Please check your connection.');
  } finally {
    clearTimeout(timer);
  }
}

export const buyerService = {
  sheet: (token: string) => call<BuyerSheet & { success: boolean }>(token, '/sheet', { method: 'GET' }),

  /** rate (GH₵): positive number to quote, null to withdraw a quote. */
  submit: (token: string, rates: Array<{ rate_id: number; rate: number | null }>) =>
    call<BuyerSubmitResult>(token, '/rates', {
      method: 'POST',
      body: { rates },
    }),

  confirm: (token: string, assetName?: string) =>
    call<{ success: boolean; message: string; meta: { renewed: number; expires_at: string } }>(
      token,
      '/rates/confirm',
      { method: 'POST', body: assetName ? { asset_name: assetName } : {} }
    ),
};
