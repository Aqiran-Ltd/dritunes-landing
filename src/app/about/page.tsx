import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Aqiran Xchange, Ghana's leading ICT consultancy and gift card trading company. Our mission is to provide secure, fast, and reliable digital services.",
};

export default function About() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f] transition-colors duration-300">
      <Navigation />
      <AboutPage />
      <Footer />
    </main>
  );
} 