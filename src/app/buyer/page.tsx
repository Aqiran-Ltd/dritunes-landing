import type { Metadata } from "next";
import BuyerPortal from "@/components/buyer/BuyerPortal";

export const metadata: Metadata = {
  title: "Buyer Rate Portal",
  description: "Private rate submission portal for Aqiran Xchange partner buyers.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function Page() {
  return <BuyerPortal />;
}
