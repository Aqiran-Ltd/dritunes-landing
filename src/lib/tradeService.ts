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
  trade_type: 'buy' | 'sell';
  asset_name: string;
  asset_type: 'gift_card' | 'crypto';
  payment_method_id?: number;
  // Additional fields for Sell mode
  payment_method_name?: string;     
  payment_account_name?: string;    
  payment_account_number?: string;  
  notes?: string;
  user_notes?: string;
  user_payment_details?: Record<string, any>;
}

export async function fetchCompanyPaymentMethods(token: string): Promise<PaymentMethod[]> {
  // Since the user says "payment methods just list company's payment methods"
  // and GET /payment-methods is public now, we can try without token too if needed.
  // But trades are usually authenticated.
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
    return await api.post('/trades', payload, token);
  } catch (error) {
    console.error('Create Trade Error:', error);
    throw error;
  }
}
