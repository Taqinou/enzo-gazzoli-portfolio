export interface Project {
  index: string;
  title: string;
  description: string;
  stack: string;
  linkText: string;
  linkUrl: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    index: "01",
    title: "lumiere de soso shop",
    description:
      "une boutique e-commerce immersive pensée pour vendre autrement. architecture headless, panier fluide, paiement intégré.",
    stack: "Next.js / React / Framer Motion / TypeScript / Shopify API",
    linkText: "visiter",
    linkUrl: "https://boutique.lumieredesoso.fr",
  },
  {
    index: "02",
    title: "sneakerscope",
    description:
      "une plateforme analytique avancée dédiée au marché des sneakers. algorithme propriétaire, conseiller IA autonome, rapports en temps réel.",
    stack: "Next.js / FastAPI / PostgreSQL / Redis / Gemini AI / Recharts",
    linkText: "visiter",
    linkUrl: "https://sneakerscope.app",
  },
  {
    index: "03",
    title: "portfolio web",
    description:
      "une interface interactive pensée pour montrer. mouvement subtil, attente proactive, typographie brute.",
    stack: "Next.js / React 19 / Framer Motion / Web Audio API",
    linkText: "visiter",
    linkUrl: "https://enzo-gazzoli.com",
    githubUrl: "https://github.com/Taqinou/enzo-gazzoli-portfolio",
  },
  {
    index: "04",
    title: "apartment aggregator",
    description:
      "une plateforme d'agrégation immobilière. centralisation des annonces, comparaison simplifiée, recherche augmentée.",
    stack: "Next.js / MongoDB / React Leaflet / NextAuth / Zod",
    linkText: "github",
    linkUrl: "https://github.com/Toto028-GT/ProjetTechno-Web",
  },
  {
    index: "05",
    title: "functional calendar",
    description:
      "un outil de gestion temporelle. création intuitive d'événements, interface épurée, flux fluide.",
    stack: "Node.js / Express / MongoDB / JWT / Jest",
    linkText: "github",
    linkUrl: "https://github.com/JusteHugoStudent/ACL-2025-OpenForWork",
  },
];

export const archiveItems = projects.map((p) => ({
  index: parseInt(p.index),
  label: `${p.index} ${p.title.toLowerCase()}.`,
}));
