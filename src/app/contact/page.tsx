import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Dr iTunes Consult. Visit our physical store in Tamale, reach out on WhatsApp, or send us an email for all your crypto and gift card trading inquiries.",
};

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <ContactPage />
      <Footer />
    </main>
  );
} 