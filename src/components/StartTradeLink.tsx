"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useAuth } from "@/contexts/AuthContext";

interface StartTradeLinkProps {
  className?: string;
  children: React.ReactNode;
  /** Where the link sits, for analytics. */
  location: string;
}

/**
 * "Start a trade" goes straight to the dashboard trade form for signed-in
 * customers, and to the public /trade page (sign up or trade with a person)
 * for everyone else.
 */
export default function StartTradeLink({ className, children, location }: StartTradeLinkProps) {
  const { isAuthenticated } = useAuth();
  const href = isAuthenticated ? "/dashboard/trade" : "/trade";

  return (
    <Link
      href={href}
      onClick={() => track("CTA Click", { label: "Start a trade", location, signedIn: isAuthenticated })}
      className={className}
    >
      {children}
    </Link>
  );
}
