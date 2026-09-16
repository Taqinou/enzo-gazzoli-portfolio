"use client";

import { useEffect, type RefObject } from "react";

interface HeroSceneRefs {
  section: RefObject<HTMLElement | null>;
  sky: RefObject<HTMLDivElement | null>;
  title: RefObject<HTMLHeadingElement | null>;
  veil: RefObject<HTMLDivElement | null>;
  cta: RefObject<HTMLDivElement | null>;
  whiteout: RefObject<HTMLDivElement | null>;
}

// Hauteur de la zone de la nav fixe (px).
const NAV_ZONE = 90;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// Portion [from, to] de la progression, ramenée à 0 → 1 et adoucie.
const span = (p: number, from: number, to: number) => {
  const t = clamp01((p - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/**
 * Pilote la sortie du hero studio au scroll, hors React (aucun re-render) : la
 * caméra monte dans les nuages, le titre s'efface dans la brume, l'écran
 * blanchit. Gère aussi la couleur de la nav tant que le ciel passe dessous.
 * Branché sur l'événement scroll natif, que Lenis émet à chaque frame. Sous
 * prefers-reduced-motion, seule la nav est gérée.
 */
export function useHeroScene({ section, sky, title, veil, cta, whiteout }: HeroSceneRefs) {
  useEffect(() => {
    const sectionEl = section.current;
    if (!sectionEl) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastProgress = -1;
    // Téléphone : pose plus courte (cf. StudioHero), ni flou animé ni gros
    // zoom du ciel, trop lourds pour un mobile et qui saccadaient.
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let mobile = mobileQuery.matches;
    let navOnHero: boolean | null = null;

    const setNavOnHero = (value: boolean) => {
      if (value === navOnHero) return;
      navOnHero = value;
      // Bascule sans transition : sinon, en repassant en mix-blend-difference,
      // les libellés clignoteraient le temps du fondu de couleur.
      root.classList.add("studio-nav-instant");
      root.classList.toggle("studio-on-hero", value);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => root.classList.remove("studio-nav-instant"))
      );
    };

    const render = () => {
      const rect = sectionEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = rect.height - vh;
      const p = range > 0 ? clamp01(-rect.top / range) : 0;
      // Le blanc s'achève en fin de pose, quand le titre de l'offre (qui monte
      // depuis le pli) arrive sous la nav : le ciel reste derrière lui pendant
      // toute sa montée. Fini plus tôt, il laissait un écran blanc vide
      // au-dessus de l'offre.
      const white = mobile ? span(p, 0.3, 1) : span(p, 0.45, 1);

      // Le bas du hero est crème : le ciel ne passe plus sous la nav une fois
      // qu'il reste moins de ~14 % de hero à l'écran, ou que l'écran a blanchi.
      setNavOnHero(rect.bottom > vh * 0.14 + NAV_ZONE && white < 0.8);
      if (reducedMotion || p === lastProgress) return;
      lastProgress = p;

      const rise = span(p, 0, 1);
      // Le titre se dissout pendant que celui de l'offre entre par le bas.
      // Distances en hauteurs d'écran scrollées, identiques quelle que soit la
      // longueur de la pose (desktop ou mobile).
      const scrolled = -rect.top / vh;
      const fade = span(scrolled, 0.01, 0.17);
      const ctaFade = span(scrolled, 0, 0.07);

      if (sky.current) {
        sky.current.style.transform = mobile
          ? `scale(${1 + rise * 0.08})`
          : `translate3d(0, ${rise * vh * 0.04}px, 0) scale(${1 + rise * 0.28})`;
      }
      if (mobile) {
        // Téléphone : le titre et les boutons ne suivent pas le doigt image
        // par image (saccadé sur mobile) ; passé un seuil, une classe lance
        // une transition CSS (opacité + translation, sur le compositeur), qui
        // se rembobine si on remonte (.studio-hero.is-leaving, globals.css).
        sectionEl.classList.toggle("is-leaving", scrolled > 0.03);
        for (const el of [title.current, cta.current]) {
          if (el) el.removeAttribute("style");
        }
      } else {
        sectionEl.classList.remove("is-leaving");
        if (title.current) {
          title.current.style.transform = `translate3d(0, ${-fade * vh * 0.06}px, 0) scale(${
            1 - fade * 0.08
          })`;
          title.current.style.opacity = String(1 - fade);
          title.current.style.filter = fade > 0 ? `blur(${fade * 10}px)` : "none";
        }
        if (cta.current) {
          cta.current.style.transform = `translate3d(0, ${-ctaFade * 24}px, 0)`;
          cta.current.style.opacity = String(1 - ctaFade);
          cta.current.style.visibility = ctaFade >= 1 ? "hidden" : "";
        }
      }
      if (veil.current) {
        // Agrandie depuis son bord bas (origin-bottom), jamais translatée : la
        // nappe monte sur l'écran sans découvrir son bord inférieur.
        veil.current.style.transform = `scale(${1 + rise * (mobile ? 0.2 : 0.55)})`;
      }
      if (whiteout.current) {
        whiteout.current.style.opacity = String(white);
      }
    };

    const onResize = () => {
      mobile = mobileQuery.matches;
      lastProgress = -1;
      render();
    };

    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", onResize);
      root.classList.remove("studio-on-hero", "studio-nav-instant");
    };
  }, [section, sky, title, veil, cta, whiteout]);
}
