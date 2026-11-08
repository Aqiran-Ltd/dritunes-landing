"use client";

import { ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { BuyerSheetItem } from "@/lib/buyerService";
import { money as fmt } from "./format";

interface RateRowProps {
  item: BuyerSheetItem;
  label: string;
  symbol: string;
  value: string;
  changed: boolean;
  busy: boolean;
  onChange: (value: string) => void;
  onCancelHold: () => void;
}

// Non-breaking space keeps the cedi sign attached to its figure when a line wraps
const NB = "\u00A0";

/** True when a typed price is above the instant-approval limit and will be held. */
export const wouldHold = (item: Pick<BuyerSheetItem, "ceiling">, value: string) =>
  item.ceiling != null && Number(value) > item.ceiling;

export default function RateRow({ item, label, symbol, value, changed, busy, onChange, onCancelHold }: RateRowProps) {
  const money = (n: number) => `${symbol}${NB}${fmt(n)}`;
  const holds = changed && wouldHold(item, value);
  const hintId = `hint-${item.rate_id}`;

  return (
    <li className="px-4 sm:px-5 py-3.5">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-sm font-semibold break-words">{label}</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="block sm:inline whitespace-nowrap">{item.current_rate != null ? `Now ${money(item.current_rate)}` : "No rate yet"}</span>
            {item.ceiling != null && <span className="block sm:inline whitespace-nowrap">
                <span aria-hidden className="hidden sm:inline"> · </span>instant up to {money(item.ceiling)}
              </span>}
          </p>
          {item.my_rate != null && (
            <p className={`mt-0.5 text-xs ${item.expired ? "text-crimson font-medium" : "text-gray-500 dark:text-gray-400"}`}>
              {item.expired ? "Expired" : "Valid until"} {item.expires_at ? new Date(item.expires_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""}
            </p>
          )}
        </div>

        <div className="shrink-0 w-32 sm:w-40">
          <label className="sr-only" htmlFor={`rate-${item.rate_id}`}>
            Your {symbol} rate for {label}
          </label>
          <div className="relative">
            <span aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{symbol}</span>
            <input
              id={`rate-${item.rate_id}`}
              inputMode="decimal"
              autoComplete="off"
              value={value}
              placeholder="—"
              aria-describedby={holds ? hintId : undefined}
              aria-invalid={holds || undefined}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-lg sm:text-base font-semibold text-right tabular-nums bg-gray-50 dark:bg-gray-950 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
                holds
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 focus:border-orange-500"
                  : changed
                  ? "border-gold-500"
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-800 focus:border-gold-500"
              }`}
            />
          </div>
        </div>
      </div>

      {holds && (
        <p id={hintId} role="status" className="mt-2 flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-300">
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0" aria-hidden />
          <span>
            Above {money(item.ceiling!)}, so this waits for approval
            {item.my_rate != null ? `. Your ${money(item.my_rate)} stays live meanwhile.` : "."}
          </span>
        </p>
      )}

      {item.pending_rate != null && !changed && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 border-l-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 pl-3 pr-2 py-1.5 rounded-r-lg text-xs text-amber-900 dark:text-amber-200">
          <ClockIcon className="w-4 h-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold tabular-nums">{money(item.pending_rate)}</span> awaiting approval
            {item.my_rate != null ? ` · ${money(item.my_rate)} stays live` : ""}
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={onCancelHold}
            className="ml-auto font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-50 cursor-pointer"
          >
            Cancel request
          </button>
        </div>
      )}
    </li>
  );
}
