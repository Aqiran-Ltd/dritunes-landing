import { Metadata } from "next";
import NewsletterUnsubscribePage from "@/components/NewsletterUnsubscribePage";

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter | Dr iTunes Consult",
  description: "Opt-out from our newsletter updates.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <NewsletterUnsubscribePage />;
}
