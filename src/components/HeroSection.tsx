"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RateBoard from "@/components/RateBoard";
import CardFan from "@/components/CardFan";
import StartTradeLink from "@/components/StartTradeLink";
import type { BoardRow } from "@/lib/rateBoard";

interface HeroSectionProps {
  boardRows: BoardRow[];
  updatedAt?: string;
}

const facts = ["A walk-in store in Tamale", "Paid to mobile money or bank", "Support on WhatsApp, day and night"];

export default function HeroSection({ boardRows, updatedAt }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-28 pb-20 lg:pt-32 lg:pb-28">
      {/* A single soft gold light behind the board */}
      <div aria-hidden="true" className="absolute -right-40 top-10 w-[640px] h-[640px] rounded-full bg-gold/15 blur-[120px] dark:bg-gold/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(3rem,8vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink dark:text-white">
            Gift cards in.
            <br />
            Cedis out.
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 text-pretty">
            Sell your iTunes, Amazon, Steam and other gift cards at rates we publish openly, and get paid in cedis as soon as your card is approved.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <StartTradeLink
              location="Hero"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gold text-ink font-semibold text-lg shadow-[0_10px_30px_-10px_rgba(245,180,0,0.8)] transition-[background-color,transform] duration-150 hover:bg-gold-400 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:focus-visible:outline-gold"
            >
              Start a trade
            </StartTradeLink>
            <Link
              href="/rates"
              className="inline-flex items-center h-14 px-2 font-semibold text-lg text-ink dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-8 hover:decoration-ink dark:hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold rounded"
            >
              Check today&apos;s rates
            </Link>
          </div>

          <ul className="mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-3 text-gray-600 dark:text-gray-400">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold" />
                {fact}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="relative pt-[17%]">
          <CardFan className="absolute inset-x-0 top-0 aspect-[4/1]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative z-10"
          >
            <RateBoard rows={boardRows} updatedAt={updatedAt} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
