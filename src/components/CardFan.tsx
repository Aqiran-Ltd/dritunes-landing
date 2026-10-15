"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cardByName } from "@/lib/cardCatalogue";

// Back to front, as left/top percentages of the fan area. Each card is 38% of
// the board's width; they fan out from a stack in the middle once on load.
const CARD_WIDTH = 38;
const STACK_LEFT = 31;
const FAN = [
  { name: "Razer Gold", left: 3, top: 26, rotate: -9 },
  { name: "Amazon", left: 21, top: 8, rotate: -3 },
  { name: "Steam", left: 40, top: 4, rotate: 3 },
  { name: "Apple / iTunes", left: 59, top: 20, rotate: 9 },
];

/** Real gift cards tucked behind the top of the rate board: the "cards in" half of the hero. */
export default function CardFan({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      {FAN.map((card, i) => {
        const art = cardByName(card.name);
        if (!art) return null;
        return (
          <motion.div
            key={card.name}
            initial={{ x: `${((STACK_LEFT - card.left) / CARD_WIDTH) * 100}%`, y: "45%", rotate: 0, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: card.rotate, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 17, delay: 0.3 + i * 0.07 }}
            style={{ left: `${card.left}%`, top: `${card.top}%`, width: `${CARD_WIDTH}%` }}
            className="absolute aspect-[3/2] rounded-[14px] overflow-hidden shadow-[0_18px_40px_-18px_rgba(26,26,29,0.6)] ring-1 ring-black/5"
          >
            <Image src={art.image} alt="" fill sizes="(min-width: 1024px) 200px, 38vw" className="object-cover" priority />
          </motion.div>
        );
      })}
    </div>
  );
}
