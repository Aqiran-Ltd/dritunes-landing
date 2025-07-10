import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AboutSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
