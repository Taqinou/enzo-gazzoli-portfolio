"use client";

import { memo, useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the reveal starts (seconds) */
  delay?: number;
  /** "fade" = blur+fade+y ; "mask" = la ligne monte de sous sa boîte */
  variant?: "fade" | "mask";
}

// Reveal CSS pur (keyframes + IntersectionObserver) pour l'aile studio.
// Remplace BlurFade ici : les animations framer-motion au mount/inView
// restent figées dans cet environnement (React 19 + hydratation différée du
// LanguageProvider) — le CSS, lui, est garanti. Voir .studio-reveal et
// .studio-mask dans globals.css ; respecte prefers-reduced-motion côté CSS.
const Reveal = memo(({ children, className, delay = 0, variant = "fade" }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variant === "mask" ? "studio-mask" : "studio-reveal"} ${className ?? ""}`}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
});

Reveal.displayName = "Reveal";

export default Reveal;
