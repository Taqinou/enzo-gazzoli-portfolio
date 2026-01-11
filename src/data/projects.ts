export interface Project {
  index: string;
  title: string; // Used for project identification and fallback
  // description: string; // Deprecated: content is loaded from translations
  stack: string;
  linkText: string;
  linkUrl: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    index: "01",
    title: "lumiere de soso shop",
    stack: "Next.js / React / Framer Motion / TypeScript / Shopify API",
    linkText: "visiter",
    linkUrl: "https://boutique.lumieredesoso.fr",
  },
  {
    index: "02",
    title: "sneakerscope",
    stack: "Next.js / FastAPI / PostgreSQL / Redis / Gemini AI / Recharts",
    linkText: "visiter",
    linkUrl: "https://sneakerscope.app",
  },
  {
    index: "03",
    title: "portfolio web",
    stack: "Next.js / React 19 / Framer Motion / Web Audio API",
    linkText: "visiter",
    linkUrl: "https://enzo-gazzoli.com",
    githubUrl: "https://github.com/Taqinou/enzo-gazzoli-portfolio",
  },
  {
    index: "04",
    title: "apartment aggregator",
    stack: "Next.js / MongoDB / React Leaflet / NextAuth / Zod",
    linkText: "github",
    linkUrl: "https://github.com/Toto028-GT/ProjetTechno-Web",
  },
  {
    index: "05",
    title: "functional calendar",
    stack: "Node.js / Express / MongoDB / JWT / Jest",
    linkText: "github",
    linkUrl: "https://github.com/JusteHugoStudent/ACL-2025-OpenForWork",
  },
];

export const archiveItems = projects.map((p) => ({
  index: parseInt(p.index),
  label: `${p.index} ${p.title.toLowerCase()}.`,
}));
