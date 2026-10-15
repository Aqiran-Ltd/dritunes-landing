import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PriceUpdateSection from "@/components/PriceUpdateSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { fetchRates } from "@/lib/ratesService";
import { topRates } from "@/lib/rateBoard";

export const metadata: Metadata = {
  title: "Home | Aqiran Xchange - Ghana's Trusted Gift Card Service",
  description: "Securely trade Gift Cards at the best rates in Ghana. Visit our Tamale store or trade online 24/7.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let categories: any[] = []; // Explicit typing handled by component
  let updatedAt: string | undefined;
  try {
    const ratesData = await fetchRates();
    categories = ratesData.categories;
    updatedAt = ratesData.lastUpdated;
  } catch (err) {
    console.error("Failed to fetch rates on server:", err);
  }

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <HeroSection boardRows={topRates(categories)} updatedAt={updatedAt} />
      <StatsSection />
      <FeaturesSection />
      <PriceUpdateSection initialCategories={categories} />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
