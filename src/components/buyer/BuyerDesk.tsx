"use client";

import RollingNumber from "@/components/RollingNumber";
import ExchangeMark from "./ExchangeMark";
import { timeLeft } from "./format";

export type Status = "all" | "live" | "held" | "expired";

interface BuyerDeskProps {
  buyer: string;
  currency: string;
  validHours: number;
  counts: { live: number; held: number; expired: number };
  status: Status;
  onStatus: (s: Status) => void;
  /** ms until the soonest live quote lapses, or null when nothing is live */
  soonestMs: number | null;
  lastSubmittedAt: string | null;
}

const COLUMNS = [
  { key: "live", label: "Live", tone: "text-gold", dot: "bg-gold" },
  { key: "held", label: "On hold", tone: "text-white", dot: "bg-amber-400" },
  { key: "expired", label: "Expired", tone: "text-crimson", dot: "bg-crimson" },
] as const;

/** The ink board at the top of the portal: who is quoting, what is live, what lapses next. */
export default function BuyerDesk({ buyer, currency, validHours, counts, status, onStatus, soonestMs, lastSubmittedAt }: BuyerDeskProps) {
  const total = validHours * 3_600_000;
  const fill = soonestMs == null ? 0 : Math.min(1, Math.max(0.02, soonestMs / total));
  const urgent = soonestMs != null && soonestMs < total * 0.15;

  return (
    <section
      aria-label="Your quotes at a glance"
      className="rounded-2xl sm:rounded-[28px] bg-ink text-white p-4 sm:p-7 shadow-[0_30px_80px_-30px_rgba(26,26,29,0.55)] ring-1 ring-white/5 dark:ring-gold/25"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold text-ink shrink-0">
            <ExchangeMark className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm sm:text-base leading-tight">Buyer desk</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{buyer}</p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 shrink-0">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-crimson opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-crimson" />
          </span>
          Quoting in {currency}
        </span>
      </div>

      <div role="group" aria-label="Filter by quote status" className="mt-5 sm:mt-6 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10">
        {COLUMNS.map((c) => {
          const active = status === c.key;
          const n = counts[c.key];
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={active}
              onClick={() => onStatus(active ? "all" : c.key)}
              className={`relative text-left px-3 sm:px-5 py-3.5 sm:py-4 cursor-pointer transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold ${active ? "bg-white/[0.08]" : ""}`}
            >
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400">
                <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.key === "held" && n > 0 ? "motion-safe:animate-pulse" : ""}`} />
                {c.label}
              </span>
              <span className={`block mt-1 text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight ${n === 0 ? "text-gray-600" : c.tone}`}>
                <RollingNumber value={String(n)} />
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-gold origin-left transition-transform duration-300 ease-roll motion-reduce:transition-none ${active ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs sm:text-sm">
          <p className={urgent ? "text-crimson font-medium" : "text-gray-300"}>
            {soonestMs == null ? "No live quotes. Submit prices to start trading." : `Next quote lapses in ${timeLeft(soonestMs)}`}
          </p>
          <p className="text-gray-500">
            Quotes last {validHours}h
            {lastSubmittedAt ? ` · last sent ${new Date(lastSubmittedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}` : ""}
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Time left on the soonest live quote"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(fill * 100)}
          className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden"
        >
          <div
            className={`h-full rounded-full origin-left transition-transform duration-700 ease-roll motion-reduce:transition-none ${urgent ? "bg-crimson" : "bg-gold"}`}
            style={{ transform: `scaleX(${soonestMs == null ? 0 : fill})` }}
          />
        </div>
      </div>
    </section>
  );
}
