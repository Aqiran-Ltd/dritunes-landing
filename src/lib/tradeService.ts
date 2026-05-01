import { api } from '@/lib/api';

export interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  details: Record<string, string>; // Dynamic Key-Value pairs
  instructions?: string;
}

export interface TradePayload {
  amount: number;
  rate_id: number;
  asset_name: string;
  asset_type: 'gift_card' | 'crypto';
  payment_method_id?: number;
  withdrawal_preference?: 'wallet' | 'direct_payout';
  user_payment_method_id?: number;
  payment_method_name?: string;
  payment_account_name?: string;
  payment_account_number?: string;
  notes?: string;
  user_notes?: string;
  denomination?: string;
  user_payment_details?: Record<string, any>;
  attachments?: File[];
  code?: string | null;
}

export async function fetchCompanyPaymentMethods(token: string): Promise<PaymentMethod[]> {
  try {
    const response = await api.get<{ data: PaymentMethod[] }>('/payment-methods', token);
    return response.data || [];
  } catch (error) {
    console.error('Fetch Payment Methods Error:', error);
    return [];
  }
}

export async function createTrade(token: string, payload: TradePayload) {
  try {
    if (payload.attachments && payload.attachments.length > 0) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'user_payment_details') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'attachments') {
            (value as File[]).forEach(file => formData.append('attachments[]', file));
          } else {
            formData.append(key, value as any);
          }
        }
      });
      return await api.postForm('/trades', formData, token);
    }
    return await api.post('/trades', payload, token);
  } catch (error) {
    console.error('Create Trade Error:', error);
    throw error;
  }
}

export interface TradeQueryParams {
  per_page?: number;
  page?: number;
  search?: string;
  asset_type?: string;
  trade_status?: string;
  payment_status?: string;
}

export async function fetchTrades(token: string, params?: TradeQueryParams) {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.per_page) query.append('per_page', params.per_page.toString());
      if (params.page) query.append('page', params.page.toString());
      if (params.search) query.append('search', params.search);
      if (params.asset_type) query.append('asset_type', params.asset_type);
      if (params.trade_status) query.append('trade_status', params.trade_status);
      if (params.payment_status) query.append('payment_status', params.payment_status);
    }

    const queryString = query.toString();
    const endpoint = queryString ? `/trades?${queryString}` : '/trades';
    
    return await api.get(endpoint, token);
  } catch (error) {
    console.error('Fetch Trades Error:', error);
    throw error;
  }
}
