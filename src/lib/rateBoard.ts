import type { Category } from '@/lib/ratesService';

export interface BoardRow {
  id: string;
  category: string;
  region: string;
  amount: string;
  rate: number; // GHS paid per $1 of card value
}

/**
 * Picks the best-paying card in each category and returns the top rows,
 * highest rate first, for the home page rate board.
 */
export function topRates(categories: Category[], limit = 6): BoardRow[] {
  const rows: BoardRow[] = [];

  for (const category of categories) {
    let best: BoardRow | null = null;
    for (const card of category.cards) {
      const rate = Math.max(card.rates.ghsPhysical || 0, card.rates.ghsEcode || 0);
      if (rate > 0 && (!best || rate > best.rate)) {
        best = { id: card.id, category: category.name, region: card.region, amount: card.amount, rate };
      }
    }
    if (best) rows.push(best);
  }

  return rows.sort((a, b) => b.rate - a.rate).slice(0, limit);
}
