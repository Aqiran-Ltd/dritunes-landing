export interface CatalogueCard {
  name: string;
  image: string; // 600x400 artwork in /public/cards
}

/** Cards we have artwork for, in the order we show them. The rates page lists every card we buy. */
export const CATALOGUE: CatalogueCard[] = [
  { name: "Apple / iTunes", image: "/cards/apple-itunes.webp" },
  { name: "Steam", image: "/cards/steam.webp" },
  { name: "Amazon", image: "/cards/amazon.webp" },
  { name: "Razer Gold", image: "/cards/razer-gold.webp" },
  { name: "Xbox", image: "/cards/xbox.webp" },
  { name: "eBay", image: "/cards/ebay.webp" },
  { name: "Vanilla", image: "/cards/vanilla.webp" },
  { name: "Walmart MoneyCard", image: "/cards/walmart-moneycard.webp" },
  { name: "MoneyPak", image: "/cards/moneypak.webp" },
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
