"use client";

import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { SOCIAL_LINKS } from "@/data/constants";

const SOCIALS = [
  { labelKey: "navLinks.github", href: SOCIAL_LINKS.github },
  { labelKey: "navLinks.linkedin", href: SOCIAL_LINKS.linkedin },
  { labelKey: "navLinks.instagram", href: SOCIAL_LINKS.instagram },
  { labelKey: "navLinks.malt", href: SOCIAL_LINKS.malt },
] as const;

// Footer studio : wordmark serif italic géant « enzo gazzoli. » (point bleu),
// puis micro-footer mono sobre. L'accès à /archive se fait via la nav.
export default function StudioFooter() {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const wordmark = t("studio.nav.wordmark");

  return (
    // -mt-[2px] : le footer mord légèrement sur le bas du CTA, pour qu'aucun
    // demi-pixel d'arrondi (écrans mobiles haute densité) ne laisse passer un
    // trait clair entre les deux bleus
    <footer className="relative -mt-[2px] bg-blue text-white px-6 md:px-20 pt-16 md:pt-20 pb-8 md:pb-10 text-center">
      <Reveal>
        <h2 className="font-serif italic lowercase tracking-[-0.05em] leading-[0.9] text-[11vw] md:text-[13vw] whitespace-nowrap select-none">
          {wordmark}
        </h2>
      </Reveal>

      <div className="flex flex-col items-center gap-4 border-t border-white/20 mt-10 md:mt-14 pt-6">
        <div className="flex flex-wrap justify-center items-baseline gap-4 md:gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300"
            >
              {t(social.labelKey)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
