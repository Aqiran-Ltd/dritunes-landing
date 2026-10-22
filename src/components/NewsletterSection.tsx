"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post("/newsletter/subscribe", {
        name,
        email,
        phone
      });
      
      setIsSubscribed(true);
      setEmail("");
      setName("");
      setPhone("");
      // Success message will stay visible
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      setError(err.message || "We could not subscribe you just now. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="bg-gold text-ink py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.08] text-balance">
            Hear about rate changes before you trade
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-ink/80 text-pretty">
            One short email a week with the cards paying best right now, plus notice of new cards we accept. Add your phone number if you would rather get it by SMS.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label htmlFor="nl-name" className="block text-xs sm:text-sm font-medium mb-1.5">Your name</label>
              <input id="nl-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-ink/15 bg-white text-ink text-base placeholder-gray-500 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-colors" required />
            </div>
            <div>
              <label htmlFor="nl-email" className="block text-xs sm:text-sm font-medium mb-1.5">Email address</label>
              <input id="nl-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-ink/15 bg-white text-ink text-base placeholder-gray-500 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-colors" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="nl-phone" className="block text-xs sm:text-sm font-medium mb-1.5">Phone number <span className="font-normal text-ink/60">(optional, for SMS)</span></label>
              <input id="nl-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-ink/15 bg-white text-ink text-base placeholder-gray-500 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 transition-colors" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="nl-consent" className="flex items-start gap-3 cursor-pointer py-1">
                <input id="nl-consent" type="checkbox" className="mt-0.5 w-4 h-4 rounded border-ink/30 accent-ink shrink-0" required />
                <span className="text-xs sm:text-sm text-ink/80 leading-snug">
                  Send me rate updates from Aqiran Xchange. I can unsubscribe from any email.
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="sm:col-span-2 h-13 sm:h-14 rounded-full bg-ink text-white font-semibold text-base transition-all hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink active:scale-[0.98]"
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? "Subscribing..." : "Subscribe to updates"}
            </button>
          </form>

          <AnimatePresence>
            {isSubscribed && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 text-sm font-medium"
              >
                <CheckCircleIcon className="w-5 h-5 shrink-0 text-gold" />
                Almost done. Open the email we just sent and confirm your subscription.
              </motion.p>
            )}
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-3 rounded-xl bg-white text-red-700 border border-red-200 px-4 py-3 text-sm font-medium"
              >
                <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
