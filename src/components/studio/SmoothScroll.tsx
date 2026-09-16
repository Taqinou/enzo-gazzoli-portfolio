"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { homeScroll } from "@/lib/homeScroll";

// useLayoutEffect côté client (avant paint → pas de flash haut-de-page au
// retour), useEffect en repli SSR pour éviter l'avertissement.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Rechargement de page : on restaure nous-mêmes la position, AVANT le premier
// affichage du contenu. Laissée au navigateur, la restauration arrivait après
// coup : le haut de page (l'image du hero) apparaissait un instant, puis la
// page sautait à l'ancienne position.
const SCROLL_KEY = "studio-scroll:";
let reloadHandled = false;

function reloadedScroll(pathname: string): number | null {
  if (reloadHandled) return null;
  reloadHandled = true;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== "reload") return null;
    const saved = sessionStorage.getItem(SCROLL_KEY + pathname);
    return saved == null ? null : Number(saved);
  } catch {
    return null;
  }
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Smooth scroll (Lenis) scopé à l'aile studio : le « feel » cinématographique
// des sites de référence (Cursor, Devin…). Ne touche pas à l'archive (qui a
// son propre conteneur scroll-snap) ; respecte prefers-reduced-motion.
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const positionedPathRef = useRef<string | null>(null);

  // la position est enregistrée en quittant la page, restaurée au rechargement
  useEffect(() => {
    try {
      history.scrollRestoration = "manual";
    } catch {}
    const save = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY + window.location.pathname, String(window.scrollY));
      } catch {}
    };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // proche out-expo
      // Ancres #… (onglets de nav) : défilement doux, décalé de la hauteur de
      // la nav fixe (Lenis n'applique pas le scroll-margin CSS).
      anchors: { offset: -90 },
    });
    lenisRef.current = lenis;

    let rafId: number;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Positionne le scroll au montage / changement de page (avant paint) : haut
  // de page par défaut, OU la position mémorisée au retour sur la home après une
  // étude de cas (bouton « studio. »). window.scrollTo AVANT l'init de Lenis →
  // démarrage à la bonne position, sans flash ; ET recalage de Lenis (qui garde
  // son propre état, sinon il rembobine à l'ancienne position).
  //
  // On compare le PATHNAME (pas un booléen) : le StrictMode (dev) réinvoque
  // l'effet avec le même pathname → on ne repositionne qu'une fois par page ;
  // mais un vrai changement (étude → étude suivante, même route [slug] sans
  // remontage) doit bien repositionner en haut.
  useIsoLayoutEffect(() => {
    if (positionedPathRef.current === pathname) return;
    positionedPathRef.current = pathname;
    if (window.location.hash) return; // ancre explicite (#contact…) → on laisse

    const reloaded = reloadedScroll(pathname);
    const target =
      reloaded != null ? reloaded : pathname === "/" && homeScroll.y != null ? homeScroll.y : 0;
    if (pathname === "/") homeScroll.y = null; // consommé UNIQUEMENT sur la home

    const apply = () => {
      window.scrollTo(0, target);
      lenisRef.current?.scrollTo(target, { immediate: true, force: true });
    };
    apply();
    // recalage après layout (page longue / Lenis initialisé après le paint).
    requestAnimationFrame(apply);
  }, [pathname]);

  return children;
}
