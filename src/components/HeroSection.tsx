"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RateBoard from "@/components/RateBoard";
import CardFan from "@/components/CardFan";
import StartTradeLink from "@/components/StartTradeLink";
import type { BoardRow } from "@/lib/rateBoard";
import { 
  BuildingStorefrontIcon, 
  BanknotesIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

interface HeroSectionProps {
  boardRows: BoardRow[];
  updatedAt?: string;
}

const trustBadges = [
  { text: "Store in Tamale", icon: BuildingStorefrontIcon },
  { text: "Paid via MoMo / Bank", icon: BanknotesIcon },
  { text: "24/7 WhatsApp Support", icon: ChatBubbleLeftRightIcon },
];

export default function HeroSection({ boardRows, updatedAt }: HeroSectionProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-white dark:bg-gray-950 pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* A single soft gold light behind the board */}
      <div aria-hidden="true" className="absolute -right-40 top-10 w-[640px] h-[640px] rounded-full bg-gold/15 blur-[120px] dark:bg-gold/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >

          <h1 className="text-[2.65rem] sm:text-6xl lg:text-[clamp(3.5rem,7.5vw,6.25rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink dark:text-white">
            Gift cards in.
            <br />
            Cedis out.
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 text-pretty">
            Sell your iTunes, Amazon, Steam and other gift cards at rates we publish openly, and get paid in cedis as soon as your card is approved.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
            <StartTradeLink
              location="Hero"
              className="inline-flex items-center justify-center gap-2 h-13 sm:h-14 px-8 rounded-full bg-gold text-ink font-semibold text-base sm:text-lg shadow-[0_10px_30px_-10px_rgba(245,180,0,0.8)] transition-[background-color,transform] duration-150 hover:bg-gold-400 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:focus-visible:outline-gold"
            >
              <span>Start a trade</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </StartTradeLink>
            <Link
              href="/rates"
              className="inline-flex items-center justify-center h-13 sm:h-14 px-6 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 font-semibold text-base sm:text-lg text-ink dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Check today&apos;s rates
            </Link>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {trustBadges.map(({ text, icon: Icon }) => (
              <div key={text} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                <Icon className="w-4 h-4 text-gold-700 dark:text-gold-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative pt-[18%] sm:pt-[17%]">
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
