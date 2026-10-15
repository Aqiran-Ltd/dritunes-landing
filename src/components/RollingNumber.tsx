"use client";

import { useEffect, useState } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Odometer-style number: each digit rolls vertically to its new value.
 * Rolls up from zero once on mount. Honours reduced motion via motion-reduce.
 */
export default function RollingNumber({ value, className = "" }: { value: string; className?: string }) {
  const [shown, setShown] = useState(() => value.replace(/\d/g, "0"));

  useEffect(() => {
    // Next frame, so the first paint shows zeros and the digits roll up.
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const chars = shown.split("");

  return (
    <span className={`inline-flex ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) => {
          // Key from the right so place values stay put when the length changes.
          const key = chars.length - i;
          if (!/\d/.test(char)) {
            return (
              <span key={`s${key}`} className="inline-block h-[1em] leading-none">
                {char}
              </span>
            );
          }
          return (
            <span key={`d${key}`} className="relative inline-block h-[1em] overflow-hidden leading-none">
              <span
                className="flex flex-col transition-transform duration-700 ease-roll motion-reduce:transition-none"
                style={{ transform: `translateY(-${Number(char) * 10}%)`, transitionDelay: `${(chars.length - i) * 45}ms` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
