"use client";

import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL, SOCIAL_LINKS } from "@/data/constants";

const SOCIALS = [
  { labelKey: "navLinks.github", href: SOCIAL_LINKS.github },
  { labelKey: "navLinks.linkedin", href: SOCIAL_LINKS.linkedin },
  { labelKey: "navLinks.instagram", href: SOCIAL_LINKS.instagram },
  { labelKey: "navLinks.malt", href: SOCIAL_LINKS.malt },
] as const;

// Footer studio : la porte vers l'aile folio en serif italic géant (hover
// bleu + italique inversée), micro-footer mono.
export default function StudioFooter() {
  const { t } = useTranslation();
  const { playClick, playMechanicalClack } = useSound();

  return (
    <footer className="relative bg-bg text-ink px-6 md:px-20 pt-20 md:pt-32 pb-10">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-6">
          <Scramble text={t("studio.footer.archiveLead")} />
        </p>
        <Link
          href="/archive"
          onClick={() => playMechanicalClack(120, 0.5)}
          className="group inline-block font-serif lowercase italic tracking-[-0.05em] leading-085 text-[11vw] md:text-[6vw] hover:text-blue transition-colors duration-300"
        >
          {t("studio.footer.archiveLink")}{" "}
          <span
            aria-hidden="true"
            className="inline-block not-italic transition-transform duration-300 ease-out-expo group-hover:translate-x-3"
          >
            →
          </span>
        </Link>
      </Reveal>

      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-t border-ink/20 mt-16 md:mt-24 pt-6">
        <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 hover:text-blue transition-colors duration-300"
            >
              {t(social.labelKey)}
            </a>
          ))}
        </div>
        <div className="flex items-baseline gap-4 md:gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
          <span>{PERSONAL.location}</span>
          <span className="opacity-40">|</span>
          <span>{t("studio.footer.colophon")}</span>
        </div>
      </div>
    </footer>
  );
}
