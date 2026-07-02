"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { getCaseStudy, getNextCaseStudy } from "@/data/caseStudies";

const SECTIONS = ["context", "problem", "approach", "results"] as const;

interface CaseStudyContentProps {
  slug: string;
}

// Page d'étude de cas (langage tech moderne) : nav pill retour, header
// typographique, méta en pills, sections narratives, next-case en carte.
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
    <div className="min-h-screen bg-bg text-ink overflow-x-hidden">
      {/* Nav retour flottante */}
      <header className="fixed top-4 inset-x-4 md:inset-x-0 z-[50]">
        <nav className="max-w-4xl mx-auto flex items-center justify-between rounded-full border border-ink/10 bg-bg/80 backdrop-blur-xl pl-3 pr-2 py-2 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.15)]">
          <a
            href="/"
            onClick={handleBack}
            className="group inline-flex items-center gap-2 rounded-full font-studio text-[13px] font-medium text-ink/60 hover:text-ink px-3 py-1.5 hover:bg-ink/[0.04] transition-colors duration-200"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            {t("caseStudies.backToStudio")}
          </a>
          <Link
            href="/services#contact"
            onClick={() => playClick()}
            className="rounded-full bg-blue text-white font-studio text-[13px] font-semibold px-5 py-2 hover:bg-ink transition-colors duration-300"
          >
            {t("studio.cta.button")}
          </Link>
        </nav>
      </header>

      {/* Header de l'étude */}
      <header className="relative max-w-4xl mx-auto px-6 pt-36 md:pt-44 pb-10 overflow-hidden">
        <Reveal>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue mb-5">
            {t("studio.work.label")} / {caseStudy.projectIndex}
          </p>
          <h1 className="font-studio font-bold tracking-[-0.04em] leading-[1.02] text-4xl md:text-6xl text-ink lowercase">
            {t(`caseStudies.${slug}.title`)}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-serif italic text-xl md:text-2xl text-ink/60 mt-5 max-w-2xl leading-snug">
            {t(`caseStudies.${slug}.tagline`)}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center gap-2 mt-8">
            <span className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink/55">
              {t("caseStudies.year")} · {caseStudy.year}
            </span>
            <span className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink/55 lowercase normal-case">
              {t(`caseStudies.${slug}.role`)}
            </span>
            {caseStudy.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-ink/45"
              >
                {tech}
              </span>
            ))}
            {caseStudy.liveUrl && (
              <a
                href={caseStudy.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="group inline-flex items-center gap-1.5 rounded-full bg-blue/[0.08] border border-blue/25 px-3.5 py-1.5 font-studio text-[12px] font-semibold text-blue hover:bg-blue hover:text-white transition-colors duration-300"
              >
                {t("caseStudies.visit")}
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </Reveal>
      </header>

      {/* Visuel principal */}
      {caseStudy.imageUrl && (
        <Reveal className="max-w-4xl mx-auto px-6 pb-12">
          <div className="relative aspect-video rounded-2xl border border-ink/10 overflow-hidden shadow-[0_24px_80px_-32px_rgba(0,0,255,0.25)]">
            <Image
              src={caseStudy.imageUrl}
              alt={t(`caseStudies.${slug}.title`)}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      {/* Sections narratives */}
      <main className="max-w-3xl mx-auto px-6 pb-16 md:pb-24">
        <div className="flex flex-col gap-10 md:gap-14">
          {SECTIONS.map((section, index) => (
            <Reveal key={section} delay={index === 0 ? 0 : 0.08}>
              <section className="rounded-2xl border border-ink/10 bg-white p-7 md:p-9">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-blue mb-4">
                  ({String(index + 1).padStart(2, "0")}) —{" "}
                  {t(`caseStudies.sections.${section}`)}
                </h2>
                <p className="font-studio text-[15px] md:text-base text-ink/75 leading-relaxed">
                  {t(`caseStudies.${slug}.${section}`)}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </main>

      {/* Étude suivante + mini-CTA */}
      <footer className="max-w-4xl mx-auto px-6 pb-16 md:pb-24">
        <Reveal>
          <Link
            href={`/work/${nextCaseStudy.slug}`}
            onClick={() => playClick()}
            className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-7 py-8 md:px-10 transition-all duration-300 hover:border-blue/30 hover:shadow-[0_12px_48px_-16px_rgba(0,0,255,0.18)]"
          >
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40 mb-2">
                {t("caseStudies.next")}
              </p>
              <p className="font-studio font-semibold text-2xl md:text-3xl text-ink lowercase tracking-[-0.02em] group-hover:text-blue transition-colors duration-300">
                {t(`caseStudies.${nextCaseStudy.slug}.title`)}
              </p>
            </div>
            <ArrowRight
              size={22}
              className="text-ink/30 transition-all duration-300 group-hover:text-blue group-hover:translate-x-1"
            />
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <p className="font-serif italic text-lg text-ink/55">
              {t("caseStudies.miniCta")}
            </p>
            <Link
              href="/services#contact"
              onClick={() => playClick()}
              className="rounded-full bg-blue text-white font-studio text-sm font-semibold px-6 py-3 hover:bg-ink transition-colors duration-300"
            >
              {t("studio.cta.button")}
            </Link>
          </div>
        </Reveal>
      </footer>

      {/* Texture grain globale */}
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
