"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { caseStudies } from "@/data/caseStudies";

// Liste serif géante (même langage que l'archive) avec preview d'image
// flottante qui suit le curseur au hover — le pattern d'agence créative
// actuel. Suivi AMORTI (lerp via rAF, zéro setState par mousemove) : le
// retard doux du cadre est ce qui donne le feel « premium ».
export default function CaseStudiesSection() {
  const { t } = useTranslation();
  const { playClick, playScrollTick } = useSound();

  const previewRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeCase = caseStudies.find((cs) => cs.slug === activeSlug);

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      const el = previewRef.current;
      if (el) {
        const current = currentRef.current;
        const target = targetRef.current;
        current.x += (target.x - current.x) * 0.12;
        current.y += (target.y - current.y) * 0.12;
        el.style.transform = `translate(${current.x + 24}px, ${current.y - 120}px) rotate(2deg)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <section
      id="work"
      className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 scroll-mt-20"
      onMouseMove={handleMouseMove}
    >
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          <Scramble text={t("studio.work.label")} />
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.work.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-12 md:mb-16 max-w-lg">
          {t("studio.work.lede")}
        </p>
      </Reveal>

      <div className="flex flex-col border-t border-ink/20">
        {caseStudies.map((caseStudy, index) => (
          <Reveal key={caseStudy.slug} delay={(index % 2) * 0.06}>
            <Link
              href={`/work/${caseStudy.slug}`}
              onClick={() => playClick()}
              onMouseEnter={(e) => {
                // Premier survol : on cale la position amortie sur le curseur
                // pour éviter que le cadre ne glisse depuis l'origine.
                if (!activeSlug) {
                  targetRef.current = { x: e.clientX, y: e.clientY };
                  currentRef.current = { x: e.clientX, y: e.clientY };
                }
                setActiveSlug(caseStudy.slug);
                playScrollTick();
              }}
              onMouseLeave={() => setActiveSlug(null)}
              className="group grid grid-cols-[44px_1fr] md:grid-cols-[64px_1fr_auto] gap-x-4 md:gap-x-8 gap-y-2 items-baseline py-7 md:py-10 border-b border-ink/20 transition-all duration-300 ease-out-expo hover:border-ink hover:pl-3 md:hover:pl-6"
            >
              <span className="font-mono text-[11px] font-bold text-ink/30 group-hover:text-blue transition-colors duration-300">
                {caseStudy.projectIndex}
              </span>
              <h3 className="font-serif lowercase text-[9vw] md:text-[4.2vw] leading-[0.95] tracking-[-0.05em] text-ink group-hover:text-blue group-hover:italic transition-colors duration-300">
                {t(`caseStudies.${caseStudy.slug}.title`)}.
              </h3>
              <div className="col-start-2 md:col-start-3 flex md:flex-col items-baseline md:items-end gap-3 md:gap-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                  {caseStudy.year}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40 hidden md:block">
                  {caseStudy.stack.slice(0, 2).join(" / ")}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Preview flottante (desktop) — suit le curseur, ne capte rien */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`hidden md:block fixed top-0 left-0 z-[60] w-[340px] pointer-events-none transition-opacity duration-300 ease-out-expo will-change-transform ${activeCase ? "opacity-100" : "opacity-0"}`}
      >
        {activeCase &&
          (activeCase.imageUrl ? (
            <div className="relative aspect-[4/3] border border-ink shadow-[12px_12px_0px_var(--blue)] overflow-hidden bg-bg">
              <Image
                src={activeCase.imageUrl}
                alt=""
                fill
                sizes="340px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-[4/3] border border-ink shadow-[12px_12px_0px_var(--blue)] bg-blue flex items-center justify-center overflow-hidden">
              <span className="absolute -bottom-6 -right-2 font-mono font-black text-[7rem] leading-none text-white/10 select-none">
                {activeCase.projectIndex}
              </span>
              <span className="relative font-serif italic lowercase text-white text-3xl tracking-[-0.03em]">
                {t(`caseStudies.${activeCase.slug}.title`)}.
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
