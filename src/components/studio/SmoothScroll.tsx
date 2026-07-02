"use client";

import { useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Smooth scroll (Lenis) scopé à l'aile studio : le « feel » cinématographique
// des sites de référence (Cursor, Devin…). Ne touche pas à l'archive (qui a
// son propre conteneur scroll-snap) ; respecte prefers-reduced-motion.
export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // proche out-expo
      anchors: true,
    });

    let rafId: number;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
