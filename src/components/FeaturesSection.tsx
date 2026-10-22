import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import StartTradeLink from "@/components/StartTradeLink";
import TradeSteps from "@/components/TradeSteps";
import { 
  ShieldCheckIcon, 
  BuildingStorefrontIcon, 
  CheckBadgeIcon 
} from "@heroicons/react/24/outline";

const promises = [
  {
    title: "We never ask for codes outside our app",
    body: "Only trade on aqiranxchange.com, our app, or our official WhatsApp. Anyone asking elsewhere is not us.",
    icon: ShieldCheckIcon,
  },
  {
    title: "A real counter you can walk up to",
    body: "Our store in Tamale serves customers in person. Online or at the counter, you deal with the same team.",
    icon: BuildingStorefrontIcon,
  },
  {
    title: "No hidden fees",
    body: "What the calculator shows is what lands in your account. Rates are public and change in the open.",
    icon: CheckBadgeIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 dark:bg-gray-900 py-14 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 sm:gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              title="From card to cash in four steps"
              intro="Every trade is tracked in your dashboard, so you always know where your card and your money are."
            />
            <div className="mt-6 sm:mt-8">
              <StartTradeLink
                location="How it works"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-full bg-ink text-white font-semibold transition-colors hover:bg-gray-800 dark:bg-gold dark:text-ink dark:hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold shadow-md"
              >
                Start a trade
              </StartTradeLink>
            </div>
          </div>

          <TradeSteps />
        </div>

        <div className="mt-14 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-0 md:divide-x divide-gray-200 dark:divide-gray-800">
          {promises.map((promise, i) => {
            const Icon = promise.icon;
            return (
              <div 
                key={promise.title} 
                className={`p-5 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800 shadow-sm md:bg-transparent md:p-0 md:border-0 md:shadow-none ${
                  i === 0 ? "md:pr-10" : i === 1 ? "md:px-10" : "md:pl-10"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gold/15 dark:bg-gold/20 text-gold-700 dark:text-gold-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-ink dark:text-white">{promise.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">{promise.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
