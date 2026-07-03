// Études de cas de l'aile studio (home / et routes /work/[slug]).
// Volontairement séparé de projects.ts : projects pilote la SPA /archive
// (folio), caseStudies pilote la narration business (studio). Les contenus
// rédigés (context, problem, approach, results) vivent dans les translations
// sous caseStudies.<slug>.*.
export interface CaseStudy {
  slug: string;
  /** Référence croisée vers projects.ts (affichage du numéro d'archive) */
  projectIndex: string;
  year: string;
  stack: string[];
  liveUrl?: string;
  /** Absente → la carte affiche une cover typographique de fallback */
  imageUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "sneakerscope",
    projectIndex: "01",
    year: "2026",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Gemini AI", "Recharts"],
  },
  {
    slug: "7eyes",
    projectIndex: "02",
    year: "2026",
    stack: ["Next.js", "React", "Framer Motion", "Tailwind"],
    liveUrl: "https://7eyes-website-eight.vercel.app",
    imageUrl: "/images/projects/02-7eyes.webp",
  },
  {
    slug: "lumiere-de-soso",
    projectIndex: "03",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Framer Motion", "Shopify API"],
    liveUrl: "https://boutique.lumieredesoso.fr",
    imageUrl: "/images/projects/03-lumiere-de-soso.webp",
  },
  {
    // Ce site : la vitrine studio (refonte folio → studio). Pas d'imageUrl →
    // cover bleue (le screenshot 04-portfolio-web est l'ancien folio, trompeur ;
    // à remplacer par une capture du studio quand dispo).
    slug: "studio",
    projectIndex: "04",
    year: "2026",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Lenis"],
    liveUrl: "https://enzo-gazzoli.com",
  },
  {
    slug: "th14",
    projectIndex: "05",
    year: "2026",
    stack: ["Next.js", "React", "GSAP", "Framer Motion", "Tailwind"],
    liveUrl: "https://th-14.vercel.app/",
    imageUrl: "/images/projects/05-th14.webp",
  },
  {
    // pas d'imageUrl → cover bleue typographique (comme sneakerscope)
    slug: "off-screen",
    projectIndex: "06",
    year: "2026",
    stack: ["Next.js", "React", "Framer Motion", "Tailwind"],
    liveUrl: "https://off-screen.vercel.app/",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

/** Étude suivante (rotation circulaire) pour le pied de page des pages /work */
export function getNextCaseStudy(slug: string): CaseStudy {
  const index = caseStudies.findIndex((cs) => cs.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
}
