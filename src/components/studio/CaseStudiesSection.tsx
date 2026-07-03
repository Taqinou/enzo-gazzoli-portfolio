"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/studio/Reveal";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import { morphOrigin } from "@/lib/morphOrigin";
import { homeScroll } from "@/lib/homeScroll";

// Galerie « rideaux verticaux » : 4 panneaux-images côte à côte. Au repos on ne
// voit que l'image (+ numéro/titre discrets) ; au survol le panneau s'élargit
// et révèle les infos. Chaque image porte un `view-transition-name` unique →
// au clic, le navigateur morph l'image vers le hero de la page /work (View
// Transitions natives, activées dans next.config). Le repli sneakerscope est
// une cover bleue typographique.
export default function CaseStudiesSection() {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const router = useRouter();

  const title = (cs: CaseStudy) => t(`caseStudies.${cs.slug}.title`);
  const tagline = (cs: CaseStudy) => t(`caseStudies.${cs.slug}.tagline`);

  // Mémorise la position (viewport) de la vignette → le hero de /work s'anime
  // depuis là. Aucun clone : le vrai hero se déplie lui-même.
  const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>, cs: CaseStudy) => {
    e.preventDefault();
    playClick();
    // Mémorise la position de la home → restaurée au retour (bouton « studio. »).
    homeScroll.y = window.scrollY;
    const target = e.currentTarget.querySelector<HTMLElement>("[data-morph]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target && !reduce) {
      morphOrigin.rect = target.getBoundingClientRect();
      morphOrigin.slug = cs.slug;
    }
    router.push(`/work/${cs.slug}`);
  };

  // Miniatures : fond bleu + gros numéro AU CENTRE (pas de screenshots).
  const visual = (cs: CaseStudy) => (
    <div className="absolute inset-0 bg-blue overflow-hidden flex items-center justify-center">
      <span
        aria-hidden="true"
        className="font-mono font-black text-[6rem] md:text-[8rem] leading-none text-white select-none"
        style={{ opacity: 0.16 }}
      >
        {cs.projectIndex}
      </span>
    </div>
  );

  return (
    <section id="work" className="relative bg-bg text-ink px-6 md:px-20 py-20 md:py-32 scroll-mt-20">
      <Reveal>
        <p className="font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue mb-4">
          {t("studio.work.label")}
        </p>
        <h2 className="font-serif lowercase tracking-[-0.05em] leading-085 text-[11vw] md:text-[5vw] mb-4">
          {t("studio.work.heading")}
        </h2>
        <p className="font-serif italic text-lg md:text-xl text-ink/50 mb-12 md:mb-16 max-w-lg">
          {t("studio.work.lede")}
        </p>
      </Reveal>

      {/* Rideaux : pile verticale jusqu'à 1024px (mobile ET tablette — sinon 6
          panneaux à ~90px illisibles), panneaux extensibles seulement à lg+. */}
      <div className="flex flex-col lg:flex-row gap-3 lg:h-[74vh]">
        {caseStudies.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 0.06} className="lg:grow lg:basis-0 lg:hover:grow-[2.6] lg:transition-all lg:duration-700 lg:ease-out-expo lg:min-w-0">
            <Link
              href={`/work/${cs.slug}`}
              onClick={(e) => handleOpen(e, cs)}
              className="group relative flex h-64 lg:h-full w-full overflow-hidden rounded-2xl border border-ink/10 shadow-[0_30px_60px_-40px_rgba(5,5,20,0.5)]"
            >
              {/* image (cible du morph FLIP au clic) */}
              <div data-morph className="absolute inset-0">
                {visual(cs)}
              </div>

              {/* scrim bas pour lisibilité */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,20,0.72)_0%,rgba(5,5,20,0.15)_38%,transparent_60%)]"
              />

              {/* contenu — largeur du panneau (w-full) : le titre wrappe si
                  besoin (break-words) au lieu d'être coupé. Les infos hover sont
                  en display (md:hidden → md:group-hover:block) : masquées, elles
                  ne prennent aucune place → pas de reflow des panneaux voisins. */}
              <div className="relative z-10 mt-auto w-full p-5 md:p-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                  {cs.projectIndex} — {cs.year}
                </p>
                <h3 className="font-serif lowercase tracking-[-0.03em] text-white text-2xl leading-[1.1] break-words">
                  {title(cs)}.
                </h3>

                {/* infos révélées : visibles quand empilé (mobile + tablette),
                    masquées puis révélées au survol seulement en rideaux (lg+). */}
                <div className="max-w-md lg:hidden lg:group-hover:block">
                  <p className="font-serif italic text-white/85 text-base md:text-lg mt-3 leading-snug">
                    {tagline(cs)}
                  </p>
                  <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 mt-4">
                    {cs.stack.slice(0, 4).join(" / ")}
                  </p>
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-white mt-5">
                    {t("studio.work.viewCase")}
                    <span aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
