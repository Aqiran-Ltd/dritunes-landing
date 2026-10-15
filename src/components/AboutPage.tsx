import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

const mission = [
  "Teach young people digital literacy, digital finance and how to run a business online.",
  "Help people and small businesses get set up online, from websites to safe peer-to-peer trading.",
  "Bring digital and entrepreneurial skills to communities that are usually left out.",
  "Build digital work that pays young Africans a steady income.",
];

const services = [
  {
    title: "Gift card trading with direct payout",
    body: "Sell your gift cards and receive cedis straight to mobile money or your bank. This is the part of Aqiran most people know.",
  },
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
              Same founder, same team, same counter in Tamale. Alhassan Abdul-Hanan, known to many of you as Dr.&nbsp;iTunes, started this business to close the digital divide in Northern Ghana.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 text-pretty">
              Gift card trading pays the bills and keeps cedis moving for thousands of customers. Alongside it, we run bootcamps and mentoring that help young people across West Africa earn from the global digital economy.
            </p>
          </div>
        </div>
      </section>

      {/* Vision and mission */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-24">
          <div>
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Where we are going</h2>
            <p className="mt-4 text-3xl md:text-4xl font-semibold leading-[1.15] tracking-[-0.03em] text-balance">
              To be the digital transformation partner West Africa relies on, with tech education open to everyone and communities better off for it.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">How we get there</h2>
            <ul className={`mt-4 ${sectionRule}`}>
              {mission.map((item) => (
                <li key={item} className="py-5 border-b border-gray-200 dark:border-gray-800 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              title="Trading is half of what we do"
              intro="The other half is teaching. Both come from the same idea: technology should put money in more pockets in the north."
            />
          </div>
          <ul className={sectionRule}>
            {services.map((service) => (
              <li key={service.title} className="py-8 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-2 max-w-prose leading-relaxed text-gray-600 dark:text-gray-400">{service.body}</p>
              </li>
            ))}
          </ul>
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
                Alhassan is a Ghanaian tech entrepreneur, digital educator and e-commerce specialist. Most of our customers know him as Dr.&nbsp;iTunes.
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

      {/* Journey */}
      <section className={`py-24 lg:py-32 ${sectionRule}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]">What we have done</h2>
              <p className="mt-8 text-6xl md:text-7xl font-bold tracking-[-0.05em] tabular-nums">500+</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-sm">
                young people trained in digital entrepreneurship and staying safe online
              </p>
              <ul className={`mt-10 ${sectionRule}`}>
                {achievements.map((item) => (
                  <li key={item} className="py-5 border-b border-gray-200 dark:border-gray-800 leading-relaxed text-gray-700 dark:text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]">What comes next</h2>
              <ul className={`mt-8 ${sectionRule}`}>
                {plans.map((item) => (
                  <li key={item} className="py-5 border-b border-gray-200 dark:border-gray-800 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-24 flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-[28px] bg-gold text-ink p-8 md:p-12">
            <p className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] max-w-xl text-balance">
              Have a card to sell? See what it is worth today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/trade"
                className="inline-flex items-center h-14 px-8 rounded-full bg-ink text-white font-semibold transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Start a trade
              </Link>
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
