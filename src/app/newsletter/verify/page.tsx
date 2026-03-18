import { Metadata } from "next";
import NewsletterVerifyPage from "@/components/NewsletterVerifyPage";

export const metadata: Metadata = {
  title: "Verify Newsletter Subscription | Dr iTunes Consult",
  description: "Confirm your residency in our digital ecosystem.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <NewsletterVerifyPage />;
}
