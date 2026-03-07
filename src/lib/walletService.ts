import { api } from './api';

export interface WalletTransaction {
  id: number;
  amount: string;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description: string;
  created_at: string;
  trade_id?: number;
  withdrawal_id?: number;
  notes?: string;
  trade?: any; // Replace with concrete Trade interface later if needed
}

export interface WalletData {
  balance: string;
  transactions: {
    current_page: number;
    data: WalletTransaction[];
    last_page: number;
    total: number;
  };
}

export interface WalletQueryParams {
  per_page?: number;
  page?: number;
  search?: string;
  type?: string;
  status?: string;
}

export async function fetchWallet(token: string, params?: WalletQueryParams): Promise<WalletData | null> {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.per_page) query.append('per_page', params.per_page.toString());
      if (params.page) query.append('page', params.page.toString());
      if (params.search) query.append('search', params.search);
      if (params.type) query.append('type', params.type);
      if (params.status) query.append('status', params.status);
    }
    
    const queryString = query.toString();
    const endpoint = queryString ? `/wallet?${queryString}` : '/wallet';
    
    const response = await api.get<{ data: WalletData }>(endpoint, token);
    return response.data;
  } catch (error) {
    console.error('Fetch Wallet Error:', error);
    return null;
  }
}

export async function requestWithdrawal(token: string, amount: number, userPaymentMethodId: number) {
  return await api.post('/wallet/withdraw', {
    amount,
    user_payment_method_id: userPaymentMethodId
  }, token);
}
