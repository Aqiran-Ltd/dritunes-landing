const stats = [
  { value: "10,000+", label: "customers have traded with us" },
  { value: "₵50M+", label: "paid out to date" },
  { value: "99.9%", label: "of trades completed" },
  { value: "24/7", label: "support on WhatsApp and Telegram" },
];

export default function StatsSection() {
  return (
    <section aria-label="Aqiran Xchange in numbers" className="bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-y border-gray-200 dark:border-gray-800">
          {stats.map((stat, i) => (
            <div
              key={stat.value}
              className={`py-8 lg:py-10 border-gray-200 dark:border-gray-800 ${i % 2 === 1 ? "pl-6 border-l" : "pr-4"} ${i > 0 ? "lg:pl-8 lg:border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""}`}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-4xl md:text-5xl font-bold tracking-[-0.04em] tabular-nums text-ink dark:text-white">
                {stat.value}
              </dd>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
