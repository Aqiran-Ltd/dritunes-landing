import type { Metadata } from 'next';
import TradePage from '@/components/TradePage';

export const metadata: Metadata = {
  title: 'Sell Gift Cards Online — Instant MoMo & Bank Payouts',
  description: 'Trade unredeemed gift cards (Apple, Amazon, Steam, Google Play, Razer) on Ghana\'s independent secondary marketplace. Instant cashouts to MTN MoMo, Telecel Cash & bank accounts with zero KYC.',
  keywords: [
    "trade gift cards Ghana",
    "sell gift cards online Ghana",
    "gift card exchange Tamale",
    "gift card trading app Ghana",
    "instant MoMo payment gift cards",
    "sell Steam cards Ghana",
    "sell Apple cards Ghana",
    "no KYC gift card cashout"
  ],
};

export default function Page() {
  return <TradePage />;
}