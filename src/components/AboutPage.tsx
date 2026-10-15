import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import StartTradeLink from "@/components/StartTradeLink";
import { cardByName } from "@/lib/cardCatalogue";

const tradingFacts = [
  { value: "10,000+", label: "customers have traded with us" },
  { value: "₵50M+", label: "paid out to date" },
];

const tradeWays = [
  { title: "In your dashboard", body: "Upload the card, follow its status and choose how you get paid." },
  { title: "On WhatsApp or Telegram", body: "Message the team with your card details and get a quote." },
  { title: "At the counter in Tamale", body: "Bring the card in and trade face to face." },
];

const handOfCards = [
  { name: "Steam", rotate: -8, left: "0%", top: "18%" },
  { name: "Amazon", rotate: -1, left: "22%", top: "4%" },
  { name: "Apple / iTunes", rotate: 7, left: "44%", top: "16%" },
];

const services = [
  {
    title: "Digital literacy bootcamps",
    body: "Practical ICT and coding sessions for young people in Northern Ghana who want to work in the global gig economy.",
  },
  {
    title: "Digital entrepreneurship mentoring",
    body: "Guidance from people who do it every day on online payments, e-commerce platforms and staying safe while you trade.",
  },
  {
    title: "Getting small businesses online",
    body: "We help local businesses move from paper records to simple digital tools that save time and money.",
  },
  {
    title: "Community innovation hubs",
    body: "Physical spaces across the north with fast internet, equipment and room to build. The first ones are in progress.",
  },
];

const trust = [
  {
    title: "Money moves fast",
    body: "Once your card is verified, cedis go straight to your mobile money or bank account.",
  },
  {
    title: "Every trade is checked",
    body: "We verify every customer and every card, so the people you trade alongside are real.",
  },
  {
    title: "People, not a ticket queue",
    body: "Our team answers on WhatsApp and Telegram day and night, and you can always walk into the store.",
  },
];

const leadership = [
  "President, Computer Science Department, Tamale Technical University",
  "President, Association of Information Technology Students (AITES)",
  "Led student technology projects, including election automation tools",
];

const achievements = [
  "Led the AITES Dream Tour, a tech and culture project that took technology students to explore Ghana's heritage.",
  "Built several digital platforms and automated systems, for our own work and for clients.",
  "Partnered with local institutions to raise tech awareness and widen access to financial services.",
];

const plans = [
  "Open digital learning centres across Northern Ghana.",
  "Build fintech tools that make digital assets easier to use for African customers.",
  "Start a scholarship for talented young people who cannot afford training.",
  "Work with NGOs, government agencies and global e-commerce platforms.",
];

const sectionRule = "border-t border-gray-200 dark:border-gray-800";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950 text-ink dark:text-white">
      {/* The rename */}
      <section className="pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[clamp(2.75rem,7.5vw,6rem)] font-bold leading-[0.98] tracking-[-0.045em]">
            <span className="relative inline-block text-gray-400 dark:text-gray-600">
              Dr iTunes Consult
              <span
                aria-hidden="true"
                className="absolute left-[-2%] right-[-2%] top-[54%] h-[0.09em] rounded-full bg-crimson origin-left motion-safe:animate-strike"
              />
            </span>
            <br />
            is now Aqiran Xchange.
          </h1>
          <div className="mt-12 grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl">
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 text-pretty">
              Same founder, same team, same counter in Tamale. We buy gift cards from customers across Ghana and pay them in cedis, online or in person.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 text-pretty">
              The new name comes with a new website and app. Your account, your balance and your trade history are all still here.
            </p>
          </div>
        </div>
      </section>

      {/* The trading business */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          <div>
            <SectionHeading
              title="We buy gift cards and pay in cedis"
              intro="Customers across Ghana sell us iTunes, Amazon, Steam, Razer Gold and many other cards, as physical cards or e-codes. We check each card and pay out to mobile money, a bank account or an Aqiran wallet."
            />
            <dl className="mt-10 grid grid-cols-2 border-y border-gray-200 dark:border-gray-800">
              {tradingFacts.map((fact, i) => (
                <div key={fact.value} className={`py-6 ${i === 1 ? "pl-6 border-l border-gray-200 dark:border-gray-800" : "pr-4"}`}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd className="text-4xl font-bold tracking-[-0.04em] tabular-nums">{fact.value}</dd>
                  <dd className="mt-1 text-gray-600 dark:text-gray-400">{fact.label}</dd>
                </div>
              ))}
            </dl>
            <Link
              href="/rates"
              className="mt-8 inline-block font-semibold underline decoration-gray-300 dark:decoration-gray-600 underline-offset-8 hover:decoration-ink dark:hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
            >
              See what we pay today
            </Link>
          </div>

          <div>
            <div aria-hidden="true" className="relative aspect-[16/9] max-w-lg">
              {handOfCards.map((c) => {
                const art = cardByName(c.name);
                return art ? (
                  <div
                    key={c.name}
                    className="absolute w-[56%] aspect-[3/2] rounded-2xl overflow-hidden shadow-[0_24px_50px_-24px_rgba(26,26,29,0.6)] ring-1 ring-black/5"
                    style={{ left: c.left, top: c.top, transform: `rotate(${c.rotate}deg)` }}
                  >
                    <Image src={art.image} alt="" fill sizes="(min-width: 1024px) 290px, 56vw" className="object-cover" />
                  </div>
                ) : null;
              })}
            </div>
            <h3 className="mt-10 text-lg font-semibold">Three ways to trade, one rate</h3>
            <ul className="mt-3 border-t border-gray-200 dark:border-gray-800">
              {tradeWays.map((way) => (
                <li key={way.title} className="py-4 border-b border-gray-200 dark:border-gray-800">
                  <p className="font-semibold">{way.title}</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{way.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-ink text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading onDark title="Why people trust us with their cards" />
          <div className="mt-14 grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x divide-white/10">
            {trust.map((item, i) => (
              <div key={item.title} className={i === 0 ? "md:pr-10" : i === 1 ? "md:px-10" : "md:pl-10"}>
                <span aria-hidden="true" className="block w-8 h-1 rounded-full bg-gold mb-6" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-start">
          <div>
            <SectionHeading title="Alhassan Abdul-Hanan, founder" />
            <div className="mt-8 space-y-6 max-w-prose text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                Alhassan is a Ghanaian tech entrepreneur, digital educator and e-commerce specialist.
              </p>
              <p>
                He started in digital entrepreneurship in 2018 and has spent the years since mastering e-commerce and digital finance. His interest in education and digital inclusion led him to found Dr iTunes Consult, now Aqiran Xchange, to mentor the next generation of African tech builders.
              </p>
            </div>
          </div>
          <aside className="rounded-[28px] bg-gray-50 dark:bg-gray-900 p-8">
            <h3 className="font-semibold">Leadership before Aqiran</h3>
            <ul className="mt-5 space-y-4">
              {leadership.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Beyond trading */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
            <div className="lg:sticky lg:top-32 self-start">
              <SectionHeading
                title="Beyond trading"
                intro="Alhassan started this business to help close the digital divide in Northern Ghana. Alongside trading, we teach digital skills and help young people and small businesses get online, so more of West Africa can earn from the digital economy."
              />
              <p className="mt-10 text-6xl font-bold tracking-[-0.05em] tabular-nums">500+</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-sm">
                young people trained in digital entrepreneurship and staying safe online
              </p>
            </div>
            <div>
              <ul className={sectionRule}>
                {services.map((service) => (
                  <li key={service.title} className="py-7 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                    <p className="mt-2 max-w-prose leading-relaxed text-gray-600 dark:text-gray-400">{service.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-14 grid sm:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-semibold">What we have done</h3>
                  <ul className="mt-3 space-y-3">
                    {achievements.map((item) => (
                      <li key={item} className="leading-relaxed text-gray-600 dark:text-gray-400">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">What comes next</h3>
                  <ul className="mt-3 space-y-3">
                    {plans.map((item) => (
                      <li key={item} className="leading-relaxed text-gray-600 dark:text-gray-400">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-[28px] bg-gold text-ink p-8 md:p-12">
            <p className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] max-w-xl text-balance">
              Have a card to sell? See what it is worth today.
            </p>
            <div className="flex flex-wrap gap-4">
              <StartTradeLink
                location="About"
                className="inline-flex items-center h-14 px-8 rounded-full bg-ink text-white font-semibold transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Start a trade
              </StartTradeLink>
              <Link
                href="/rates"
                className="inline-flex items-center h-14 px-2 font-semibold underline decoration-ink/30 underline-offset-8 hover:decoration-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink rounded"
              >
                Check today&apos;s rates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
