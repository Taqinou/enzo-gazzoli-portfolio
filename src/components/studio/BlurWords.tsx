"use client";

import { memo, useEffect, useRef } from "react";

interface BlurWordsProps {
  text: string;
  className?: string;
  /** Delay before the first word starts (seconds) */
  baseDelay?: number;
  /** Delay between words (seconds) */
  step?: number;
  /** Classe appliquée au seul dernier mot (accent couleur ponctuel) */
  lastWordClassName?: string;
}

// Défloutage progressif mot à mot : chaque mot porte son propre
// animation-delay, la vague se propage de gauche à droite au premier
// passage dans le viewport. CSS pur (voir .studio-blurwords dans
// globals.css), respecte prefers-reduced-motion via la media query globale.
const BlurWords = memo(
  ({ text, className, baseDelay = 0, step = 0.07, lastWordClassName }: BlurWordsProps) => {
    const ref = useRef<HTMLSpanElement>(null);

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

    const words = text.split(" ");

    return (
      <span ref={ref} className={`studio-blurwords ${className ?? ""}`}>
        {words.map((word, i) => (
          <span key={i}>
            <span
              className={`studio-word ${
                lastWordClassName && i === words.length - 1 ? lastWordClassName : ""
              }`}
              style={{ "--word-delay": `${baseDelay + i * step}s` } as React.CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }
);

BlurWords.displayName = "BlurWords";

export default BlurWords;
