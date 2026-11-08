import SectionHeading from "@/components/ui/SectionHeading";
import { AppStoreBadge, PlayStoreBadge } from "@/components/StoreBadges";

export default function AppDownloadSection() {
  return (
    <section id="download" className="bg-white py-14 dark:bg-gray-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 rounded-3xl bg-ink px-6 py-10 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-16">
          <SectionHeading
            onDark
            title="Take Aqiran Xchange with you"
            intro="Check live rates, trade and track your payout from the app. Same rates, same team, right on your phone."
          />
          <div className="flex w-full flex-col gap-5 sm:w-auto sm:flex-row lg:shrink-0">
            <PlayStoreBadge />
            <AppStoreBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
