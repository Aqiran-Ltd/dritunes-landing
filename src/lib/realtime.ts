import Pusher, { type Channel } from 'pusher-js';
import { api } from '@/lib/api';
import type { TradeMessage } from '@/lib/chatService';

/**
 * Live trade chat over the backend's Reverb server (Pusher protocol).
 *
 * Needs NEXT_PUBLIC_REVERB_APP_KEY and NEXT_PUBLIC_REVERB_HOST (the public ws host, e.g. ws.aqiranxchange.com).
 * Without them, or if the socket can't connect, `subscribeTradeChat` reports unavailable and the chat
 * keeps polling. Private-channel auth goes through our own /api/v1 proxy, so the API key never reaches the browser.
 */

const KEY = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
const HOST = process.env.NEXT_PUBLIC_REVERB_HOST;
const PORT = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 443);
const SECURE = (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https') === 'https';

export const realtimeConfigured = Boolean(KEY && HOST);

export interface TradeChatHandlers {
  onMessage: (message: TradeMessage) => void;
  onDeleted: (messageId: number) => void;
  /** The other side opened the chat: our messages are now read. */
  onRead: (readerId: number, readAt: string) => void;
  /** true once the socket is live, false when it drops (caller falls back to polling). */
  onStatus: (live: boolean) => void;
}

let client: Pusher | null = null;
let clientToken: string | null = null;

function getClient(token: string): Pusher | null {
  if (!realtimeConfigured || typeof window === 'undefined') return null;

  // A different login needs a fresh connection: the auth handler captured the old token.
  if (client && clientToken !== token) {
    client.disconnect();
    client = null;
  }

  if (!client) {
    clientToken = token;
    client = new Pusher(KEY as string, {
      cluster: 'reverb', // required by the library, ignored when wsHost is set
      wsHost: HOST,
      wsPort: PORT,
      wssPort: PORT,
      forceTLS: SECURE,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      channelAuthorization: {
        endpoint: '/api/v1/broadcasting/auth',
        transport: 'ajax',
        customHandler: ({ socketId, channelName }, callback) => {
          api
            .post<{ auth: string; channel_data?: string }>('/broadcasting/auth', { socket_id: socketId, channel_name: channelName }, token)
            .then((res) => callback(null, res))
            .catch((err) => callback(err, null));
        },
      },
    });
  }
  return client;
}

/** Returns an unsubscribe function, or null when live updates aren't available. */
export function subscribeTradeChat(tradeId: number, token: string, handlers: TradeChatHandlers): (() => void) | null {
  const pusher = getClient(token);
  if (!pusher) return null;

  const channel: Channel = pusher.subscribe(`private-trade.${tradeId}`);

  channel.bind('pusher:subscription_succeeded', () => handlers.onStatus(true));
  channel.bind('pusher:subscription_error', () => handlers.onStatus(false));
  channel.bind('TradeMessageSent', (data: { message?: TradeMessage }) => data?.message && handlers.onMessage(data.message));
  channel.bind('TradeMessageDeleted', (data: { message_id?: number }) => data?.message_id && handlers.onDeleted(data.message_id));
  channel.bind('TradeMessagesRead', (data: { reader_id?: number; read_at?: string }) =>
    data?.reader_id && handlers.onRead(data.reader_id, data.read_at ?? new Date().toISOString())
  );

  const onState = ({ current }: { current: string }) => handlers.onStatus(current === 'connected' && channel.subscribed);
  pusher.connection.bind('state_change', onState);

  return () => {
    pusher.connection.unbind('state_change', onState);
    channel.unbind_all();
    pusher.unsubscribe(`private-trade.${tradeId}`);
  };
}
