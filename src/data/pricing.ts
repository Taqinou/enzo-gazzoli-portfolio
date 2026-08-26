// Grille tarifaire de /services et sélecteur d'offre.
//
// Forfaits value-based : un prix par formule, indépendant du temps passé, et
// pas d'option facturée à l'unité. La grille n'affiche qu'un plancher par
// offre ; le périmètre se discute au devis.

export type ProjectType = "website" | "application" | "shopify" | "ai";

/** Formule d'une offre qui en propose plusieurs (aujourd'hui : `website`). */
export interface Formula {
  id: string;
  name: string;
  nameEn: string;
  price: number; // Forfait en € HT
}

export interface ProjectData {
  id: ProjectType;
  icon: string;
  fromPrice: number; // Plancher affiché ("à partir de"), en € HT
  formulas: Formula[]; // Vide = offre globale, chiffrée au devis
}

export const projects: Record<ProjectType, ProjectData> = {
  website: {
    id: "website",
    icon: "Globe",
    fromPrice: 1200,
    formulas: [
      {
        id: "landing",
        name: "Landing Page",
        nameEn: "Landing Page",
        price: 1200,
      },
      {
        id: "vitrine",
        name: "Site Vitrine",
        nameEn: "Business Website",
        price: 3500,
      },
    ],
  },
  application: {
    id: "application",
    icon: "Zap",
    fromPrice: 6000,
    formulas: [],
  },
  shopify: {
    id: "shopify",
    icon: "ShoppingBag",
    fromPrice: 7000,
    formulas: [],
  },
  ai: {
    id: "ai",
    icon: "Sparkles",
    fromPrice: 1500,
    formulas: [],
  },
};
