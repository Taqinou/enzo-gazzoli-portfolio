"use client";

import Link from "next/link";
import { useSound } from "@/hooks/useSound";
import { useLanguage } from "@/contexts/LanguageContext";

// Nav de l'aile studio, dans la grammaire du site : fixe, mix-blend-difference,
// wordmark serif italic, micro-labels mono uppercase.
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
    <nav
      aria-label={t("studio.nav.ariaLabel")}
      className="fixed top-0 left-0 w-full flex justify-between items-baseline px-6 md:px-10 py-6 md:py-8 z-[50] pointer-events-none mix-blend-difference"
    >
      <Link
        href="/"
        onClick={() => playClick()}
        className="font-serif text-xl md:text-2xl italic lowercase text-white pointer-events-auto transition-colors duration-300 hover:text-white/60"
      >
        {t("studio.nav.wordmark")}
      </Link>

      <div className="flex items-baseline gap-4 md:gap-7">
        <div className="hidden md:flex items-baseline gap-6">
          {links.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              onClick={() => playClick()}
              className="group font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
            >
              {t(link.labelKey)}
              <span className="block h-px w-0 bg-white transition-all duration-300 ease-out-expo group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-baseline gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 pointer-events-auto">
          <button
            onClick={() => {
              setLocale("fr");
              playLanguageSwitch();
            }}
            className={`hover:text-white transition-colors ${locale === "fr" ? "text-white underline decoration-2 underline-offset-4" : ""}`}
            aria-label={t("hero.languageFrAriaLabel")}
          >
            fr
          </button>
          <span className="opacity-30">/</span>
          <button
            onClick={() => {
              setLocale("en");
              playLanguageSwitch();
            }}
            className={`hover:text-white transition-colors ${locale === "en" ? "text-white underline decoration-2 underline-offset-4" : ""}`}
            aria-label={t("hero.languageEnAriaLabel")}
          >
            en
          </button>
        </div>
      </div>
    </nav>
  );
}
