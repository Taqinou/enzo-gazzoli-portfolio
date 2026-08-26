// Grille tarifaire de /services et sélecteur d'offre.
//
// Forfaits value-based : un prix par formule, indépendant du temps passé.
// Il n'y a pas d'options facturées à l'unité : tout ce qui est listé dans
// `includes` fait partie du forfait, sans ligne de prix en face.

export type ProjectType = "website" | "application" | "shopify" | "ai";

/** Formule d'une offre qui en propose plusieurs (aujourd'hui : `website`). */
export interface Formula {
  id: string;
  name: string;
  nameEn: string;
  price: number; // Forfait en € HT
  scope: string; // Périmètre de la formule, en une ligne
  scopeEn: string;
}

/** Élément compris dans le forfait. Jamais de prix : c'est inclus. */
export interface IncludedItem {
  id: string;
  name: string;
  nameEn: string;
}

export interface ProjectData {
  id: ProjectType;
  icon: string;
  fromPrice: number; // Plancher affiché ("à partir de"), en € HT
  formulas: Formula[]; // Vide = offre globale, chiffrée au devis
  includes: IncludedItem[];
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
        scope: "une seule page",
        scopeEn: "single page",
      },
      {
        id: "vitrine",
        name: "Site Vitrine",
        nameEn: "Business Website",
        price: 3500,
        scope: "accueil, offre, à propos, contact",
        scopeEn: "home, offer, about, contact",
      },
    ],
    includes: [
      { id: "code", name: "Pages développées de zéro", nameEn: "Pages built from scratch" },
      {
        id: "seo",
        name: "Référencement technique (balises, sitemap, données structurées)",
        nameEn: "Technical SEO (meta tags, sitemap, structured data)",
      },
      { id: "form", name: "Formulaire de contact avec anti-spam", nameEn: "Contact form with spam protection" },
      { id: "analytics", name: "Mesure d'audience conforme RGPD", nameEn: "GDPR-compliant audience tracking" },
      { id: "responsive", name: "Affichage mobile, tablette et grand écran", nameEn: "Mobile, tablet and wide-screen layouts" },
      { id: "deploy", name: "Mise en ligne et nom de domaine", nameEn: "Deployment and domain setup" },
    ],
  },
  application: {
    id: "application",
    icon: "Zap",
    fromPrice: 6000,
    formulas: [],
    includes: [
      { id: "auth", name: "Comptes et droits d'accès par rôle", nameEn: "Accounts and role-based access" },
      { id: "db", name: "Base de données et sauvegardes", nameEn: "Database and backups" },
      { id: "search", name: "Recherche et filtres sur vos données", nameEn: "Search and filters across your data" },
      { id: "export", name: "Exports CSV et Excel", nameEn: "CSV and Excel exports" },
      { id: "history", name: "Historique des modifications", nameEn: "Change history" },
      { id: "deploy", name: "Mise en ligne et hébergement", nameEn: "Deployment and hosting" },
    ],
  },
  shopify: {
    id: "shopify",
    icon: "ShoppingBag",
    fromPrice: 7000,
    formulas: [],
    includes: [
      { id: "storefront", name: "Boutique développée de zéro, connectée à Shopify", nameEn: "Storefront built from scratch, connected to Shopify" },
      { id: "catalog", name: "Catalogue, fiches produit et pages collection", nameEn: "Catalog, product pages and collection pages" },
      { id: "checkout", name: "Panier et paiement gérés par Shopify", nameEn: "Cart and checkout handled by Shopify" },
      { id: "search", name: "Recherche et filtres produits", nameEn: "Product search and filters" },
      { id: "seo", name: "Référencement technique des pages produit", nameEn: "Technical SEO on product pages" },
      { id: "analytics", name: "Mesure d'audience conforme RGPD", nameEn: "GDPR-compliant audience tracking" },
    ],
  },
  ai: {
    id: "ai",
    icon: "Sparkles",
    fromPrice: 1500,
    formulas: [],
    includes: [
      { id: "extract", name: "Lecture et extraction de documents (PDF, scans, tableurs)", nameEn: "Document reading and extraction (PDF, scans, spreadsheets)" },
      { id: "rag", name: "Recherche sémantique sur vos données (RAG)", nameEn: "Semantic search over your data (RAG)" },
      { id: "agents", name: "Agents connectés à vos outils via MCP", nameEn: "Agents connected to your tools via MCP" },
      { id: "scoring", name: "Scoring et classement automatiques", nameEn: "Automated scoring and ranking" },
      { id: "plug", name: "Branchement sur votre application existante", nameEn: "Wired into your existing application" },
      { id: "cost", name: "Suivi des appels de modèle et de leur coût", nameEn: "Model call and cost monitoring" },
    ],
  },
};

/** Maintenance récurrente, en € HT par mois. */
export const maintenance = {
  site: 90,
  app: 250,
} as const;
