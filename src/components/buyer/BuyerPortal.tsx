"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeBracketIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  BuyerApiError,
  BuyerSheet,
  buyerService,
  clearToken,
  consumeTokenFromHash,
  isValidToken,
  loadToken,
  saveToken,
} from "@/lib/buyerService";
import BrandLogo from "@/components/BrandLogo";
import BrandImage from "@/components/BrandImage";
import BuyerDesk, { type Status } from "./BuyerDesk";
import RateRow, { wouldHold } from "./RateRow";

const IDLE_TIMEOUT_MS = 15 * 60_000;
const RATE_INPUT_REGEX = /^\d{0,5}(\.\d{0,4})?$/;
const MAX_RATE = 100_000;

type Kind = "all" | "physical" | "ecode";

const CURRENCY_SYMBOL: Record<string, string> = { RMB: "¥", CNY: "¥", GHS: "₵" };

const KIND_LABEL = { physical: "Physical card", ecode: "E-Code" } as const;

type Notice = { kind: "success" | "warn" | "error" | "info"; text: string } | null;

const normalise = (v: string) => (v.trim() === "" || Number(v) === 0 ? "" : String(Number(v)));

export default function BuyerPortal() {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [sheet, setSheet] = useState<BuyerSheet | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<Kind>("all");
  const [status, setStatus] = useState<Status>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<Notice>(null);
  const [now, setNow] = useState(() => Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signOut = useCallback((text?: string) => {
    clearToken();
    setToken(null);
    setSheet(null);
    setDrafts({});
    setTokenInput("");
    setNotice(text ? { kind: "info", text } : null);
  }, []);

  // Pick up the token from the URL fragment (scrubbed immediately) or the tab session
  useEffect(() => {
    const fromHash = consumeTokenFromHash();
    if (fromHash) {
      saveToken(fromHash);
      setToken(fromHash);
    } else {
      setToken(loadToken());
    }
    setBooting(false);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof BuyerApiError && (err.status === 401 || err.status === 403)) {
      clearToken();
      setToken(null);
      setSheet(null);
      setDrafts({});
      setNotice({ kind: "error", text: err.message });
      return;
    }
    setNotice({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong." });
  }, []);

  const loadSheet = useCallback(
    async (t: string) => {
      setLoading(true);
      try {
        const res = await buyerService.sheet(t);
        setSheet({ data: res.data, meta: res.meta });
        setDrafts({});
        setNow(Date.now());
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    if (token) loadSheet(token);
  }, [token, loadSheet]);

  // Keep the "next quote lapses in" countdown fresh
  useEffect(() => {
    if (!sheet) return;
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, [sheet]);

  // Auto sign-out after inactivity
  useEffect(() => {
    if (!token) return;
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(
        () => signOut("You were signed out after 15 minutes of inactivity."),
        IDLE_TIMEOUT_MS
      );
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [token, signOut]);

  const itemsById = useMemo(() => {
    const map = new Map<number, BuyerSheet["data"][number]["items"][number]>();
    for (const g of sheet?.data ?? []) for (const i of g.items) map.set(i.rate_id, i);
    return map;
  }, [sheet]);

  const originalOf = useCallback(
    (rateId: number): string => {
      const item = itemsById.get(rateId);
      return item?.my_rate != null ? String(item.my_rate) : "";
    },
    [itemsById]
  );

  const dirtyIds = useMemo(
    () =>
      Object.keys(drafts)
        .map(Number)
        .filter((id) => normalise(drafts[id]) !== normalise(originalOf(id))),
    [drafts, originalOf]
  );

  // How many of the edits are above the instant-approval limit
  const heldEdits = useMemo(
    () => dirtyIds.filter((id) => itemsById.get(id) && wouldHold(itemsById.get(id)!, drafts[id])).length,
    [dirtyIds, drafts, itemsById]
  );

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (dirtyIds.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyIds.length]);

  // Ledger: how many quotes are live, held for approval, or lapsed; and when the next one lapses
  const { counts, soonestMs } = useMemo(() => {
    const c = { live: 0, held: 0, expired: 0 };
    let soonest: number | null = null;
    for (const i of itemsById.values()) {
      if (i.pending_rate != null) c.held++;
      if (i.my_rate == null) continue;
      if (i.expired) c.expired++;
      else {
        c.live++;
        const left = i.expires_at ? new Date(i.expires_at).getTime() - now : null;
        if (left != null && (soonest == null || left < soonest)) soonest = left;
      }
    }
    return { counts: c, soonestMs: soonest != null ? Math.max(0, soonest) : null };
  }, [itemsById, now]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!sheet) return [];
    return sheet.data
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            (kind === "all" || i.type === kind) &&
            (status === "all" ||
              (status === "held" && i.pending_rate != null) ||
              (status === "live" && i.my_rate != null && !i.expired) ||
              (status === "expired" && i.my_rate != null && !!i.expired)) &&
            (!q || `${g.asset_name} ${i.country_code ?? ""} ${i.denomination ?? ""} ${i.type ?? ""}`.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [sheet, search, kind, status]);

  const searching = search.trim() !== "" || kind !== "all" || status !== "all";

  const dirtyGroups = useMemo(() => {
    const ids = new Set(dirtyIds);
    return new Set((sheet?.data ?? []).filter((g) => g.items.some((i) => ids.has(i.rate_id))).map((g) => g.asset_name));
  }, [dirtyIds, sheet]);

  // Searching and unsaved edits both force a section open so nothing is hidden
  const isOpen = (name: string) => searching || dirtyGroups.has(name) || expanded.has(name);

  const toggle = (name: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const allOpen = filtered.length > 0 && filtered.every((g) => isOpen(g.asset_name));
  const toggleAll = () => setExpanded(allOpen ? new Set() : new Set(filtered.map((g) => g.asset_name)));

  const onTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!isValidToken(t)) {
      setNotice({ kind: "error", text: "That access token does not look right. Check it and try again." });
      return;
    }
    saveToken(t);
    setTokenInput("");
    setNotice(null);
    setToken(t);
  };

  const onChangeRate = (rateId: number, value: string) => {
    if (!RATE_INPUT_REGEX.test(value) || Number(value || 0) > MAX_RATE) return;
    setDrafts((d) => ({ ...d, [rateId]: value }));
  };

  const save = async () => {
    if (!token || busy || dirtyIds.length === 0) return;
    const rates = dirtyIds.map((id) => {
      const n = Number(drafts[id] || 0);
      return { rate_id: id, rate: n > 0 ? n : null };
    });
    setBusy(true);
    setNotice(null);
    try {
      const res = await buyerService.submit(token, rates);
      const held = res.meta.pending_approval?.length ?? 0;
      const until = new Date(res.meta.expires_at).toLocaleString();
      setNotice(
        held > 0
          ? {
              kind: "warn",
              text: `${rates.length - held > 0 ? `${rates.length - held} saved and live until ${until}. ` : ""}${held} rate${
                held === 1 ? " is" : "s are"
              } much higher than the current rate, so ${
                held === 1 ? "it is" : "they are"
              } on hold for approval. Your previous ${held === 1 ? "price stays" : "prices stay"} live meanwhile.`,
            }
          : { kind: "success", text: `${res.message} Quotes valid until ${until}.` }
      );
      await loadSheet(token);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  // Cancel a held request: re-sending the live price (or withdrawing if none) supersedes it
  const cancelHold = async (item: { rate_id: number; my_rate: number | null }) => {
    if (!token || busy) return;
    setBusy(true);
    setNotice(null);
    try {
      await buyerService.submit(token, [{ rate_id: item.rate_id, rate: item.my_rate }]);
      setNotice({ kind: "info", text: "Held request cancelled." });
      await loadSheet(token);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (assetName?: string) => {
    if (!token || busy) return;
    if (dirtyIds.length > 0 && !window.confirm("You have unsaved edits that will be discarded. Continue?")) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await buyerService.confirm(token, assetName);
      setNotice({
        kind: "success",
        text: `${res.meta.renewed} quote${res.meta.renewed === 1 ? "" : "s"} confirmed until ${new Date(
          res.meta.expires_at
        ).toLocaleString()}.`,
      });
      await loadSheet(token);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  if (booting) return null;

  const currency = sheet?.meta.currency ?? "";
  const symbol = CURRENCY_SYMBOL[currency.toUpperCase()] ?? currency;
  const ready = !!token && !!sheet;

  const saveLabel = busy ? "Saving…" : dirtyIds.length === 0 ? "Save changes" : `Save ${dirtyIds.length}`;

  return (
    // data-sentry-block keeps session replay from recording tokens and quotes
    <div data-sentry-block className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className={`max-w-4xl mx-auto px-4 pt-5 sm:pt-10 ${ready ? "pb-40 sm:pb-36" : "pb-10"}`}>
        <header className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
          <BrandLogo priority className="h-8 sm:h-10" />
          {token && (
            <button
              type="button"
              onClick={() => signOut("You have been signed out.")}
              aria-label="Sign out"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-crimson hover:border-crimson/40 cursor-pointer"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </header>

        <AnimatePresence initial={false}>
          {notice && (
            <motion.div
              key={notice.text}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              role="status"
              className={`mb-5 rounded-2xl border-l-4 bg-white dark:bg-gray-900 px-4 py-3 text-sm flex items-start gap-2.5 shadow-sm ${
                notice.kind === "success"
                  ? "border-emerald-500 text-gray-800 dark:text-gray-200"
                  : notice.kind === "warn"
                  ? "border-amber-400 text-gray-800 dark:text-gray-200"
                  : notice.kind === "error"
                  ? "border-crimson text-gray-800 dark:text-gray-200"
                  : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {notice.kind === "success" ? (
                <CheckCircleIcon className="w-5 h-5 shrink-0 text-emerald-500" />
              ) : notice.kind === "warn" ? (
                <ClockIcon className="w-5 h-5 shrink-0 text-amber-500" />
              ) : (
                <ExclamationTriangleIcon className={`w-5 h-5 shrink-0 ${notice.kind === "error" ? "text-crimson" : "text-gray-400"}`} />
              )}
              <span>{notice.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!token && (
          <form
            onSubmit={onTokenSubmit}
            autoComplete="off"
            className="max-w-md mx-auto rounded-2xl sm:rounded-[28px] bg-ink text-white p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(26,26,29,0.55)] ring-1 ring-white/5 dark:ring-gold/25"
          >
            <span className="grid place-items-center w-11 h-11 rounded-full bg-gold text-ink mb-5">
              <LockClosedIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-semibold">Buyer desk</h1>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Enter the private token from Aqiran Xchange to send today&apos;s prices. Never share it.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              maxLength={128}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Access token"
              aria-label="Access token"
              className="w-full px-4 py-3 rounded-xl text-base bg-white/[0.06] border border-white/10 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gold hover:bg-gold-400 active:scale-[0.99] text-ink font-semibold py-3.5 text-base cursor-pointer transition"
            >
              Continue
            </button>
          </form>
        )}

        {token && loading && !sheet && (
          <div className="flex justify-center py-20">
            <ArrowPathIcon className="w-8 h-8 motion-safe:animate-spin text-gray-400" />
          </div>
        )}

        {ready && sheet && (
          <>
            <BuyerDesk
              buyer={sheet.meta.buyer}
              currency={sheet.meta.currency}
              validHours={sheet.meta.quote_valid_hours}
              counts={counts}
              status={status}
              onStatus={setStatus}
              soonestMs={soonestMs}
              lastSubmittedAt={sheet.meta.last_submitted_at}
            />

            {counts.held > 0 && status !== "held" && (
              <button
                type="button"
                onClick={() => setStatus("held")}
                className="mt-3 w-full flex items-center gap-2 rounded-xl border border-amber-300/70 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3.5 py-2.5 text-left text-sm text-amber-900 dark:text-amber-200 cursor-pointer hover:bg-amber-100/70 dark:hover:bg-amber-950/50"
              >
                <ClockIcon className="w-5 h-5 shrink-0" aria-hidden />
                <span className="flex-1">
                  {counts.held} request{counts.held === 1 ? " is" : "s are"} waiting for admin approval. Earlier prices stay live until then.
                </span>
                <span className="font-semibold shrink-0">Review →</span>
              </button>
            )}

            <div className="sticky top-0 z-10 -mx-4 px-4 py-3 mt-4 mb-3 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value.slice(0, 64))}
                    placeholder="Search brand or country"
                    aria-label="Search rates"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-base sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div role="group" aria-label="Card type" className="grid grid-cols-3 gap-1 rounded-xl bg-gray-200/70 dark:bg-gray-800 p-1 sm:w-64">
                  {(
                    [
                      ["all", "All"],
                      ["physical", "Physical"],
                      ["ecode", "E-Code"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={kind === value}
                      onClick={() => setKind(value)}
                      className={`rounded-lg py-2 text-sm font-semibold cursor-pointer transition-colors ${
                        kind === value
                          ? "bg-ink text-gold shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 px-4 py-12 text-center">
                <p className="font-medium text-sm">{status === "held" ? "Nothing is waiting for approval" : "No matching rates"}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {searching ? "Clear the search or filters to see every card." : "Rates will appear here once they are listed."}
                </p>
                {searching && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setKind("all");
                      setStatus("all");
                    }}
                    className="mt-3 text-sm font-semibold text-gold-700 dark:text-gold underline underline-offset-4 cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {filtered.length > 0 && !searching && (
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold cursor-pointer"
                >
                  {allOpen ? "Collapse all" : "Expand all"}
                </button>
              </div>
            )}

            <div className="space-y-3">
              {filtered.map((group) => {
                const open = isOpen(group.asset_name);
                const physicalCount = group.items.filter((i) => i.type === "physical").length;
                const ecodeCount = group.items.filter((i) => i.type === "ecode").length;
                const quoted = group.items.filter((i) => i.my_rate != null && !i.expired).length;
                const heldCount = group.items.filter((i) => i.pending_rate != null).length;
                const panelId = `panel-${group.asset_name.replace(/[^A-Za-z0-9]/g, "-")}`;
                return (
                  <section
                    key={group.asset_name}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pr-3 sm:pr-4">
                      <button
                        type="button"
                        onClick={() => toggle(group.asset_name)}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="flex-1 min-w-0 flex items-center gap-3 pl-4 sm:pl-5 py-3 text-left cursor-pointer"
                      >
                        <span className="relative w-14 sm:w-16 aspect-[3/2] shrink-0 rounded-md overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                          <BrandImage name={group.asset_name} variant="mini" sizes="64px" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <h2 className="font-semibold truncate">{group.asset_name}</h2>
                          <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {physicalCount} physical · {ecodeCount} e-code · {quoted} quoted
                            </span>
                            {heldCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-medium">
                                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                {heldCount} on hold
                              </span>
                            )}
                            {dirtyGroups.has(group.asset_name) && (
                              <span className="inline-flex items-center gap-1 text-gold-700 dark:text-gold font-medium">
                                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gold" />
                                unsaved
                              </span>
                            )}
                          </span>
                        </span>
                        <ChevronDownIcon
                          className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-300 ease-roll motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => confirm(group.asset_name)}
                        className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-gold-700 dark:text-gold border border-gold-300/60 dark:border-gold-700/50 hover:bg-gold-50 dark:hover:bg-gold-900/20 disabled:opacity-50 cursor-pointer"
                      >
                        Confirm<span className="hidden sm:inline"> this brand</span>
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={panelId}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          {(["physical", "ecode"] as const).map((t) => {
                            const rows = group.items.filter((i) => i.type === t);
                            if (rows.length === 0) return null;
                            return (
                              <div key={t} className="border-t border-gray-100 dark:border-gray-800">
                                <p className="flex items-center gap-2 px-4 sm:px-5 pt-3 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {t === "ecode" ? <CodeBracketIcon className="w-4 h-4" aria-hidden /> : <CreditCardIcon className="w-4 h-4" aria-hidden />}
                                  {KIND_LABEL[t]}s
                                  <span className="ml-auto font-normal">{rows.length}</span>
                                </p>
                                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                  {rows.map((item) => (
                                    <RateRow
                                      key={item.rate_id}
                                      item={item}
                                      symbol={symbol}
                                      label={[item.country_code, item.denomination].filter(Boolean).join(" · ") || "—"}
                                      value={drafts[item.rate_id] ?? (item.my_rate != null ? String(item.my_rate) : "")}
                                      changed={dirtyIds.includes(item.rate_id)}
                                      busy={busy}
                                      onChange={(v) => onChangeRate(item.rate_id, v)}
                                      onCancelHold={() => cancelHold(item)}
                                    />
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                );
              })}
            </div>

            {/* Dock pinned to the bottom so the actions are always in thumb reach */}
            <div className="fixed inset-x-0 bottom-0 z-20 px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
              <div className="pointer-events-auto max-w-4xl mx-auto rounded-2xl bg-ink text-white p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 dark:ring-gold/25 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                <p className="text-sm px-1 sm:flex-1" aria-live="polite">
                  {dirtyIds.length === 0 ? (
                    <span className="text-gray-400">Nothing changed? Confirm to keep today&apos;s prices live for {sheet.meta.quote_valid_hours}h.</span>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {dirtyIds.length} change{dirtyIds.length === 1 ? "" : "s"}
                      </span>
                      {heldEdits > 0 ? (
                        <span className="text-amber-300"> · {heldEdits} will need approval</span>
                      ) : (
                        <span className="text-gray-400"> · all go live straight away</span>
                      )}
                    </>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => confirm()}
                    className="flex-1 sm:flex-none rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    Confirm all
                  </button>
                  <button
                    type="button"
                    disabled={busy || dirtyIds.length === 0}
                    onClick={save}
                    className="flex-1 sm:flex-none sm:min-w-36 rounded-xl bg-gold hover:bg-gold-400 active:scale-[0.98] text-ink px-4 py-3 text-sm font-bold disabled:opacity-40 disabled:active:scale-100 cursor-pointer transition"
                  >
                    {saveLabel}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
