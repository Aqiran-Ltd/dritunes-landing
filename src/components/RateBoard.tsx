"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BoardRow } from "@/lib/rateBoard";

interface RateBoardProps {
  rows: BoardRow[];
  updatedAt?: string;
}

const formatRate = (rate: number) =>
  rate.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatTime = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" });
};

function ExchangeArrows({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 8h14m0 0-3.5-3.5M18 8l-3.5 3.5M20 16H6m0 0 3.5-3.5M6 16l3.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The bureau-style board on the home page: best payout per $1 for the top cards.
 */
export default function RateBoard({ rows, updatedAt }: RateBoardProps) {
  const time = formatTime(updatedAt);

  return (
    <div className="relative rounded-[28px] bg-ink text-white p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(26,26,29,0.55)] ring-1 ring-white/5 dark:ring-gold/25">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-gold text-ink">
            <ExchangeArrows className="w-5 h-5" />
          </span>
          <div>
            <p className="font-semibold leading-tight">Today&apos;s payout</p>
            <p className="text-sm text-gray-400">Cedis for every $1 of card value</p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-sm text-gray-300">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-crimson opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-crimson" />
          </span>
          Live
        </span>
      </div>

      {rows.length > 0 ? (
        <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {rows.map((row, i) => (
            <motion.li
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + i * 0.05, ease: "easeOut" }}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{row.category}</p>
                <p className="text-sm text-gray-400 truncate">
                  {row.region} card, ${row.amount}
                </p>
              </div>
              <p className="shrink-0 text-2xl font-semibold tabular-nums text-gold tracking-tight">
                <span className="text-base text-gold/70 mr-0.5">₵</span>
                {formatRate(row.rate)}
              </p>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center">
          <p className="font-medium">Rates are being refreshed</p>
          <p className="mt-1 text-sm text-gray-400">The full rates page always has the latest figures.</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-gray-400">{time ? `Updated at ${time}. Rates move through the day.` : "Rates move through the day."}</p>
        <Link
          href="/rates"
          className="font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
        >
          See every rate
        </Link>
      </div>
    </div>
  );
}
