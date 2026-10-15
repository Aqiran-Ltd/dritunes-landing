import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import TradeSteps from "@/components/TradeSteps";

const promises = [
  {
    title: "We never ask for codes outside our app",
    body: "Only trade on aqiranxchange.com, our app, or our official WhatsApp. Anyone asking elsewhere is not us.",
  },
  {
    title: "A real counter you can walk up to",
    body: "Our store in Tamale serves customers in person. Online or at the counter, you deal with the same team.",
  },
  {
    title: "No hidden fees",
    body: "What the calculator shows is what lands in your account. Rates are public and change in the open.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-gray-50 dark:bg-gray-900 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              title="From card to cash in four steps"
              intro="Every trade is tracked in your dashboard, so you always know where your card and your money are."
            />
            <Link
              href="/trade"
              className="mt-8 inline-flex items-center h-12 px-6 rounded-full bg-ink text-white font-semibold transition-colors hover:bg-gray-800 dark:bg-gold dark:text-ink dark:hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Start a trade
            </Link>
          </div>

          <TradeSteps />
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-gray-200 dark:divide-gray-800">
          {promises.map((promise, i) => (
            <div key={promise.title} className={i === 0 ? "md:pr-10" : i === 1 ? "md:px-10" : "md:pl-10"}>
              <h3 className="text-lg font-semibold text-ink dark:text-white">{promise.title}</h3>
              <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{promise.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
