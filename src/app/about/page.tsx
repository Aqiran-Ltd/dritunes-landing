import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Aqiran Xchange, a leading digital services and gift card trading platform. Our mission is to provide secure, fast, and reliable digital services.",
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