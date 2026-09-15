"use client";

import { memo, useEffect, useRef } from "react";

interface InViewProps {
  children?: React.ReactNode;
  /** Classe de base (ex. "studio-mist", "studio-rule") ; ".in" est ajouté au premier passage. */
  className: string;
  as?: "div" | "span";
  delay?: number;
  style?: React.CSSProperties;
}

// Observateur générique : pose ".in" sur l'élément au premier passage dans le
// viewport. Même mécanique que Reveal, mais la classe animée est libre
// (brume, filet qui se trace, croix du viseur…) — voir globals.css.
const InView = memo(({ children, className, as = "div", delay = 0, style }: InViewProps) => {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);

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
      { rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...(delay ? { "--reveal-delay": `${delay}s` } : {}), ...style } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
});

InView.displayName = "InView";

export default InView;
