// Pricing data for quote simulator
// Simplified from the full devis-generator for a cleaner UX

export type ProjectType = "website" | "application" | "shopify" | "custom";

export interface SubType {
  id: string;
  name: string;
  nameEn: string;
  price: number; // Forfait de base en € (HT)
  days: number; // Délai indicatif (n'impacte plus le prix)
  duration: string;
  durationEn: string;
  includes: string[];
}

export interface PricingOption {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: OptionCategory;
}

export type OptionCategory = "tech" | "marketing" | "design" | "support";

export interface ProjectData {
  id: ProjectType;
  icon: string;
  fromPrice: number | null; // Plancher affiché ("à partir de") — null = "sur devis"
  priceMax: number | null; // Si défini : affiche une fourchette (fromPrice – priceMax) au lieu des sous-formules
  subtypes: SubType[];
}

// Project types with their subtypes
// Forfaits value-based : prix défini par formule, indépendant du temps passé.
export const projects: Record<ProjectType, ProjectData> = {
  website: {
    id: "website",
    icon: "Globe",
    fromPrice: 2500,
    priceMax: null,
    subtypes: [
      {
        id: "landing",
        name: "Landing Page",
        nameEn: "Landing Page",
        price: 2500,
        days: 7,
        duration: "1-2 semaines",
        durationEn: "1-2 weeks",
        includes: ["seo", "form", "analytics"],
      },
      {
        id: "portfolio",
        name: "Portfolio Créatif",
        nameEn: "Creative Portfolio",
        price: 3500,
        days: 12,
        duration: "2-3 semaines",
        durationEn: "2-3 weeks",
        includes: ["seo", "form", "analytics", "animations"],
      },
      {
        id: "corporate",
        name: "Site Vitrine",
        nameEn: "Business Website",
        price: 5000,
        days: 17,
        duration: "3-4 semaines",
        durationEn: "3-4 weeks",
        includes: ["seo", "form", "analytics", "animations", "multilang"],
      },
    ],
  },
  application: {
    id: "application",
    icon: "Zap",
    fromPrice: 7500,
    priceMax: 20000,
    subtypes: [
      {
        id: "mvp",
        name: "MVP",
        nameEn: "MVP",
        price: 7500,
        days: 25,
        duration: "4-6 semaines",
        durationEn: "4-6 weeks",
        includes: ["seo", "form", "auth", "analytics"],
      },
      {
        id: "saas",
        name: "SaaS Complet",
        nameEn: "Full SaaS",
        price: 15000,
        days: 50,
        duration: "8-12 semaines",
        durationEn: "8-12 weeks",
        includes: ["seo", "form", "auth", "analytics", "stripe", "emails"],
      },
      {
        id: "dashboard",
        name: "Dashboard Métier",
        nameEn: "Business Dashboard",
        price: 10500,
        days: 35,
        duration: "6-8 semaines",
        durationEn: "6-8 weeks",
        includes: ["seo", "form", "auth", "analytics"],
      },
    ],
  },
  custom: {
    id: "custom",
    icon: "Wrench",
    fromPrice: null,
    priceMax: null,
    subtypes: [
      {
        id: "audit",
        name: "Audit Technique",
        nameEn: "Technical Audit",
        price: 1200,
        days: 4,
        duration: "3-5 jours",
        durationEn: "3-5 days",
        includes: [],
      },
      {
        id: "dev",
        name: "Mission ponctuelle",
        nameEn: "One-off Task",
        price: 500,
        days: 1,
        duration: "à définir",
        durationEn: "to be defined",
        includes: [],
      },
    ],
  },
  shopify: {
    id: "shopify",
    icon: "ShoppingBag",
    fromPrice: 9000,
    priceMax: 25000,
    subtypes: [
      {
        id: "headless",
        name: "Boutique Headless",
        nameEn: "Headless Store",
        price: 9000,
        days: 30,
        duration: "5-7 semaines",
        durationEn: "5-7 weeks",
        includes: ["seo", "analytics", "stripe", "animations"],
      },
    ],
  },
};

// Options additionnelles (forfait fixe par option)
export const options: PricingOption[] = [
  { 
    id: "auth", 
    name: "Authentification", 
    nameEn: "Authentication", 
    description: "Inscription, connexion, mot de passe oublié et protection des routes privées.",
    descriptionEn: "Sign up, login, forgot password flows and protected private routes.",
    price: 300, 
    category: "tech" 
  },
  { 
    id: "stripe", 
    name: "Paiement Stripe", 
    nameEn: "Stripe Payment", 
    description: "Intégration complète : paiement par carte sécurisé et reçus automatiques.",
    descriptionEn: "Full integration: secure card payments and automatic receipts.",
    price: 250, 
    category: "tech" 
  },
  { 
    id: "cms", 
    name: "CMS (Strapi/Sanity)", 
    nameEn: "CMS (Strapi/Sanity)", 
    description: "Interface d'administration pour gérer vos textes et images en autonomie.",
    descriptionEn: "Admin dashboard to manage your text and images independently.",
    price: 300, 
    category: "tech" 
  },
  { 
    id: "multilang", 
    name: "Multilingue", 
    nameEn: "Multilingual", 
    description: "Site disponible en plusieurs langues avec détection automatique.",
    descriptionEn: "Website available in multiple languages with automatic detection.",
    price: 150, 
    category: "tech" 
  },
  { 
    id: "form", 
    name: "Formulaire avancé", 
    nameEn: "Advanced Form", 
    description: "Validation des données en temps réel, protection anti-spam et notifications.",
    descriptionEn: "Real-time data validation, anti-spam protection and email notifications.",
    price: 100, 
    category: "tech" 
  },
  { 
    id: "emails", 
    name: "Emails transactionnels", 
    nameEn: "Transactional Emails", 
    description: "Templates d'emails HTML personnalisés à votre image de marque.",
    descriptionEn: "Custom HTML email templates matching your brand identity.",
    price: 200, 
    category: "tech" 
  },
  { 
    id: "seo", 
    name: "SEO technique", 
    nameEn: "Technical SEO", 
    description: "Optimisation complète pour Google : balises méta, sitemap et performance.",
    descriptionEn: "Full Google optimization: meta tags, sitemap and performance.",
    price: 150, 
    category: "marketing" 
  },
  { 
    id: "analytics", 
    name: "Analytics", 
    nameEn: "Analytics", 
    description: "Suivi d'audience respectueux de la vie privée (conforme RGPD).",
    descriptionEn: "Privacy-friendly audience tracking (GDPR compliant).",
    price: 75, 
    category: "marketing" 
  },
  { 
    id: "newsletter", 
    name: "Newsletter", 
    nameEn: "Newsletter", 
    description: "Formulaire d'inscription connecté à votre outil marketing préféré.",
    descriptionEn: "Signup form connected to your favorite marketing tool.",
    price: 150, 
    category: "marketing" 
  },
  { 
    id: "animations", 
    name: "Animations avancées", 
    nameEn: "Advanced Animations", 
    description: "Expérience immersive : transitions fluides et micro-interactions soignées.",
    descriptionEn: "Immersive experience: smooth transitions and polished micro-interactions.",
    price: 200, 
    category: "design" 
  },
  { 
    id: "darkmode", 
    name: "Dark mode", 
    nameEn: "Dark Mode", 
    description: "Thème sombre/clair alternable qui respecte les préférences utilisateur.",
    descriptionEn: "Toggleable dark/light theme respecting user preferences.",
    price: 150, 
    category: "design" 
  },
  { 
    id: "maintenance", 
    name: "Maintenance 3 mois", 
    nameEn: "3-Month Maintenance", 
    description: "Garantie de fonctionnement, mises à jour de sécurité et corrections.",
    descriptionEn: "Uptime guarantee, security updates and bug fixes.",
    price: 600, 
    category: "support" 
  },
];

// Category metadata for accordion display
export const categoryMeta: Record<OptionCategory, { label: string; labelEn: string; icon: string }> = {
  tech: { label: "Technique", labelEn: "Technical", icon: "Code2" },
  marketing: { label: "Marketing", labelEn: "Marketing", icon: "TrendingUp" },
  design: { label: "Design", labelEn: "Design", icon: "Palette" },
  support: { label: "Support", labelEn: "Support", icon: "Wrench" },
};

// Helper to get options by category
export function getOptionsByCategory(category: OptionCategory): PricingOption[] {
  return options.filter((opt) => opt.category === category);
}

// Helper to calculate total price
export function calculateTotal(
  projectType: ProjectType,
  subTypeId: string,
  selectedOptions: Set<string>
): number {
  const project = projects[projectType];
  const subType = project.subtypes.find((s) => s.id === subTypeId) || project.subtypes[0];

  let total = subType.price;

  // Add selected options (excluding those already included)
  const includedSet = new Set(subType.includes);

  options.forEach((opt) => {
    if (selectedOptions.has(opt.id) && !includedSet.has(opt.id)) {
      total += opt.price;
    }
  });

  return total;
}

// Helper to get included options for a subtype
export function getIncludedOptions(projectType: ProjectType, subTypeId: string): Set<string> {
  const project = projects[projectType];
  const subType = project.subtypes.find((s) => s.id === subTypeId) || project.subtypes[0];
  return new Set(subType.includes);
}
