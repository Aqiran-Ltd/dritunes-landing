import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import TradeSteps from "@/components/TradeSteps";

const people = [
  { label: "WhatsApp", value: "+233 54 843 4599", href: "https://wa.me/233548434599", external: true },
  { label: "Telegram", value: "@dritunes", href: "https://t.me/dritunes", external: true },
  { label: "Email", value: "info@aqiranxchange.com", href: "mailto:info@aqiranxchange.com" },
  { label: "Store", value: "Tamale, Northern Region" },
];

const linkCls =
  "font-semibold underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4 hover:decoration-ink dark:hover:decoration-white transition-colors";

export default function TradePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-ink dark:text-white">
      <Navigation />

      <section className="pt-36 pb-20 lg:pt-44">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            as="h1"
            title="Start a trade"
            intro="Trade in your dashboard and track every step yourself, or hand your card to one of our team. The rate is the same either way."
          />

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="rounded-[28px] bg-ink text-white p-8 md:p-10 flex flex-col">
              <h2 className="text-2xl font-semibold tracking-tight">In your dashboard</h2>
              <p className="mt-3 leading-relaxed text-gray-300">
                Upload your card, follow its status live, chat with the team about it, and choose a payout to mobile money, bank or your Aqiran wallet.
              </p>
              <div className="mt-auto pt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center h-14 px-8 rounded-full bg-gold text-ink font-semibold transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  Create an account
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center h-14 px-2 font-semibold underline decoration-white/30 underline-offset-8 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
                >
                  Log in
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-gray-200 dark:border-gray-800 p-8 md:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">With a person</h2>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
                Message us with your card details and we will quote you, or walk into the store.
              </p>
              <dl className="mt-6 border-t border-gray-200 dark:border-gray-800">
                {people.map((p) => (
                  <div key={p.label} className="py-3.5 border-b border-gray-200 dark:border-gray-800 flex justify-between gap-4">
                    <dt className="text-gray-600 dark:text-gray-400">{p.label}</dt>
                    <dd className="text-right">
                      {p.href ? (
                        <a href={p.href} {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={linkCls}>
                          {p.value}
                        </a>
                      ) : (
                        <span className="font-semibold">{p.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading title="What happens next" intro="Whichever way you trade, your card goes through the same four steps." />
            <Link href="/rates" className={`mt-8 inline-block ${linkCls} underline-offset-8`}>
              Check today&apos;s rates first
            </Link>
          </div>
          <TradeSteps />
        </div>
      </section>

      <Footer />
    </main>
  );
}
