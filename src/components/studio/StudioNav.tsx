"use client";

import Link from "next/link";
import { useSound } from "@/hooks/useSound";
import { useLanguage } from "@/contexts/LanguageContext";

// Nav flottante en pilule (langage tech moderne) : glass subtil, liens
// sans-serif, CTA visible en permanence — la nav fait partie du funnel.
export default function StudioNav() {
  const { locale, setLocale, t } = useLanguage();
  const { playClick, playLanguageSwitch } = useSound();

  const links = [
    { labelKey: "studio.nav.work", href: "/#work" },
    { labelKey: "studio.nav.method", href: "/#method" },
    { labelKey: "studio.nav.services", href: "/services" },
    { labelKey: "studio.nav.archive", href: "/archive" },
  ];

  return (
    <header className="fixed top-4 inset-x-4 md:inset-x-0 z-[50]">
      <nav
        aria-label={t("studio.nav.ariaLabel")}
        className="max-w-4xl mx-auto flex items-center justify-between gap-4 rounded-full border border-ink/10 bg-bg/80 backdrop-blur-xl pl-5 pr-2 py-2 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.15)]"
      >
        <Link
          href="/"
          onClick={() => playClick()}
          className="font-serif italic lowercase text-lg text-ink hover:text-blue transition-colors duration-300 shrink-0"
        >
          {t("studio.nav.wordmark")}
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              onClick={() => playClick()}
              className="font-studio text-[13px] font-medium lowercase text-ink/55 hover:text-ink rounded-full px-3.5 py-1.5 hover:bg-ink/[0.04] transition-colors duration-200"
            >
              {t(link.labelKey).toLowerCase()}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 font-studio text-[12px] font-medium text-ink/40 pr-1">
            <button
              onClick={() => {
                setLocale("fr");
                playLanguageSwitch();
              }}
              className={`rounded-full px-2 py-1 transition-colors duration-200 hover:text-ink ${locale === "fr" ? "text-ink bg-ink/[0.05]" : ""}`}
              aria-label={t("hero.languageFrAriaLabel")}
            >
              fr
            </button>
            <button
              onClick={() => {
                setLocale("en");
                playLanguageSwitch();
              }}
              className={`rounded-full px-2 py-1 transition-colors duration-200 hover:text-ink ${locale === "en" ? "text-ink bg-ink/[0.05]" : ""}`}
              aria-label={t("hero.languageEnAriaLabel")}
            >
              en
            </button>
          </div>
          <Link
            href="/services#contact"
            onClick={() => playClick()}
            className="rounded-full bg-blue text-white font-studio text-[13px] font-semibold px-5 py-2 hover:bg-ink transition-colors duration-300 whitespace-nowrap"
          >
            {t("studio.hero.ctaPrimary")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
