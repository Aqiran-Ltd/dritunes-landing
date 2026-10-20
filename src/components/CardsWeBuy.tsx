import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import BrandImage from "@/components/BrandImage";
import { CATALOGUE, ratesHref } from "@/lib/cardCatalogue";
import type { GiftCardBrand } from "@/lib/ratesService";

const SHOWN = 9;

interface ShownBrand {
  name: string;
  imageUrl?: string;
  link: string;
}

/** Brands from the admin panel, most-traded first; our own catalogue if the API is unavailable. */
function pickBrands(brands: GiftCardBrand[]): { shown: ShownBrand[]; rest: string[] } {
  const live = brands
    .filter((b) => b.rates_count > 0 && (!b.status || b.status === "active"))
    .sort((a, b) => b.rates_count - a.rates_count || a.name.localeCompare(b.name));

  if (live.length === 0) {
    return { shown: CATALOGUE.map((c) => ({ name: c.name, link: ratesHref(c.query) })), rest: [] };
  }
  return {
    shown: live.slice(0, SHOWN).map((b) => ({ name: b.name, imageUrl: b.image_url, link: ratesHref(b.name) })),
    rest: live.slice(SHOWN).map((b) => b.name),
  };
}

export default function CardsWeBuy({ brands }: { brands: GiftCardBrand[] }) {
  const { shown, rest } = pickBrands(brands);
  const restLabel =
    rest.length > 0
      ? `${rest.slice(0, 4).join(", ")}${rest.length > 4 ? ` and ${rest.length - 4} more` : ""}`
      : "Every brand, country and amount we buy";

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
          {shown.map((brand) => (
            <li key={brand.name}>
              <Link
                href={brand.link}
                className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <div className="relative aspect-[3/2] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-[0_12px_30px_-18px_rgba(26,26,29,0.5)] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-18px_rgba(26,26,29,0.55)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <BrandImage name={brand.name} imageUrl={brand.imageUrl} sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 45vw" />
                </div>
                <p className="mt-3 font-medium text-ink dark:text-white">
                  {brand.name}
                  <span className="block text-sm font-normal text-gray-600 dark:text-gray-400 group-hover:text-ink dark:group-hover:text-white underline-offset-4 group-hover:underline">
                    See rates
                  </span>
                </p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rates"
              className="group flex flex-col justify-between aspect-[3/2] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 transition-colors hover:border-gold hover:bg-gold-50 dark:hover:bg-gold-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="text-sm leading-snug text-gray-600 dark:text-gray-400">{restLabel}</span>
              <span className="font-semibold text-ink dark:text-white">Find your card</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
