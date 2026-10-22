import { Metadata } from "next";
import NewsletterUnsubscribePage from "@/components/NewsletterUnsubscribePage";

export const metadata: Metadata = {
  title: "Unsubscribe from Newsletter",
  description: "Opt-out from our newsletter updates.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <NewsletterUnsubscribePage />;
}
