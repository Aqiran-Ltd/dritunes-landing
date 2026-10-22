import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CardsWeBuy from "@/components/CardsWeBuy";
import PriceUpdateSection from "@/components/PriceUpdateSection";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import MobileQuickActions from "@/components/MobileQuickActions";
import { fetchRates, fetchGiftCardGroups, withBrandImages, type GiftCardBrand } from "@/lib/ratesService";
import { topRates } from "@/lib/rateBoard";

export const metadata: Metadata = {
  title: "Independent Gift Card Exchange & Instant Cedis Payouts",
  description: "Sell Apple, Amazon, Steam, Razer, and Google Play gift cards at live, transparent market rates. Instant Mobile Money and bank payouts with zero KYC. Trade online 24/7 or visit our Tamale counter.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let categories: any[] = []; // Explicit typing handled by component
  let updatedAt: string | undefined;
  let brands: GiftCardBrand[] = [];
  try {
    const [ratesData, brandList] = await Promise.all([fetchRates(), fetchGiftCardGroups()]);
    brands = brandList;
    categories = withBrandImages(ratesData.categories, brands);
    updatedAt = ratesData.lastUpdated;
  } catch (err) {
    console.error("Failed to fetch rates on server:", err);
  }

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navigation />
      <HeroSection boardRows={topRates(categories)} updatedAt={updatedAt} />
      <StatsSection />
      <CardsWeBuy brands={brands} />
      <FeaturesSection />
      <PriceUpdateSection initialCategories={categories} />
      <NewsletterSection />
      <Footer />
      <MobileQuickActions />
    </main>
  );
}
