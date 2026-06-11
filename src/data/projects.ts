export interface Project {
  index: string;
  title: string; // Used for project identification and fallback
  // description: string; // Deprecated: content is loaded from translations
  stack: string;
  linkText: string;
  linkUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export const projects: Project[] = [
  {
    index: "01",
    title: "sneakerscope",
    stack: "Next.js / FastAPI / PostgreSQL / Redis / Gemini AI / Recharts",
    linkText: "visiter",
  },
  {
    index: "02",
    title: "7eyes",
    stack: "Next.js / React / Framer Motion / Tailwind",
    linkText: "visiter",
    linkUrl: "https://7eyes-website-eight.vercel.app",
    imageUrl: "/images/projects/02-7eyes.webp",
  },
  {
    index: "03",
    title: "lumiere de soso shop",
    stack: "Next.js / React / Framer Motion / TypeScript / Shopify API",
    linkText: "visiter",
    linkUrl: "https://boutique.lumieredesoso.fr",
    imageUrl: "/images/projects/03-lumiere-de-soso.webp",
  },
  {
    index: "04",
    title: "portfolio web",
    stack: "Next.js / React / Framer Motion / Web Audio API",
    linkText: "visiter",
    linkUrl: "https://enzo-gazzoli.com",
    githubUrl: "https://github.com/Taqinou/enzo-gazzoli-portfolio",
    imageUrl: "/images/projects/04-portfolio-web.webp",
  },
  {
    index: "05",
    title: "TH14",
    stack: "Next.js / React / Framer Motion / GSAP / Tailwind",
    linkText: "visiter",
    linkUrl: "https://th-14.vercel.app/",
    githubUrl: "https://github.com/Taqinou/TH-14-PROJECT",
    imageUrl: "/images/projects/05-th14.webp",
  },
  {
    index: "06",
    title: "off screen",
    stack: "Next.js / React / Framer Motion / Tailwind",
    linkText: "visiter",
    linkUrl: "https://off-screen.vercel.app/",
    githubUrl: "https://github.com/Taqinou/off-screen-project",
  },
  {
    index: "07",
    title: "apartment aggregator",
    stack: "Next.js / MongoDB / React Leaflet / NextAuth / Zod",
    linkText: "github",
    linkUrl: "https://github.com/Toto028-GT/ProjetTechno-Web",
    imageUrl: "/images/projects/07-apartment-aggregator.png",
  },
  {
    index: "08",
    title: "functional calendar",
    stack: "Node.js / Express / MongoDB / JWT / Jest",
    linkText: "github",
    linkUrl: "https://github.com/JusteHugoStudent/ACL-2025-OpenForWork",
    imageUrl: "/images/projects/08-functional-calendar.png",
  },
];

export const archiveItems = projects.map((p) => ({
  index: parseInt(p.index),
  label: `${p.index} ${p.title.toLowerCase()}.`,
}));
