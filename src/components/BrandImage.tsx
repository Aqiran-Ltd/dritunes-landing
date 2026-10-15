"use client";

import { useState } from "react";
import Image from "next/image";
import { artForBrand } from "@/lib/cardCatalogue";
import { realImage } from "@/lib/ratesService";

interface BrandImageProps {
  name: string;
  /** Image uploaded in the admin panel; placeholders are ignored. */
  imageUrl?: string;
  /** "card" fills its 3:2 parent; "mini" is the small card used in rate rows. */
  variant?: "card" | "mini";
  sizes?: string;
}

/**
 * One rule for brand pictures everywhere: the image uploaded in the admin
 * panel first, then our own card artwork, then a plain drawn card.
 */
export default function BrandImage({ name, imageUrl, variant = "card", sizes }: BrandImageProps) {
  const [failed, setFailed] = useState(false);
  const uploaded = failed ? undefined : realImage(imageUrl);
  const art = artForBrand(name);
  const mini = variant === "mini";

  if (uploaded) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- images come from the admin panel's storage */}
        <img
          src={uploaded}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full h-full object-contain ${mini ? "p-0.5" : "p-3"}`}
        />
      </span>
    );
  }

  if (art) {
    return <Image src={art.image} alt="" fill sizes={sizes ?? (mini ? "56px" : "240px")} className="object-cover" />;
  }

  // A drawn card: charcoal face, gold chip, the brand name.
  return (
    <span className="absolute inset-0 bg-gradient-to-br from-gray-700 to-ink flex flex-col justify-between p-[9%] text-white">
      <span aria-hidden="true" className={`block rounded-[3px] bg-gradient-to-br from-gold-300 to-gold-600 ${mini ? "w-2.5 h-2" : "w-8 h-6"}`} />
      {mini ? (
        <span className="text-[10px] font-semibold leading-none text-gold">{name.charAt(0).toUpperCase()}</span>
      ) : (
        <span className="text-lg font-semibold tracking-tight leading-tight line-clamp-2">{name}</span>
      )}
    </span>
  );
}
