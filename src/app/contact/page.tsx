import Navigation from "@/components/Navigation";
import ContactPage from "@/components/ContactPage";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] dark:from-[#0a0a0a] dark:via-[#171717] dark:to-[#23272f]">
      <Navigation />
      <ContactPage />
      <Footer />
    </main>
  );
} 