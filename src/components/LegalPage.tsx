import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export interface LegalSection {
  title: string;
  badge?: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  intro: string;
  updated: string;
  badge?: string;
  sections: LegalSection[];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function LegalPage({ title, intro, updated, badge, sections }: LegalPageProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-ink dark:text-white">
      <Navigation />
      <div className="flex-1 pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/15 text-gold-800 dark:text-gold-300 border border-gold-500/30 mb-4">
                <span>{badge}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.02]">{title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-gray-600 dark:text-gray-400 text-pretty">{intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: {updated}</span>
              <span>•</span>
              <span className="font-medium text-ink dark:text-gray-300">Applies to Web & Mobile Apps (iOS & Android)</span>
            </div>
          </header>

          <div className="mt-16 grid lg:grid-cols-[16rem_1fr] gap-12 lg:gap-20 border-t border-gray-200 dark:border-gray-800 pt-12">
            <nav aria-label="On this page" className="lg:sticky lg:top-32 self-start">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">On this page</h2>
              <ol className="mt-4 space-y-3">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a
                      href={`#${slug(s.title)}`}
                      className="flex gap-3 text-gray-700 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors text-sm"
                    >
                      <span className="tabular-nums text-gray-400 dark:text-gray-500 font-medium">{i + 1}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[72ch]">
              {sections.map((s, i) => (
                <section key={s.title} id={slug(s.title)} className="scroll-mt-32 pb-12 mb-12 border-b border-gray-200 dark:border-gray-800 last:border-0 last:mb-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em]">
                      <span className="tabular-nums text-gold-700 dark:text-gold mr-3">{i + 1}</span>
                      {s.title}
                    </h2>
                    {s.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-800 dark:text-gold-300 border border-gold-500/20">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 text-base sm:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 space-y-4">
                    {s.content}
                  </div>
                </section>
              ))}

              <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-6 md:p-8">
                <p className="text-lg font-semibold">Questions about this page?</p>
                <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Email <a href="mailto:info@aqiranxchange.com" className="font-semibold text-ink dark:text-white underline underline-offset-4">info@aqiranxchange.com</a> or{" "}
                  <Link href="/contact" className="font-semibold text-ink dark:text-white underline underline-offset-4">contact us</Link>, and our compliance & support team will reply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
