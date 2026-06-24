import type { Metadata } from 'next';
import TradePage from '@/components/TradePage';

export const metadata: Metadata = {
  title: 'Trade Now',
  description: 'Start trading your gift cards with Dr iTunes Consult. Instant payouts, secure processing, and the best rates in Ghana.',
  keywords: [
    "trade gift cards Ghana",
    "gift card exchange Tamale",
    "gift card trading app",
    "instant MoMo payment gift cards"
  ],
};

export default function Page() {
  return <TradePage />;
}