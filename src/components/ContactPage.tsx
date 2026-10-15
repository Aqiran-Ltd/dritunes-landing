"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";
import { toast } from "react-hot-toast";
import { fetchSocials, Socials } from "@/lib/socialService";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

function extractPhone(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    const path = new URL(url).pathname.replace(/^\//, '');
    const digits = path.replace(/[^\d]/g, '');
    if (digits.length >= 7) return `+${digits}`;
  } catch {
    // not a valid URL — use as-is if it looks like a number
    const digits = url.replace(/[^\d]/g, '');
    if (digits.length >= 7) return `+${digits}`;
  }
  return url;
}

const SOCIAL_ICONS: Record<string, (className: string) => React.ReactNode> = {
  FB: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
  IG: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>),
  TG: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>),
  TK: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>),
  X: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
  YT: (className) => (<svg className={className} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>),
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socials, setSocials] = useState<Socials | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchSocials().then(setSocials);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: `${formData.message}\n\nPhone: ${formData.phone}`
      });
      
      track('Contact Form Submitted', { subject: formData.subject });
      toast.success("Message sent. We will reply by email.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error(error.message || "Your message did not send. Check your connection and try again, or message us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = extractPhone(socials?.whatsapp, "+233548434599");
  const whatsappHref = socials?.whatsapp ? `https://wa.me/${socials.whatsapp.replace(/\D/g, '')}` : "https://wa.me/233548434599";

  const channels = [
    { name: "Facebook", icon: "FB", href: socials?.facebook },
    { name: "Instagram", icon: "IG", href: socials?.instagram },
    { name: "Telegram", icon: "TG", href: socials?.telegram },
    { name: "TikTok", icon: "TK", href: socials?.tiktok },
    { name: "X", icon: "X", href: socials?.x_twitter },
    { name: "YouTube", icon: "YT", href: socials?.youtube },
  ].filter((c) => !!c.href);

  const methods = [
    { label: "WhatsApp and Telegram", value: whatsappNumber, note: "Fastest. We reply day and night.", href: whatsappHref, external: true },
    { label: "Phone", value: whatsappNumber, note: "Call any time.", href: `tel:${whatsappNumber.replace(/\s/g, "")}` },
    { label: "Email", value: "info@aqiranxchange.com", note: "For business and anything you want in writing.", href: "mailto:info@aqiranxchange.com" },
    { label: "Store", value: "Tamale, Northern Region", note: "Walk in to trade in person. We serve customers across Ghana." },
  ];

  return (
    <section className="bg-white dark:bg-gray-950 text-ink dark:text-white pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div>
            <SectionHeading
              as="h1"
              title="Talk to a person"
              intro="WhatsApp is the quickest way to reach us. Use the form when you want a reply by email."
            />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("Contact Click", { channel: "WhatsApp", location: "Contact Page" })}
              className="mt-8 inline-flex items-center gap-3 h-14 px-7 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600"
            >
              Chat on WhatsApp
            </a>

            <dl className="mt-12 border-t border-gray-200 dark:border-gray-800">
              {methods.map((m) => (
                <div key={m.label} className="py-5 border-b border-gray-200 dark:border-gray-800 grid sm:grid-cols-[11rem_1fr] gap-1 sm:gap-6">
                  <dt className="text-gray-600 dark:text-gray-400">{m.label}</dt>
                  <dd>
                    {m.href ? (
                      <a
                        href={m.href}
                        {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="font-semibold underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4 hover:decoration-ink dark:hover:decoration-white transition-colors"
                      >
                        {m.value}
                      </a>
                    ) : (
                      <span className="font-semibold">{m.value}</span>
                    )}
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.note}</p>
                  </dd>
                </div>
              ))}
            </dl>

            <div role="note" className="mt-10 flex gap-4 rounded-2xl bg-gray-50 dark:bg-gray-900 p-5">
              <span aria-hidden="true" className="mt-1.5 w-2.5 h-2.5 shrink-0 rounded-full bg-crimson" />
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                <strong className="font-semibold text-ink dark:text-white">We will never ask for your gift card codes</strong> outside our website, our app or our official WhatsApp. If someone does, it is not us.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight">Send a message</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">We reply by email, usually within a day.</p>
            <form onSubmit={handleSubmit} className="mt-8 grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="c-name" className="block text-sm font-medium mb-1.5">Your name</label>
                <input id="c-name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-ink dark:text-white placeholder-gray-400 focus:outline-none focus:border-ink dark:focus:border-gold focus:ring-2 focus:ring-gold/40 transition-colors" required />
              </div>
              <div>
                <label htmlFor="c-email" className="block text-sm font-medium mb-1.5">Email address</label>
                <input id="c-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-ink dark:text-white placeholder-gray-400 focus:outline-none focus:border-ink dark:focus:border-gold focus:ring-2 focus:ring-gold/40 transition-colors" required />
              </div>
              <div>
                <label htmlFor="c-phone" className="block text-sm font-medium mb-1.5">Phone number</label>
                <input id="c-phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-ink dark:text-white placeholder-gray-400 focus:outline-none focus:border-ink dark:focus:border-gold focus:ring-2 focus:ring-gold/40 transition-colors" required />
              </div>
              <div>
                <label htmlFor="c-subject" className="block text-sm font-medium mb-1.5">Subject</label>
                <input id="c-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="A trade, a payout, training" className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-ink dark:text-white placeholder-gray-400 focus:outline-none focus:border-ink dark:focus:border-gold focus:ring-2 focus:ring-gold/40 transition-colors" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="block text-sm font-medium mb-1.5">Message</label>
                <textarea id="c-message" name="message" rows={6} value={formData.message} onChange={handleChange} placeholder="If it is about a trade, include the trade number." className="w-full px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-ink dark:text-white placeholder-gray-400 focus:outline-none focus:border-ink dark:focus:border-gold focus:ring-2 focus:ring-gold/40 transition-colors py-3 resize-y" required />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="sm:col-span-2 h-14 rounded-full bg-gold hover:bg-gold-400 text-ink font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:focus-visible:outline-gold"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? "Sending" : "Send message"}
              </button>
            </form>
          </div>
        </div>

        {channels.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Our official channels</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Rate updates, tips and news. Only trust the accounts listed here.</p>
            </div>
            <ul className="flex flex-wrap gap-3">
              {channels.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Aqiran Xchange on ${c.name}`}
                    onClick={() => track("Social Link Click", { platform: c.name, location: "Contact Page" })}
                    className="grid place-items-center w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 text-ink dark:text-white hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {SOCIAL_ICONS[c.icon]("w-5 h-5")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
