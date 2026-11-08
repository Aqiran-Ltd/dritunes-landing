import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";
import { AppStoreBadge, PlayStoreBadge } from "@/components/StoreBadges";

export const metadata: Metadata = {
  title: "Download the Aqiran Xchange App",
  description:
    "Get the Aqiran Xchange mobile app. Available now on Google Play for Android, with the App Store version coming soon.",
  alternates: { canonical: "/download" },
};

export default function Download() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navigation />
      <section className="flex flex-1 items-center px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <BrandLogo className="h-12" />
          <h1 className="mt-10 text-balance text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-ink dark:text-white sm:text-5xl">
            Sell gift cards from your pocket.
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            Check live rates, trade and get paid to mobile money or your bank, all in the Aqiran Xchange app.
          </p>
          <div className="mt-12 flex w-full flex-col items-center justify-center gap-5 sm:flex-row">
            <PlayStoreBadge />
            <AppStoreBadge />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
