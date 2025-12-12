import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PriceUpdateSection from "@/components/PriceUpdateSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { fetchRatesFromSheets } from "@/lib/googleSheetsServer";

export default async function Home() {
  const ratesData = await fetchRatesFromSheets().catch((err) => {
    console.error("Failed to fetch rates on server:", err);
    return { categories: [] };
  });

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f] transition-colors duration-300">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <PriceUpdateSection initialCategories={ratesData.categories} />
      <FeaturesSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
