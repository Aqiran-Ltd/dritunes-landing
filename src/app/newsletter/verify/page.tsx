import { Metadata } from "next";
import NewsletterVerifyPage from "@/components/NewsletterVerifyPage";

export const metadata: Metadata = {
  title: "Verify Newsletter Subscription",
  description: "Confirm your email subscription for Aqiran Xchange rate alerts and market updates.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <NewsletterVerifyPage />;
}
