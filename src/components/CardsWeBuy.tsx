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
    <section id="cards" className="bg-white dark:bg-gray-950 py-14 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <SectionHeading
            title="Cards we buy"
            intro="Physical cards and e-codes from the US, UK, Europe and more. Rates depend on the brand, country and amount."
          />
          <Link
            href="/rates"
            className="shrink-0 inline-flex items-center gap-1.5 font-semibold text-sm sm:text-base text-ink dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-8 hover:decoration-ink dark:hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
          >
            <span>See the rate for each card</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {shown.map((brand) => (
            <li key={brand.name}>
              <Link
                href={brand.link}
                className="group block rounded-xl sm:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-[0_8px_20px_-10px_rgba(26,26,29,0.3)] sm:shadow-[0_12px_30px_-18px_rgba(26,26,29,0.5)] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-18px_rgba(26,26,29,0.55)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <BrandImage name={brand.name} imageUrl={brand.imageUrl} sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 45vw" />
                </div>
                <div className="mt-2.5 sm:mt-3">
                  <p className="font-semibold text-sm sm:text-base text-ink dark:text-white truncate">
                    {brand.name}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gold-700 dark:text-gold-400 flex items-center gap-1 group-hover:underline">
                    <span>See rates</span>
                    <span className="text-[10px]">→</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/rates"
              className="group flex flex-col justify-between aspect-[3/2] rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-3 sm:p-4 transition-all hover:border-gold hover:bg-gold-50 dark:hover:bg-gold-900/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="text-xs sm:text-sm leading-snug text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-none">{restLabel}</span>
              <span className="font-semibold text-xs sm:text-sm text-ink dark:text-white flex items-center justify-between">
                <span>Find your card</span>
                <span className="text-gold-700 dark:text-gold-400 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
