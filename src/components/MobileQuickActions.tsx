"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  BoltIcon, 
  BanknotesIcon, 
  ChatBubbleLeftRightIcon 
} from "@heroicons/react/24/outline";

export default function MobileQuickActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (approx 360px) and hide near bottom of document
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const nearBottom = scrollY + windowHeight >= docHeight - 350;

      if (scrollY > 380 && !nearBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none md:hidden"
        >
          <div className="pointer-events-auto flex items-center gap-1.5 bg-ink/90 dark:bg-gray-950/90 backdrop-blur-xl border border-white/15 dark:border-gold/30 shadow-[0_12px_40px_rgba(0,0,0,0.4)] rounded-full p-1.5 pl-2.5 pr-2">
            {/* Live Indicator + Rates link */}
            <Link
              href="/rates"
              className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-crimson" />
              </span>
              <span>Rates</span>
            </Link>

            {/* WhatsApp direct help */}
            <a
              href="https://wa.me/233548434599?text=Hi%20Aqiran%20Xchange,%20I%20want%20to%20trade%20gift%20cards"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-green-400 hover:text-green-300 hover:bg-white/10 active:scale-95 transition-all"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Primary Trade Button */}
            <a
              href="#calculator"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gold text-ink shadow-md active:scale-95 transition-all hover:bg-gold-400"
            >
              <BoltIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Trade Now</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
