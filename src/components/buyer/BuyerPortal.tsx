"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  CreditCardIcon,
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

const IDLE_TIMEOUT_MS = 15 * 60_000;
const RATE_INPUT_REGEX = /^\d{0,5}(\.\d{0,4})?$/;
const MAX_RATE = 100_000;

type Kind = "all" | "physical" | "ecode";

const CURRENCY_SYMBOL: Record<string, string> = { RMB: "¥", CNY: "¥", GHS: "GH₵" };

const KIND_LABEL = { physical: "Physical card", ecode: "E-Code" } as const;

type Notice = { kind: "success" | "error" | "info"; text: string } | null;

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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<Notice>(null);
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

  const originalOf = useCallback(
    (rateId: number): string => {
      for (const g of sheet?.data ?? []) {
        const item = g.items.find((i) => i.rate_id === rateId);
        if (item) return item.my_rate != null ? String(item.my_rate) : "";
      }
      return "";
    },
    [sheet]
  );

  const dirtyIds = useMemo(
    () =>
      Object.keys(drafts)
        .map(Number)
        .filter((id) => normalise(drafts[id]) !== normalise(originalOf(id))),
    [drafts, originalOf]
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!sheet) return [];
    return sheet.data
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            (kind === "all" || i.type === kind) &&
            (!q || `${g.asset_name} ${i.country_code ?? ""} ${i.denomination ?? ""} ${i.type ?? ""}`.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [sheet, search, kind]);

  const searching = search.trim() !== "" || kind !== "all";

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
      return { rate_id: id, rmb_rate: n > 0 ? n : null };
    });
    setBusy(true);
    setNotice(null);
    try {
      const res = await buyerService.submit(token, rates);
      setNotice({
        kind: "success",
        text: `${res.message} Quotes valid until ${new Date(res.meta.expires_at).toLocaleString()}.`,
      });
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

  const saveLabel = busy
    ? "Saving…"
    : dirtyIds.length === 0
    ? "Save changes"
    : `Save ${dirtyIds.length} change${dirtyIds.length === 1 ? "" : "s"}`;

  return (
    // data-sentry-block keeps session replay from recording tokens and quotes
    <div data-sentry-block className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className={`max-w-4xl mx-auto px-4 pt-5 sm:pt-10 ${token && sheet ? "pb-32 sm:pb-36" : "pb-10"}`}>
        <header className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <BrandLogo priority className="h-8 sm:h-10" />
          {token && (
            <button
              type="button"
              onClick={() => signOut("You have been signed out.")}
              aria-label="Sign out"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 hover:border-red-300 cursor-pointer"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          )}
        </header>

        <div className="mb-6">
          <h1 className="text-xl sm:text-3xl font-bold">Buyer Rate Portal</h1>
          {sheet && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{sheet.meta.buyer}</span> · quotes in{" "}
              {sheet.meta.currency}, valid for {sheet.meta.quote_valid_hours}h
            </p>
          )}
        </div>

        {notice && (
          <div
            role="status"
            className={`mb-6 rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
              notice.kind === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                : notice.kind === "error"
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                : "border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {notice.kind === "success" ? (
              <CheckCircleIcon className="w-5 h-5 shrink-0" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {!token && (
          <form
            onSubmit={onTokenSubmit}
            autoComplete="off"
            className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center mb-4">
              <LockClosedIcon className="w-6 h-6 text-gold-700 dark:text-gold-400" />
            </div>
            <h2 className="text-lg font-bold">Enter your access token</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">
              Use the private link or token provided by Aqiran Xchange. Never share it.
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
              className="w-full px-4 py-3 rounded-xl text-base bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gold-500 hover:bg-gold-600 text-ink font-semibold py-3.5 text-base cursor-pointer transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {token && loading && !sheet && (
          <div className="flex justify-center py-20">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {token && sheet && (
          <>
            <div className="sticky top-0 z-10 -mx-4 px-4 py-3 mb-4 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value.slice(0, 64))}
                  placeholder="Search brand, country, denomination"
                  aria-label="Search rates"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-base sm:text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
              <div role="group" aria-label="Card type" className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-gray-200/70 dark:bg-gray-800 p-1">
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
                        ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action bar pinned to the bottom so it is always in thumb reach */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
              <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => confirm()}
                  className="flex-1 sm:flex-none rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                >
                  <span className="sm:hidden">Confirm all</span>
                  <span className="hidden sm:inline">Nothing changed: confirm all</span>
                </button>
                <button
                  type="button"
                  disabled={busy || dirtyIds.length === 0}
                  onClick={save}
                  className="flex-1 sm:flex-none sm:ml-auto sm:min-w-44 rounded-xl bg-gold-500 hover:bg-gold-600 text-ink px-4 py-3 text-sm font-bold disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {saveLabel}
                </button>
              </div>
            </div>

            {sheet.meta.last_submitted_at && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Last submission: {new Date(sheet.meta.last_submitted_at).toLocaleString()}
              </p>
            )}

            {filtered.length === 0 && <p className="text-center text-sm text-gray-500 py-12">No matching rates.</p>}

            {filtered.length > 0 && !searching && (
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gold-700 dark:hover:text-gold-400 cursor-pointer"
                >
                  {allOpen ? "Collapse all" : "Expand all"}
                </button>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              {filtered.map((group) => {
                const open = isOpen(group.asset_name);
                const physicalCount = group.items.filter((i) => i.type === "physical").length;
                const ecodeCount = group.items.filter((i) => i.type === "ecode").length;
                const quoted = group.items.filter((i) => i.my_rate != null && !i.expired).length;
                const panelId = `panel-${group.asset_name.replace(/[^A-Za-z0-9]/g, "-")}`;
                return (
                <section
                  key={group.asset_name}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
                >
                  <div className={`flex items-center gap-2 pr-3 sm:pr-4 ${open ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
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
                        <h2 className="font-bold truncate">{group.asset_name}</h2>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {physicalCount} physical · {ecodeCount} e-code · {quoted} quoted
                          {dirtyGroups.has(group.asset_name) ? " · unsaved" : ""}
                        </span>
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => confirm(group.asset_name)}
                      className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-gold-700 dark:text-gold-400 border border-gold-300/60 dark:border-gold-700/50 hover:bg-gold-50 dark:hover:bg-gold-900/20 disabled:opacity-50 cursor-pointer"
                    >
                      Confirm<span className="hidden sm:inline"> this brand</span>
                    </button>
                  </div>
                  <div id={panelId} hidden={!open}>
                    {(["physical", "ecode"] as const).map((t) => {
                      const rows = group.items.filter((i) => i.type === t);
                      if (rows.length === 0) return null;
                      return (
                        <div key={t}>
                          <div
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-semibold uppercase tracking-wide border-b border-gray-100 dark:border-gray-800 ${
                              t === "ecode"
                                ? "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
                                : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                            }`}
                          >
                            {t === "ecode" ? <CodeBracketIcon className="w-4 h-4" /> : <CreditCardIcon className="w-4 h-4" />}
                            {KIND_LABEL[t]}
                            <span className="ml-auto font-medium normal-case tracking-normal opacity-80">
                              {rows.length} rate{rows.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {rows.map((item) => {
                              const value = drafts[item.rate_id] ?? (item.my_rate != null ? String(item.my_rate) : "");
                              const changed = dirtyIds.includes(item.rate_id);
                              return (
                                <li key={item.rate_id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium break-words">
                                      {[item.country_code, item.denomination].filter(Boolean).join(" · ") || "—"}
                                    </p>
                                    {item.my_rate != null && (
                                      <p
                                        className={`text-xs mt-0.5 ${
                                          item.expired ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        {item.expired ? "Expired" : "Valid until"}{" "}
                                        {item.expires_at ? new Date(item.expires_at).toLocaleString() : ""}
                                      </p>
                                    )}
                                  </div>
                                  <label className="sr-only" htmlFor={`rate-${item.rate_id}`}>
                                    {currency} rate for {group.asset_name} {item.denomination} {KIND_LABEL[item.type as keyof typeof KIND_LABEL] ?? ""}
                                  </label>
                                  <div className="relative w-32 sm:w-36 shrink-0">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{symbol}</span>
                                    <input
                                      id={`rate-${item.rate_id}`}
                                      inputMode="decimal"
                                      autoComplete="off"
                                      value={value}
                                      placeholder="—"
                                      onChange={(e) => onChangeRate(item.rate_id, e.target.value)}
                                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg text-base sm:text-sm text-right tabular-nums bg-gray-50 dark:bg-gray-950 border focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                                        changed ? "border-gold-500" : "border-gray-200 dark:border-gray-800"
                                      }`}
                                    />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
