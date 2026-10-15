"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const primary =
  "inline-flex items-center h-14 px-8 rounded-full bg-gold text-ink font-semibold transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";
const secondary =
  "inline-flex items-center h-14 px-2 font-semibold underline decoration-white/30 underline-offset-8 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded";

/** Buttons for the "In your dashboard" card on /trade, aware of whether the visitor is signed in. */
export default function DashboardTradeActions() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        <Link href="/dashboard/trade" className={primary}>
          Start a trade in your dashboard
        </Link>
        <Link href="/dashboard/history" className={secondary}>
          {user?.name ? `See your trades, ${user.name.split(" ")[0]}` : "See your trades"}
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/auth/register" className={primary}>
        Create an account
      </Link>
      <Link href="/auth/login" className={secondary}>
        Log in
      </Link>
    </>
  );
}
