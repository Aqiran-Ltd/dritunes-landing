import { Metadata } from "next";
import NewsletterVerifyPage from "@/components/NewsletterVerifyPage";

export const metadata: Metadata = {
  title: "Verify Newsletter Subscription | Aqiran Xchange",
  description: "Confirm your residency in our digital ecosystem.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <NewsletterVerifyPage />;
}
