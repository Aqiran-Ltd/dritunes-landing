import type { ReactNode } from "react";

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.aqiranxchange.app";

const badgeBase =
  "group relative flex h-16 w-full sm:w-64 items-center gap-3 rounded-xl border px-5 text-left transition-[transform,background-color,border-color] duration-200 ease-out";

const PlayIcon = (
  <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden="true">
    <path fill="#00d7fe" d="M3.6 1.9c-.3.3-.5.8-.5 1.4v17.4c0 .6.2 1.1.5 1.4l.1.1 9.7-9.7v-.2L3.7 1.8z" />
    <path fill="#ffce00" d="m16.6 15.6-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.2c1.1.6 1.1 1.600 0 2.200l-3.800 2.100z" />
    <path fill="#f43249" d="m16.7 15.5-3.300-3.300-9.800 9.800c.4.400 1 .4 1.600.1l11.500-6.600" />
    <path fill="#00f076" d="M16.700 8.900 5.200 2.300c-.6-.3-1.200-.3-1.600.1l9.800 9.800 3.300-3.300z" />
  </svg>
);

const AppleIcon = (
  <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.6c0-2.500 2-3.700 2.100-3.800-1.200-1.700-3-1.900-3.600-2-1.500-.2-3 .9-3.800.9s-2-.9-3.300-.8c-1.700 0-3.300 1-4.100 2.500-1.800 3.100-.5 7.600 1.300 10.100.9 1.200 1.900 2.600 3.200 2.500 1.300-.1 1.800-.8 3.300-.8s2 .8 3.300.8c1.400 0 2.300-1.200 3.100-2.400 1-1.400 1.400-2.800 1.400-2.900-.1 0-2.900-1.100-2.900-4.100zM14 5.200c.7-.9 1.200-2 1-3.200-1 0-2.300.7-3 1.600-.7.800-1.200 2-1.100 3.100 1.200.1 2.300-.6 3.100-1.500z" />
  </svg>
);

function Label({ small, big }: { small: string; big: string }): ReactNode {
  return (
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">{small}</span>
      <span className="text-xl font-semibold tracking-tight">{big}</span>
    </span>
  );
}

export function PlayStoreBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Aqiran Xchange on Google Play"
      className={`${badgeBase} border-white/25 bg-black text-white hover:-translate-y-0.5 hover:border-gold-400 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 motion-reduce:transition-none`}
    >
      {PlayIcon}
      <Label small="Get it on" big="Google Play" />
    </a>
  );
}

export function AppStoreBadge() {
  return (
    <div
      role="group"
      aria-label="App Store: coming soon"
      className={`${badgeBase} cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 dark:border-white/15 dark:bg-white/5 dark:text-gray-400`}
    >
      <span className="opacity-60">{AppleIcon}</span>
      <Label small="Download on the" big="App Store" />
      <span className="absolute -top-2.5 right-3 rounded-full bg-gold-500 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
        Coming soon
      </span>
    </div>
  );
}
