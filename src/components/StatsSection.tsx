import { realFigures, type PublicStats, type StatFigure } from "@/lib/statsService";

const fixedFacts: StatFigure[] = [
  { value: "24/7", label: "support on WhatsApp and Telegram" },
  { value: "3", label: "ways to trade: app, chat, or in person" },
  { value: "MoMo", label: "and bank payouts in Ghana cedis" },
  { value: "0", label: "ID documents required to trade" },
];

export default function StatsSection({ stats: live }: { stats?: PublicStats | null }) {
  // Real figures (from paid trades) come first; fixed facts fill the rest of the row.
  const stats = [...realFigures(live ?? null), ...fixedFacts].slice(0, 4);
  return (
    <section aria-label="Aqiran Xchange in numbers" className="bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-y border-gray-200 dark:border-gray-800">
          {stats.map((stat, i) => (
            <div
              key={stat.value}
              className={`py-6 sm:py-8 lg:py-10 border-gray-200 dark:border-gray-800 ${i % 2 === 1 ? "pl-4 sm:pl-6 border-l" : "pr-3 sm:pr-6"} ${i > 0 ? "lg:pl-8 lg:border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""}`}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight tabular-nums text-ink dark:text-white">
                {stat.value}
              </dd>
              <dd className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-snug">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
