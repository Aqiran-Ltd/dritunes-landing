import type { Metadata } from "next";
import RatesPage from "@/components/RatesPage";

export const metadata: Metadata = {
  title: "Live Gift Card Rates",
  description: "Check our live gift card rates for GHS, NGN, and RMB. We offer the best rates in Ghana for iTunes, Amazon, Steam, Google Play, and more. Trade securely with Aqiran Xchange.",
  keywords: [
    "gift card rates Ghana",
    "iTunes card rate Ghana",
    "Amazon gift card rate GHS",
    "Steam card rate Ghana",
    "Google Play rate GHS",
    "sell gift cards Tamale",
    "highest gift card rates Ghana"
  ],
};

export default function Page() {
  return <RatesPage />;
}
