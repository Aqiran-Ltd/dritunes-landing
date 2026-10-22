import type { Metadata } from "next";
import RatesPage from "@/components/RatesPage";

export const metadata: Metadata = {
  title: "Live Gift Card Rates & Exchange Calculator",
  description: "Check live secondary market gift card rates in Ghana (GHS, NGN, RMB). Calculate payouts for Apple/iTunes, Amazon, Steam, Google Play, Razer Gold & more with instant Mobile Money cashout and zero KYC.",
  keywords: [
    "gift card rates Ghana",
    "iTunes card rate Ghana",
    "Apple gift card rate GHS",
    "Amazon gift card rate GHS",
    "Steam wallet rate Ghana",
    "Google Play rate GHS",
    "Razer Gold rate Ghana",
    "sell gift cards Tamale",
    "highest gift card rates Ghana",
    "live gift card calculator Ghana",
    "instant MoMo cashout gift cards"
  ],
};

// card/region deep links (e.g. /rates?card=Steam&region=US) come from the home page.
export default async function Page({ searchParams }: { searchParams: Promise<{ card?: string; region?: string }> }) {
  const { card, region } = await searchParams;
  return <RatesPage deepCard={card} deepRegion={region} />;
}
