"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { useSound } from "@/hooks/useSound";

interface HeroPillProps {
  href: string;
  label: string;
  /** "primary" : pilule encre ; "glass" : pilule verre dépoli. */
  variant: "primary" | "glass";
  /** Flèche de fin : → (aller) ou ↓ (descendre). */
  arrow: "right" | "down";
}

const NBSP = "\u00a0";

const VARIANT_CLASSES = {
  primary: "bg-ink text-white shadow-[0_10px_30px_-10px_rgba(5,5,20,0.5)]",
  glass:
    // verre dépoli sur desktop ; sur téléphone un voile blanc un peu plus
    // dense sans backdrop-filter (trop coûteux quand le hero s'efface)
    "bg-white/45 md:bg-white/25 md:backdrop-blur-xl border border-white/50 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_-14px_rgba(5,5,20,0.3)]",
};

// Pilules du hero (design validé, inchangé au repos). Au survol : la couleur
// se répand depuis le point d'entrée du curseur et se retire vers son point de
// sortie (.hero-pill-fill), et un flou gaussien traverse le libellé puis la
// flèche, lettre par lettre, sans qu'elles bougent (.hero-pill-char ; le
// roulement des lettres a été refusé). Styles : « Pilules du hero » dans
// globals.css.
export default function HeroPill({ href, label, variant, arrow }: HeroPillProps) {
  const { playClick } = useSound();

  // Le remplissage part de là où le curseur entre, et repart par là où il sort.
  const setOrigin = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--py", `${e.clientY - rect.top}px`);
  };

  return (
    <Link
      href={href}
      onClick={() => playClick()}
      onMouseEnter={setOrigin}
      onMouseLeave={setOrigin}
      className={`hero-pill hero-pill-${variant} group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full font-mn-sans text-[15px] font-medium px-8 py-4 ${VARIANT_CLASSES[variant]}`}
    >
      <span aria-hidden="true" className="hero-pill-fill" />
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(label).map((char, i) => (
          <span key={i} className="hero-pill-char" style={{ "--i": i } as React.CSSProperties}>
            {char === " " ? NBSP : char}
          </span>
        ))}
      </span>
      <span
        aria-hidden="true"
        className="hero-pill-char"
        style={{ "--i": Array.from(label).length + 1 } as React.CSSProperties}
      >
        {arrow === "right" ? "→" : "↓"}
      </span>
    </Link>
  );
}
