import { api } from './api';

export interface UserPaymentMethod {
  id: number;
  payment_type?: 'momo' | 'bank'; 
  payment_method?: {
    name: string;
    type: string;
  };
  account_name: string;
  account_number: string;
  bank_name?: string;
  branch?: string;
  is_default: boolean;
  details?: Record<string, any>;
  /** Set by the backend whenever the account details were added or changed. */
  payout_details_changed_at?: string | null;
}

/**
 * When a freshly added/edited payout account becomes usable for withdrawals, or null if it already is.
 * `holdHours` comes from the backend's `payout_cooldown_hours` setting (0 = no hold). Display only:
 * the server enforces it.
 */
export function payoutHoldEndsAt(method: UserPaymentMethod, holdHours: number): Date | null {
  if (!method.payout_details_changed_at || holdHours <= 0) return null;
  const ends = new Date(new Date(method.payout_details_changed_at).getTime() + holdHours * 3600_000);
  return Number.isNaN(ends.getTime()) || ends.getTime() <= Date.now() ? null : ends;
}

export async function fetchUserPaymentMethods(token: string): Promise<UserPaymentMethod[]> {
  try {
    const response = await api.get<{ data: UserPaymentMethod[] }>('/user-payment-methods', token);
    return response.data || [];
  } catch (error) {
    console.error('Fetch User Payment Methods Error:', error);
    return [];
  }
}

export async function addUserPaymentMethod(token: string, data: Partial<UserPaymentMethod>, currentPassword?: string) {
  return await api.post('/user-payment-methods', currentPassword ? { ...data, current_password: currentPassword } : data, token);
}

export async function updateUserPaymentMethod(token: string, id: number, data: Partial<UserPaymentMethod>, currentPassword?: string) {
  return await api.put(`/user-payment-methods/${encodeURIComponent(String(id))}`, currentPassword ? { ...data, current_password: currentPassword } : data, token);
}

export async function deleteUserPaymentMethod(token: string, id: number) {
  return await api.delete(`/user-payment-methods/${encodeURIComponent(String(id))}`, token);
}
