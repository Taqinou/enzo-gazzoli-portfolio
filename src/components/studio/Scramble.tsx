"use client";

import { memo, useEffect, useRef, useState } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789/|—";

interface ScrambleProps {
  text: string;
  className?: string;
}

// Text-scramble « terminal » sur les micro-labels mono : au premier passage
// dans le viewport, les caractères défilent aléatoirement puis se fixent de
// gauche à droite. Raccord avec le sound design SFX du site. Respecte
// prefers-reduced-motion (texte affiché directement).
const Scramble = memo(({ text, className }: ScrambleProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          let frame = 0;
          const totalFrames = text.length * 2 + 8;
          interval = setInterval(() => {
            frame += 1;
            const fixed = Math.floor((frame / totalFrames) * text.length);
            const next = text
              .split("")
              .map((char, i) => {
                if (char === " " || i < fixed) return char;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join("");
            setDisplay(next);
            if (frame >= totalFrames) {
              clearInterval(interval);
              setDisplay(text);
            }
          }, 28);
        });
      },
      { rootMargin: "-50px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
});

Scramble.displayName = "Scramble";

export default Scramble;
