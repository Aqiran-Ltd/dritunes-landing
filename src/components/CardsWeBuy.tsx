import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATALOGUE } from "@/lib/cardCatalogue";

export default function CardsWeBuy() {
  return (
    <section id="cards" className="bg-white dark:bg-gray-950 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            title="Cards we buy"
            intro="Physical cards and e-codes from the US, UK, Europe and more. Rates depend on the brand, country and amount."
          />
          <Link
            href="/rates"
            className="shrink-0 font-semibold text-ink dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-8 hover:decoration-ink dark:hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
          >
            See the rate for each card
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8">
          {CATALOGUE.map((card) => (
            <li key={card.name}>
              <figure>
                <div className="relative aspect-[3/2] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-[0_12px_30px_-18px_rgba(26,26,29,0.5)]">
                  <Image src={card.image} alt={`${card.name} gift card`} fill sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 45vw" className="object-cover" />
                </div>
                <figcaption className="mt-3 font-medium text-ink dark:text-white">{card.name}</figcaption>
              </figure>
            </li>
          ))}
          <li>
            <Link
              href="/rates"
              className="group flex flex-col justify-between aspect-[3/2] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 transition-colors hover:border-gold hover:bg-gold-50 dark:hover:bg-gold-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="text-sm leading-snug text-gray-600 dark:text-gray-400">
                PlayStation, Sephora, Footlocker, H&amp;M and many more
              </span>
              <span className="font-semibold text-ink dark:text-white">Find your card</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
