import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function LegalPage({ title, intro, updated, sections }: LegalPageProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-ink dark:text-white">
      <Navigation />
      <div className="flex-1 pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.02]">{title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-gray-600 dark:text-gray-400 text-pretty">{intro}</p>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Last updated {updated}</p>
          </header>

          <div className="mt-16 grid lg:grid-cols-[16rem_1fr] gap-12 lg:gap-20 border-t border-gray-200 dark:border-gray-800 pt-12">
            <nav aria-label="On this page" className="lg:sticky lg:top-32 self-start">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">On this page</h2>
              <ol className="mt-4 space-y-3">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a
                      href={`#${slug(s.title)}`}
                      className="flex gap-3 text-gray-700 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                    >
                      <span className="tabular-nums text-gray-400 dark:text-gray-500">{i + 1}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[68ch]">
              {sections.map((s, i) => (
                <section key={s.title} id={slug(s.title)} className="scroll-mt-32 pb-12 mb-12 border-b border-gray-200 dark:border-gray-800 last:border-0 last:mb-0">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em]">
                    <span className="tabular-nums text-gold-700 dark:text-gold mr-3">{i + 1}</span>
                    {s.title}
                  </h2>
                  <p className="mt-4 text-lg leading-[1.75] text-gray-700 dark:text-gray-300">{s.content}</p>
                </section>
              ))}

              <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
                <p className="text-lg font-semibold">Questions about this page?</p>
                <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
                  Email <a href="mailto:info@aqiranxchange.com" className="font-semibold text-ink dark:text-white underline underline-offset-4">info@aqiranxchange.com</a> or{" "}
                  <Link href="/contact" className="font-semibold text-ink dark:text-white underline underline-offset-4">contact us</Link>, and a person will reply.
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
