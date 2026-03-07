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

export async function fetchWallet(token: string): Promise<WalletData | null> {
  try {
    const response = await api.get<{ data: WalletData }>('/wallet', token);
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
