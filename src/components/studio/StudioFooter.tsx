"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL, SOCIAL_LINKS } from "@/data/constants";

const SOCIALS = [
  { labelKey: "navLinks.github", href: SOCIAL_LINKS.github },
  { labelKey: "navLinks.linkedin", href: SOCIAL_LINKS.linkedin },
  { labelKey: "navLinks.instagram", href: SOCIAL_LINKS.instagram },
  { labelKey: "navLinks.malt", href: SOCIAL_LINKS.malt },
] as const;

// Footer studio : la porte vers l'aile folio (/archive) en accent serif —
// le pont visuel entre les deux ailes — puis micro-footer sobre.
export default function StudioFooter() {
  const { t } = useTranslation();
  const { playClick, playMechanicalClack } = useSound();

  return (
    <footer className="relative max-w-5xl mx-auto px-6 pb-10">
      {/* Porte vers l'archive */}
      <div className="rounded-2xl border border-ink/10 bg-white px-7 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40 mb-2">
            {t("studio.footer.archiveLead")}
          </p>
          <p className="font-serif italic lowercase text-2xl md:text-3xl text-ink tracking-[-0.02em]">
            {t("studio.footer.archiveLink")}
          </p>
        </div>
        <Link
          href="/archive"
          onClick={() => playMechanicalClack(120, 0.5)}
          className="group inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-ink/15 font-studio text-sm font-medium text-ink px-6 py-3 hover:border-blue/40 hover:text-blue transition-colors duration-300 shrink-0"
        >
          {t("studio.nav.archive").toLowerCase()}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Micro-footer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-ink/10 mt-10 pt-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {SOCIALS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="font-studio text-[13px] font-medium lowercase text-ink/50 hover:text-blue transition-colors duration-300"
            >
              {t(social.labelKey).toLowerCase()}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">
          <span>{PERSONAL.location}</span>
          <span className="opacity-50">·</span>
          <span>{t("studio.footer.colophon")}</span>
        </div>
      </div>
    </footer>
  );
}
