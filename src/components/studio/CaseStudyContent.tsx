"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/studio/Reveal";
import Scramble from "@/components/studio/Scramble";
import SmoothScroll from "@/components/studio/SmoothScroll";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { getCaseStudy, getNextCaseStudy } from "@/data/caseStudies";

const SECTIONS = ["context", "problem", "approach", "results"] as const;

interface CaseStudyContentProps {
  slug: string;
}

// Étude de cas dans la grammaire du site : nav mix-blend-difference, titre
// serif géant révélé par masque, numéro filigrane, méta mono, sections
// éditoriales, étude suivante en serif italic.
export default function CaseStudyContent({ slug }: CaseStudyContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { playClick, playExit } = useSound();

  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return null;

  const nextCaseStudy = getNextCaseStudy(slug);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/");
    }, 80);
  };

  return (
    <SmoothScroll>
    <div className="min-h-screen bg-bg text-ink overflow-x-hidden">
      {/* Nav retour (pattern /services, /cv) */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline px-6 md:px-10 py-6 md:py-8 z-[50] pointer-events-none mix-blend-difference">
        <a
          href="/"
          onClick={handleBack}
          className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
        >
          {t("caseStudies.backToStudio")}
        </a>
        <Link
          href="/services#contact"
          onClick={() => playClick()}
          className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
        >
          {t("studio.cta.button")}
        </Link>
      </nav>

      {/* Hero de l'étude */}
      <header className="relative px-6 md:px-20 pt-32 md:pt-44 pb-12 md:pb-16 overflow-hidden">
        <span
          aria-hidden="true"
          className="absolute top-10 right-0 font-mono font-black text-ink opacity-[0.04] text-[clamp(10rem,28vw,24rem)] leading-[0.8] tracking-[-0.05em] select-none pointer-events-none"
        >
          {caseStudy.projectIndex}
        </span>

        <Reveal>
          <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-5">
            <Scramble text={`${t("studio.work.label")} / ${caseStudy.projectIndex}`} />
          </p>
        </Reveal>

        <h1 className="font-serif lowercase tracking-[-0.05em] leading-[0.95] text-[13vw] md:text-[8vw]">
          <Reveal variant="mask" delay={0.1}>
            <span>{t(`caseStudies.${slug}.title`)}.</span>
          </Reveal>
        </h1>

        <Reveal delay={0.25}>
          <p className="font-serif italic text-xl md:text-3xl text-ink/60 mt-6 max-w-2xl leading-snug">
            {t(`caseStudies.${slug}.tagline`)}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <dl className="flex flex-wrap gap-x-10 md:gap-x-16 gap-y-4 mt-10 md:mt-12 border-t border-ink/20 pt-6">
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
        </Reveal>
      </header>

      {/* Visuel principal */}
      {caseStudy.imageUrl && (
        <Reveal className="px-6 md:px-20 pb-14 md:pb-20">
          <div className="relative aspect-video border border-ink overflow-hidden shadow-[20px_20px_0px_var(--blue)] md:-rotate-1">
            <Image
              src={caseStudy.imageUrl}
              alt={t(`caseStudies.${slug}.title`)}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      {/* Sections narratives */}
      <main className="px-6 md:px-20 pb-20 md:pb-32">
        <div className="flex flex-col gap-14 md:gap-20 max-w-3xl">
          {SECTIONS.map((section, index) => (
            <Reveal key={section} delay={index === 0 ? 0 : 0.08}>
              <section className="border-t border-ink/20 pt-6">
                <h2 className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-5">
                  ({String(index + 1).padStart(2, "0")}) —{" "}
                  {t(`caseStudies.sections.${section}`)}
                </h2>
                <p className="font-serif text-xl md:text-2xl leading-normal text-ink/80">
                  {t(`caseStudies.${slug}.${section}`)}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </main>

      {/* Étude suivante + mini-CTA */}
      <footer className="bg-blue text-white px-6 md:px-20 py-16 md:py-24 overflow-hidden">
        <Reveal>
          <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            {t("caseStudies.next")}
          </p>
          <Link
            href={`/work/${nextCaseStudy.slug}`}
            onClick={() => playClick()}
            className="group inline-block font-serif lowercase italic tracking-[-0.05em] leading-085 text-[10vw] md:text-[5vw] hover:text-ink transition-colors duration-300"
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
              href="/services#contact"
              onClick={() => playClick()}
              className="inline-block self-start bg-white text-blue px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold hover:bg-transparent hover:text-white border border-white transition-colors duration-300"
            >
              {t("studio.cta.button")}
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
