import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us & 24/7 Trading Desk",
  description: "Get in touch with Aqiran Xchange (formerly Dr iTunes Consult). Chat with our 24/7 support desk on WhatsApp and Telegram, visit our physical counter in Tamale, Ghana, or email info@aqiranxchange.com.",
  keywords: [
    "contact Aqiran Xchange",
    "Aqiran Xchange Tamale",
    "gift card trading WhatsApp Ghana",
    "Dr iTunes Consult contact",
    "gift card support Ghana"
  ],
};

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <ContactPage />
      <Footer />
    </main>
  );
} 