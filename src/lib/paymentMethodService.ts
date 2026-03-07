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

export async function addUserPaymentMethod(token: string, data: Partial<UserPaymentMethod>) {
  return await api.post('/user-payment-methods', data, token);
}

export async function updateUserPaymentMethod(token: string, id: number, data: Partial<UserPaymentMethod>) {
  return await api.put(`/user-payment-methods/${id}`, data, token);
}

export async function deleteUserPaymentMethod(token: string, id: number) {
  return await api.delete(`/user-payment-methods/${id}`, token);
}
