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
    year: "2025",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Gemini AI", "Recharts"],
  },
  {
    slug: "7eyes",
    projectIndex: "02",
    year: "2025",
    stack: ["Next.js", "React", "Framer Motion", "Tailwind"],
    liveUrl: "https://7eyes-website-eight.vercel.app",
    imageUrl: "/images/projects/02-7eyes.webp",
  },
  {
    slug: "lumiere-de-soso",
    projectIndex: "03",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Framer Motion", "Shopify API"],
    liveUrl: "https://boutique.lumieredesoso.fr",
    imageUrl: "/images/projects/03-lumiere-de-soso.webp",
  },
  {
    slug: "th14",
    projectIndex: "05",
    year: "2025",
    stack: ["Next.js", "React", "GSAP", "Framer Motion", "Tailwind"],
    liveUrl: "https://th-14.vercel.app/",
    imageUrl: "/images/projects/05-th14.webp",
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
