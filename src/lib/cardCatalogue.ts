export interface CatalogueCard {
  name: string;
  image: string; // 600x400 artwork in /public/cards
  query: string; // what to search the rates list for (matched loosely against API brand names)
}

/** Cards we have artwork for, in the order we show them. The rates page lists every card we buy. */
export const CATALOGUE: CatalogueCard[] = [
  { name: "Apple / iTunes", image: "/cards/apple-itunes.webp", query: "itunes" },
  { name: "Steam", image: "/cards/steam.webp", query: "steam" },
  { name: "Amazon", image: "/cards/amazon.webp", query: "amazon" },
  { name: "Razer Gold", image: "/cards/razer-gold.webp", query: "razer" },
  { name: "Xbox", image: "/cards/xbox.webp", query: "xbox" },
  { name: "eBay", image: "/cards/ebay.webp", query: "ebay" },
  { name: "Vanilla", image: "/cards/vanilla.webp", query: "vanilla" },
  { name: "Walmart MoneyCard", image: "/cards/walmart-moneycard.webp", query: "walmart" },
  { name: "MoneyPak", image: "/cards/moneypak.webp", query: "moneypak" },
];

export const cardByName = (name: string) => CATALOGUE.find((c) => c.name === name);

// Lower-case fragments of API brand names that map to our artwork.
const ALIASES: [string, string][] = [
  ["itunes", "Apple / iTunes"],
  ["apple", "Apple / iTunes"],
  ["steam", "Steam"],
  ["amazon", "Amazon"],
  ["razer", "Razer Gold"],
  ["xbox", "Xbox"],
  ["ebay", "eBay"],
  ["vanilla", "Vanilla"],
  ["walmart", "Walmart MoneyCard"],
  ["moneypak", "MoneyPak"],
];

/** Card artwork for a brand name as the rates API spells it, if we have it. */
export function artForBrand(apiName: string): CatalogueCard | undefined {
  const n = apiName.toLowerCase();
  const match = ALIASES.find(([fragment]) => n.includes(fragment));
  return match ? cardByName(match[1]) : undefined;
}

/** The rates API returns a grey placeholder when a brand has no logo uploaded. */
export const isPlaceholderLogo = (url?: string) => !url || /placeholder/i.test(url);

/** Link to a brand's rates, optionally opened at one country. */
export const ratesHref = (card: string, region?: string) =>
  `/rates?card=${encodeURIComponent(card)}${region ? `&region=${encodeURIComponent(region)}` : ""}`;

/** Finds the rates category a deep link refers to: exact name first, then a loose match. */
export function matchCategory<T extends { name: string }>(categories: T[], wanted: string): T | undefined {
  const w = wanted.trim().toLowerCase();
  if (!w) return undefined;
  return (
    categories.find((c) => c.name.toLowerCase() === w) ||
    categories.find((c) => c.name.toLowerCase().includes(w)) ||
    categories.find((c) => w.includes(c.name.toLowerCase()))
  );
}
