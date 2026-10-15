import type { Category } from '@/lib/ratesService';

export interface BoardRow {
  id: string;
  category: string;
  region: string;
  amount: string;
  rate: number; // GHS paid per $1 of card value
}

/**
 * Picks the best-paying card for each brand and country and returns the
 * top rows, highest rate first, for the home page rate board. The board
 * shows a few at a time and rotates through the rest.
 */
export function topRates(categories: Category[], limit = 18): BoardRow[] {
  const best = new Map<string, BoardRow>();

  for (const category of categories) {
    for (const card of category.cards) {
      const rate = Math.max(card.rates.ghsPhysical || 0, card.rates.ghsEcode || 0);
      if (rate <= 0) continue;
      const key = `${category.name}|${card.region}`;
      const current = best.get(key);
      if (!current || rate > current.rate) {
        best.set(key, { id: card.id, category: category.name, region: card.region, amount: card.amount, rate });
      }
    }
  }

  return [...best.values()].sort((a, b) => b.rate - a.rate).slice(0, limit);
}
