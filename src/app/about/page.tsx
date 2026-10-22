import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us & Secondary Marketplace Disclaimers",
  description: "Learn about Aqiran Xchange (formerly Dr iTunes Consult) — Ghana's trusted independent secondary gift card marketplace. Instant Mobile Money and bank payouts with zero KYC across web and mobile apps.",
};

export default function About() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <AboutPage />
      <Footer />
    </main>
  );
} 