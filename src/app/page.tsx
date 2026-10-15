import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PriceUpdateSection from "@/components/PriceUpdateSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { fetchRates } from "@/lib/ratesService";

export const metadata: Metadata = {
  title: "Home | Aqiran Xchange - Ghana's Trusted Gift Card Service",
  description: "Securely trade Gift Cards at the best rates in Ghana. Visit our Tamale store or trade online 24/7.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let categories: any[] = []; // Explicit typing handled by component
  try {
    const ratesData = await fetchRates();
    categories = ratesData.categories;
  } catch (err) {
    console.error("Failed to fetch rates on server:", err);
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f] transition-colors duration-300">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <PriceUpdateSection initialCategories={categories} />
      <FeaturesSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
