"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const SECTIONS = ["context", "problem", "approach", "results"] as const;
const secNum = (i: number) => String(i + 1).padStart(2, "0");

interface CaseStudyNarrativeProps {
  slug: string;
}

// Récit en colonne lisible avec un fil vivant dans la marge gauche : une vague
// douce contenue dans la gouttière (jamais sur le texte) qui se dessine en bleu
// au scroll (pathLength=1) avec une tête lumineuse, pastilles qui s'allument, et
// le texte des étapes à venir estompé puis éclairé. rAF léger (aucun setState
// par frame hors changement d'étape). Respecte prefers-reduced-motion.
export default function CaseStudyNarrative({ slug }: CaseStudyNarrativeProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const lengthRef = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [path, setPath] = useState<{ d: string; w: number; h: number }>({ d: "", w: 0, h: 0 });

  // Construit le fil (vague douce dans la gouttière) sur les positions réelles.
  useEffect(() => {
    const build = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const pts = dotRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: (r.left + r.right) / 2 - cRect.left, y: (r.top + r.bottom) / 2 - cRect.top };
      });
      if (!pts[0]) return;
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (!a || !b) continue;
        const bow = 14 * (i % 2 === 1 ? 1 : -1);
        const c1y = a.y + (b.y - a.y) * 0.35;
        const c2y = a.y + (b.y - a.y) * 0.65;
        d += ` C ${(a.x + bow).toFixed(1)} ${c1y.toFixed(1)}, ${(a.x + bow).toFixed(1)} ${c2y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      setPath({ d, w: 60, h: container.offsetHeight });
    };
    build();
    const ro = new ResizeObserver(build);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const p = pathRef.current;
    if (!p || !path.d) return;
    lengthRef.current = p.getTotalLength();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.style.strokeDashoffset = "0";
    }
  }, [path.d]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(SECTIONS.length - 1);
      return;
    }
    let rafId: number;
    const loop = () => {
      const container = containerRef.current;
      const p = pathRef.current;
      const tip = tipRef.current;
      const vh = window.innerHeight;

      if (container && p) {
        const rect = container.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, (vh * 0.42 - rect.top) / rect.height));
        p.style.strokeDashoffset = `${1 - prog}`;
        if (tip && lengthRef.current) {
          const pt = p.getPointAtLength(lengthRef.current * prog);
          tip.setAttribute("cx", `${pt.x}`);
          tip.setAttribute("cy", `${pt.y}`);
          tip.style.opacity = prog > 0.01 && prog < 0.99 ? "1" : "0";
        }
      }

      let a = 0;
      const anchor = vh * 0.5;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= anchor) a = i;
      });
      if (a !== activeRef.current) {
        activeRef.current = a;
        setActive(a);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      <svg
        aria-hidden="true"
        className="absolute left-0 top-0 pointer-events-none overflow-visible"
        width={path.w}
        height={path.h}
        style={{ zIndex: 0 }}
      >
        <path d={path.d} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeLinecap="round" style={{ opacity: 0.1 }} />
        <path
          ref={pathRef}
          d={path.d}
          fill="none"
          stroke="var(--blue)"
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 }}
        />
        <circle
          ref={tipRef}
          r={5}
          fill="var(--blue)"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,0,255,0.7))", opacity: 0, transition: "opacity 0.3s" }}
        />
      </svg>

      <div className="flex flex-col gap-16 md:gap-24">
        {SECTIONS.map((section, i) => {
          const reached = i <= active;
          const isResult = section === "results";
          return (
            <div
              key={section}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="relative pl-14 md:pl-16"
            >
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={`absolute left-0 top-0 z-10 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full font-mono text-[10px] md:text-[11px] font-bold transition-all duration-500 ease-out-expo ${
                  reached
                    ? "bg-blue text-white border border-blue scale-100 shadow-[0_0_0_5px_rgba(0,0,255,0.1)]"
                    : "bg-bg text-ink/40 border border-ink/20 scale-90"
                }`}
              >
                {secNum(i)}
              </span>
              <p
                className={`font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 transition-colors duration-500 ${
                  reached ? "text-blue" : "text-ink/30"
                }`}
              >
                {t(`caseStudies.sections.${section}`)}
              </p>
              <p
                className={`font-serif leading-normal max-w-xl transition-colors duration-500 ${
                  isResult ? "italic text-2xl md:text-3xl" : "text-xl md:text-2xl"
                } ${reached ? (isResult ? "text-ink" : "text-ink/85") : "text-ink/35"}`}
              >
                {t(`caseStudies.${slug}.${section}`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
