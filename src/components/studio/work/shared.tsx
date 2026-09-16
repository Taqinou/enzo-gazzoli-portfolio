"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InView from "@/components/studio/offer/InView";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { homeScroll } from "@/lib/homeScroll";
import { zoomIntoWork } from "@/lib/workZoom";
import type { CaseStudy } from "@/data/caseStudies";

/** Libellés et ouverture d'une étude de cas (morph vers /work, scroll mémorisé). */
export function useCaseStudyLinks() {
  const { t } = useTranslation();
  const { playClick, playMechanicalClack } = useSound();
  const router = useRouter();

  const title = (cs: CaseStudy) => t(`caseStudies.${cs.slug}.title`);
  const tagline = (cs: CaseStudy) => t(`caseStudies.${cs.slug}.tagline`);

  // Au clic : zoom dans l'image jusqu'au hero de la page projet (workZoom).
  const open = (e: MouseEvent<HTMLAnchorElement>, cs: CaseStudy) => {
    e.preventDefault();
    playClick();
    homeScroll.y = window.scrollY;
    const href = `/work/${cs.slug}`;
    const frame = e.currentTarget.querySelector<HTMLElement>("[data-morph]");
    const img = frame?.querySelector("img");
    if (!frame || !img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    zoomIntoWork(frame, img, cs.slug, () => router.push(href));
  };

  return { t, title, tagline, open, playMechanicalClack };
}

/** Titre de section (inchangé), sorti de la brume. */
export function WorkHeading() {
  const { t } = useTranslation();
  return (
    <InView className="studio-mist relative" delay={0.1}>
      <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
        {t("studio.work.label")}
      </p>
      <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
        {t("studio.work.heading")}
      </h2>
      <p className="font-serif italic text-lg md:text-xl text-ink/50 max-w-lg">{t("studio.work.lede")}</p>
    </InView>
  );
}

/**
 * Le visuel d'un projet : la capture de son site imprimée en pixels carrés
 * bleus #0000ff sur crème (tramage 1 bit, *-pixel.webp, cf.
 * scripts/work-pixel.py ; sneakerscope, sans site en ligne, a une plaque à son
 * nom). Servie sans réencodage : une compression avec perte baverait les
 * pixels. L'image reste telle quelle au survol (Enzo).
 */
export function WorkShot({
  cs,
  className = "relative",
  sizes = "60vw",
}: {
  cs: CaseStudy;
  /** Doit porter le positionnement (relative par défaut, ou absolute inset-0). */
  className?: string;
  sizes?: string;
}) {
  return (
    <div data-morph className={`overflow-hidden bg-bg ${className}`}>
      <Image
        src={`/images/work/${cs.slug}-pixel.webp`}
        alt=""
        fill
        sizes={sizes}
        unoptimized
        className="object-cover [image-rendering:pixelated]"
      />
    </div>
  );
}
