import { api } from '@/lib/api';

export interface TradeMessageUser {
  id: number;
  name: string;
  profile_picture?: string | null;
  profile_picture_url?: string | null;
}

export interface TradeMessage {
  id: number;
  trade_id: number;
  user_id: number;
  message: string | null;
  attachment_path: string[] | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: TradeMessageUser;
}

export interface TradeMessagesPage {
  current_page: number;
  data: TradeMessage[];
  last_page: number;
  per_page: number;
  total: number;
  trade_owner_id?: number;
}

export async function fetchTradeMessages(tradeNumber: string, token: string, page = 1): Promise<TradeMessagesPage> {
  const safeTrade = encodeURIComponent(tradeNumber);
  const safePage = encodeURIComponent(String(page));
  const response: any = await api.get(`/trades/${safeTrade}/messages?page=${safePage}`, token);
  return response.data;
}

export async function sendTradeMessage(
  tradeNumber: string,
  token: string,
  payload: { message?: string; attachments?: File[] }
): Promise<TradeMessage> {
  const safeTrade = encodeURIComponent(tradeNumber);
  let response: any;
  if (payload.attachments && payload.attachments.length > 0) {
    const formData = new FormData();
    if (payload.message) formData.append('message', payload.message);
    payload.attachments.forEach((file) => formData.append('attachments[]', file));
    response = await api.postForm(`/trades/${safeTrade}/messages`, formData, token);
  } else {
    response = await api.post(`/trades/${safeTrade}/messages`, { message: payload.message }, token);
  }
  return response.data;
}

export async function markTradeMessagesRead(tradeNumber: string, token: string): Promise<void> {
  const safeTrade = encodeURIComponent(tradeNumber);
  await api.post(`/trades/${safeTrade}/messages/read`, {}, token);
}

export async function deleteTradeMessage(tradeNumber: string, token: string, messageId: number): Promise<void> {
  const safeTrade = encodeURIComponent(tradeNumber);
  const safeMsgId = encodeURIComponent(String(messageId));
  await api.delete(`/trades/${safeTrade}/messages/${safeMsgId}`, token);
}
