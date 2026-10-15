import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Aqiran Xchange. Visit our physical store in Tamale, reach out on WhatsApp, or send us an email for all your gift card trading inquiries.",
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