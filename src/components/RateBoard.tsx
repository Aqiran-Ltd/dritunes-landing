"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import RollingNumber from "@/components/RollingNumber";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { BoardRow } from "@/lib/rateBoard";

interface RateBoardProps {
  rows: BoardRow[];
  updatedAt?: string;
}

const SLOTS = 6;
const ROTATE_EVERY_MS = 2600;

// Fixed format so server and browser agree (some browsers render en-GH with a decimal comma).
const formatRate = (rate: number) => rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const formatTime = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function ExchangeArrows({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 8h14m0 0-3.5-3.5M18 8l-3.5 3.5M20 16H6m0 0 3.5-3.5M6 16l3.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Keeps SLOTS rows on the board and swaps one slot at a time for the next
 * rate not already showing, like a bureau board cycling through its list.
 */
function useRotatingSlots(total: number, paused: boolean) {
  const [slots, setSlots] = useState(() => Array.from({ length: Math.min(SLOTS, total) }, (_, i) => i));
  const [changed, setChanged] = useState<number | null>(null);
  const tick = useRef(0);
  const next = useRef(Math.min(SLOTS, total));
  const current = useRef(slots);

  useEffect(() => {
    current.current = slots;
  }, [slots]);

  useEffect(() => {
    if (paused || total <= SLOTS) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const prev = current.current;
      const slot = tick.current % prev.length;
      let candidate = next.current % total;
      while (prev.includes(candidate)) candidate = (candidate + 1) % total;
      next.current = candidate + 1;
      tick.current += 1;
      const copy = [...prev];
      copy[slot] = candidate;
      setSlots(copy);
      setChanged(slot);
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [paused, total]);

  return { slots, changed };
}

/**
 * The bureau-style board on the home page: best payout per $1, rotating
 * through the top cards with odometer-style figures.
 */
export default function RateBoard({ rows, updatedAt }: RateBoardProps) {
  const mounted = useHasMounted();
  // Local time only exists in the browser; rendering it on the server would mismatch.
  const time = mounted ? formatTime(updatedAt) : null;
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const rotates = rows.length > SLOTS;
  const paused = userPaused || hovering;
  const { slots, changed } = useRotatingSlots(rows.length, paused);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovering(false);
      }}
      className="relative rounded-[28px] bg-ink text-white p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(26,26,29,0.55)] ring-1 ring-white/5 dark:ring-gold/25"
    >
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
            {!paused && <span className="absolute inline-flex h-full w-full rounded-full bg-crimson opacity-60 motion-safe:animate-ping" />}
            <span className={`relative inline-flex w-2 h-2 rounded-full ${paused ? "bg-gray-500" : "bg-crimson"}`} />
          </span>
          {paused && rotates ? "Paused" : "Live"}
        </span>
      </div>

      {rows.length > 0 ? (
        <ul aria-live="off" className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {slots.map((rowIndex, slot) => {
            const row = rows[rowIndex];
            return (
              <li key={slot} className="relative flex items-center justify-between gap-4 py-3.5 overflow-hidden">
                {/* Brief gold wash on the row that just changed */}
                <AnimatePresence>
                  {changed === slot && (
                    <motion.span
                      key={`${slot}-${row.id}`}
                      aria-hidden="true"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                      className="absolute inset-y-1 -left-3 right-0 rounded-lg bg-gradient-to-r from-gold/15 to-transparent border-l-2 border-gold pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="relative min-w-0 h-11 flex-1 overflow-hidden">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                      key={row.id}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <p className="font-medium truncate">{row.category}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {row.region} card, ${row.amount}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="relative shrink-0 text-2xl font-semibold tabular-nums text-gold tracking-tight">
                  <span className="text-base text-gold/70 mr-0.5">₵</span>
                  <RollingNumber value={formatRate(row.rate)} />
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center">
          <p className="font-medium">Rates are being refreshed</p>
          <p className="mt-1 text-sm text-gray-400">The full rates page always has the latest figures.</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-gray-400">{time ? `Updated at ${time}. Rates move through the day.` : "Rates move through the day."}</p>
        <div className="flex items-center gap-4">
          {rotates && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              className="text-gray-300 hover:text-white underline decoration-white/30 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
            >
              {userPaused ? "Resume" : "Pause"}
            </button>
          )}
          <Link
            href="/rates"
            className="font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
          >
            See every rate
          </Link>
        </div>
      </div>
    </div>
  );
}
