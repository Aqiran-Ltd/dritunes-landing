const steps = [
  {
    title: "Pick your card",
    body: "Choose the brand, country and amount. We buy iTunes, Amazon, Steam, Razer Gold, eBay and more, as physical cards or e-codes.",
  },
  {
    title: "See your payout",
    body: "The rate is the rate. Check it on our rates page or the payout calculator before you send anything.",
  },
  {
    title: "Send the card",
    body: "Upload it in your dashboard, message us on WhatsApp or Telegram, or bring it to our store in Tamale.",
  },
  {
    title: "Get paid",
    body: "Once the card is verified, cedis go straight to your mobile money or bank account, or into your Aqiran wallet.",
  },
];

export default function TradeSteps({ className = "" }: { className?: string }) {
  return (
    <ol className={`border-t border-gray-200 dark:border-gray-800 ${className}`}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-4 py-8 border-b border-gray-200 dark:border-gray-800"
        >
          <span aria-hidden="true" className="text-4xl sm:text-5xl font-bold tabular-nums tracking-[-0.05em] text-gold-700 dark:text-gold">
            {i + 1}
          </span>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-ink dark:text-white">{step.title}</h3>
            <p className="mt-2 max-w-prose leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
