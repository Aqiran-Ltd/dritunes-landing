import Image from "next/image";
import { cardByName } from "@/lib/cardCatalogue";

const frame = "relative w-full aspect-[16/10] sm:aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-950 ring-1 ring-gray-200 dark:ring-gray-800";

/** A small hand of real cards. */
function PickVisual() {
  const hand = [
    { name: "Steam", rotate: -12, left: "8%", top: "26%" },
    { name: "Amazon", rotate: -2, left: "28%", top: "18%" },
    { name: "Apple / iTunes", rotate: 9, left: "48%", top: "24%" },
  ];
  return (
    <div className={frame}>
      {hand.map((c) => {
        const art = cardByName(c.name);
        return art ? (
          <div
            key={c.name}
            className="absolute w-[46%] aspect-[3/2] rounded-lg overflow-hidden shadow-md ring-1 ring-black/5"
            style={{ left: c.left, top: c.top, transform: `rotate(${c.rotate}deg)` }}
          >
            <Image src={art.image} alt="" fill sizes="110px" className="object-cover" />
          </div>
        ) : null;
      })}
    </div>
  );
}

/** The payout readout, in the rate board's colours. */
function PayoutVisual() {
  return (
    <div className={`${frame} !bg-ink !ring-0 text-white p-4 flex flex-col justify-between`}>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>$100 Steam card</span>
        <span>Example</span>
      </div>
      <div>
        <p className="text-xs text-gray-400 tabular-nums">₵10.85 for every $1</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-gold">
          <span className="text-lg text-gold/70 mr-0.5">₵</span>1,085.00
        </p>
      </div>
    </div>
  );
}

/** The back of a card, code half scratched, inside a camera frame. */
function SendVisual() {
  const corner = "absolute w-5 h-5 border-gold";
  return (
    <div className={`${frame} grid place-items-center`}>
      <div className="relative w-[70%] aspect-[3/2] rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm overflow-hidden">
        <div className="absolute inset-x-0 top-[14%] h-[16%] bg-gray-800 dark:bg-black" />
        <div className="absolute left-[10%] right-[10%] bottom-[18%] h-[22%] rounded bg-gradient-to-r from-white via-white to-gray-300 dark:from-gray-700 dark:via-gray-700 dark:to-gray-500 flex items-center px-2">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-ink dark:text-white tabular-nums">X7KQ-29PM</span>
        </div>
      </div>
      <span className={`${corner} left-[10%] top-[10%] border-l-2 border-t-2 rounded-tl-md`} />
      <span className={`${corner} right-[10%] top-[10%] border-r-2 border-t-2 rounded-tr-md`} />
      <span className={`${corner} left-[10%] bottom-[10%] border-l-2 border-b-2 rounded-bl-md`} />
      <span className={`${corner} right-[10%] bottom-[10%] border-r-2 border-b-2 rounded-br-md`} />
    </div>
  );
}

/** A plain payment alert, the moment the cedis land. */
function PaidVisual() {
  return (
    <div className={`${frame} !bg-gray-100 dark:!bg-gray-800 grid place-items-center p-4`}>
      <div className="w-full rounded-xl bg-white dark:bg-gray-950 shadow-md p-3 flex gap-3 items-start">
        <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-green-600 text-white font-semibold">₵</span>
        <div className="min-w-0 text-xs leading-snug">
          <div className="flex justify-between gap-2">
            <p className="font-semibold text-ink dark:text-white">Payment received</p>
            <p className="text-gray-500">now</p>
          </div>
          <p className="mt-0.5 text-gray-600 dark:text-gray-400">GHS 1,085.00 from Aqiran Xchange</p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Pick your card",
    body: "Choose the brand, country and amount. We buy iTunes, Amazon, Steam, Razer Gold, eBay and more, as physical cards or e-codes.",
    Visual: PickVisual,
  },
  {
    title: "See your payout",
    body: "The rate is the rate. Check it on our rates page or the payout calculator before you send anything.",
    Visual: PayoutVisual,
  },
  {
    title: "Send the card",
    body: "Upload it in your dashboard, message us on WhatsApp or Telegram, or bring it to our store in Tamale.",
    Visual: SendVisual,
  },
  {
    title: "Get paid",
    body: "Once the card is verified, cedis go straight to your mobile money or bank account, or into your Aqiran wallet.",
    Visual: PaidVisual,
  },
];

export default function TradeSteps({ className = "" }: { className?: string }) {
  return (
    <ol className={`border-t border-gray-200 dark:border-gray-800 ${className}`}>
      {steps.map(({ title, body, Visual }, i) => (
        <li
          key={title}
          className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[4rem_1fr_14rem] gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-5 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-800 items-start"
        >
          <span aria-hidden="true" className="text-3xl sm:text-5xl font-bold tabular-nums tracking-[-0.05em] text-gold-700 dark:text-gold">
            {i + 1}
          </span>
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-ink dark:text-white">{title}</h3>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base max-w-prose leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
          </div>
          <div aria-hidden="true" className="col-start-2 sm:col-start-3 w-full max-w-sm sm:max-w-none">
            <Visual />
          </div>
        </li>
      ))}
    </ol>
  );
}
