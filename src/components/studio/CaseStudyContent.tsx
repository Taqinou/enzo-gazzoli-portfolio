"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CaseStudyNarrative from "@/components/studio/CaseStudyNarrative";
import Reveal from "@/components/studio/Reveal";
import SmoothScroll from "@/components/studio/SmoothScroll";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { getCaseStudy, getNextCaseStudy } from "@/data/caseStudies";
import { morphOrigin } from "@/lib/morphOrigin";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const HERO_EASE = "cubic-bezier(0.16,1,0.3,1)";

interface CaseStudyContentProps {
  slug: string;
}

// Étude de cas en DA raffinée. Hero immersif : screenshot plein cadre avec
// voile crème en bas, titre + tagline en overlay, méta juste dessous.
// Narration éditoriale, filets fins, ombres douces, footer « projet suivant ».
export default function CaseStudyContent({ slug }: CaseStudyContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { playClick, playExit } = useSound();

  const heroMediaRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const morphDone = useRef(false);
  // Part caché SI on arrive via un morph (sinon visible d'emblée) → un seul
  // fondu d'apparition, jamais de fade-out puis fade-in.
  const [textVisible, setTextVisible] = useState(
    () => !(morphOrigin.slug === slug && morphOrigin.rect),
  );

  // Morph unifié : si on arrive depuis une vignette « travaux », le hero se
  // déplie lui-même depuis la position mémorisée (fixed → plein écran, l'image
  // object-cover se recadre sans distorsion), puis se rend à son flux normal.
  // Le texte est le vrai texte, il apparaît en fondu. Aucun clone, aucun raccord.
  useIsoLayoutEffect(() => {
    // Garde one-shot : le StrictMode (dev) double-appelle l'effet ; on ne
    // déclenche le morph qu'une fois et on NE nettoie PAS les timers (sinon le
    // 1er nettoyage StrictMode laisserait le média bloqué en position:fixed).
    if (morphDone.current) return;
    if (morphOrigin.slug !== slug || !morphOrigin.rect) return;
    morphDone.current = true;
    const r = morphOrigin.rect;
    morphOrigin.rect = null;
    morphOrigin.slug = null;
    const el = heroMediaRef.current;
    const veil = veilRef.current;
    if (!el) return;

    setTextVisible(false);
    // pas de z-index : le média reste sous le texte (z-10) et sous la nav
    // (z-50), il ne les couvre jamais.
    Object.assign(el.style, {
      position: "fixed",
      top: `${r.top}px`,
      left: `${r.left}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      borderRadius: "16px",
    } as Partial<CSSStyleDeclaration> as CSSStyleDeclaration);
    if (veil) veil.style.opacity = "0";
    el.getBoundingClientRect(); // reflow

    el.style.transition = `top .7s ${HERO_EASE}, left .7s ${HERO_EASE}, width .7s ${HERO_EASE}, height .7s ${HERO_EASE}, border-radius .7s ${HERO_EASE}`;
    if (veil) veil.style.transition = `opacity .7s ${HERO_EASE}`;
    requestAnimationFrame(() => {
      Object.assign(el.style, {
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "82vh",
        borderRadius: "0px",
      } as CSSStyleDeclaration);
      if (veil) veil.style.opacity = "1";
    });

    // Fin du morph : le média se rend à son flux normal (absolute inset-0 via
    // className) et le texte s'affiche. Déclenchée au timer OU immédiatement si
    // l'utilisateur scrolle (sinon le média fixed bloquerait la vue).
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchmove", finish);
      el.removeAttribute("style");
      if (veil) veil.removeAttribute("style");
      setTextVisible(true);
    };
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("touchmove", finish, { passive: true });
    window.setTimeout(() => setTextVisible(true), 420);
    window.setTimeout(finish, 760);
  }, [slug]);

  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return null;

  const nextCaseStudy = getNextCaseStudy(slug);
  const titleText = t(`caseStudies.${slug}.title`);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/");
    }, 80);
  };

  // Hero projet : champ bleu + gros index en filigrane À DROITE (pas de
  // screenshot → cohérence avec les miniatures bleues et morph propre). Le titre
  // est porté par l'overlay du hero, pas de doublon.
  const visual = () => (
    <div className="absolute inset-0 bg-blue overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute bottom-[12vh] right-[-2vw] font-mono font-black text-[42vw] md:text-[26vw] leading-none text-white select-none"
        style={{ opacity: 0.12 }}
      >
        {caseStudy.projectIndex}
      </span>
    </div>
  );

  return (
    <SmoothScroll>
      {/* overflow-x-clip (pas -hidden) : clippe l'horizontal SANS créer de
          conteneur de scroll imbriqué qui entrerait en conflit avec Lenis
          (sinon scroll bancal sur la page projet). */}
      <div className="min-h-screen bg-bg text-ink overflow-x-clip">
        {/* Nav retour */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline px-6 md:px-10 py-6 md:py-8 z-[50] pointer-events-none mix-blend-difference">
          <a
            href="/"
            onClick={handleBack}
            className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
          >
            {t("caseStudies.backToStudio")}
          </a>
          <Link
            href="/services"
            onClick={() => playClick()}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
          >
            {t("studio.cta.button")}
          </Link>
        </nav>

        {/* Hero immersif */}
        <header className="relative flex min-h-[82vh] items-end overflow-hidden">
          {/* média (image + voile) : c'est CE bloc qui se déplie depuis la
              vignette lors du morph (voir useIsoLayoutEffect) */}
          <div ref={heroMediaRef} className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">{visual()}</div>
            {/* voile crème bas pour poser le titre en ink */}
            <div
              ref={veilRef}
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(249,249,249,0.25)_0%,rgba(249,249,249,0)_28%,rgba(249,249,249,0)_45%,rgba(249,249,249,0.75)_74%,rgb(249,249,249)_97%)]"
            />
          </div>
          {/* Le texte est le vrai texte (aucun clone) : présent en visite
              directe, en fondu doux lors du morph (textVisible). */}
          <div
            className="relative z-10 w-full px-6 md:px-20 pb-12 md:pb-16"
            style={{ opacity: textVisible ? 1 : 0, transition: "opacity .5s ease" }}
          >
            <h1 className="font-serif lowercase tracking-[-0.05em] leading-[0.9] text-[14vw] md:text-[min(8vw,7rem)]">
              {titleText}.
            </h1>
            <p className="font-serif italic text-xl md:text-3xl text-ink/60 mt-4 max-w-2xl leading-snug">
              {t(`caseStudies.${slug}.tagline`)}
            </p>
          </div>
        </header>

        {/* Méta */}
        <Reveal delay={0.1}>
          <div className="px-6 md:px-20 py-10 md:py-14 border-b border-ink/[0.12]">
            <dl className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-4">
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.year")}
                </dt>
                <dd className="font-serif text-lg md:text-xl">{caseStudy.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.role")}
                </dt>
                <dd className="font-serif text-lg md:text-xl lowercase">
                  {t(`caseStudies.${slug}.role`)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-1">
                  {t("caseStudies.stack")}
                </dt>
                <dd className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] pt-1.5">
                  {caseStudy.stack.join(" / ")}
                </dd>
              </div>
              {caseStudy.liveUrl && (
                <div className="md:ml-auto">
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="inline-block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blue underline decoration-1 underline-offset-8 hover:text-ink transition-colors duration-300 pt-2"
                  >
                    {t("caseStudies.visit")} ↗
                  </a>
                </div>
              )}
            </dl>
          </div>
        </Reveal>

        {/* Narration — fil de process animé au scroll */}
        <main className="px-6 md:px-20 py-16 md:py-24">
          <CaseStudyNarrative slug={slug} />
        </main>

        {/* Étude suivante + mini-CTA */}
        <footer className="bg-blue text-white px-6 md:px-20 py-16 md:py-24 overflow-hidden">
          <Reveal>
            <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">
              {t("caseStudies.next")}
            </p>
            <Link
              href={`/work/${nextCaseStudy.slug}`}
              onClick={() => playClick()}
              className="group inline-block font-serif lowercase italic tracking-[-0.05em] leading-085 text-[10vw] md:text-[min(5vw,4.5rem)] hover:text-ink transition-colors duration-300"
            >
              {t(`caseStudies.${nextCaseStudy.slug}.title`)}.{" "}
              <span
                aria-hidden="true"
                className="inline-block not-italic transition-transform duration-300 ease-out-expo group-hover:translate-x-3"
              >
                →
              </span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-t border-white/20 mt-12 md:mt-16 pt-8">
              <p className="font-serif italic text-lg md:text-xl text-white/70">
                {t("caseStudies.miniCta")}
              </p>
              <Link
                href="/services"
                onClick={() => playClick()}
                className="inline-flex items-center gap-2 self-start rounded-full bg-white text-blue px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold hover:bg-ink hover:text-white transition-colors duration-300"
              >
                {t("studio.cta.button")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </footer>

        {/* Texture grain globale */}
        <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </SmoothScroll>
  );
}
