// Témoignages de la section preuve (home studio).
// RÈGLE D'HONNÊTETÉ : tant qu'un vrai retour client n'a pas été collecté,
// status reste "placeholder" et l'UI rend un cadre « témoignage en cours de
// collecte » — jamais une fausse citation. Passer à "verified" (et remplir
// studio.proof.quotes.<id> dans les translations) une fois le retour obtenu.
export interface Testimonial {
  id: string;
  /** Clé i18n de la citation (studio.proof.quotes.<id>) */
  quoteKey: string;
  /** Clé i18n de l'attribution (studio.proof.authors.<id>) */
  authorKey: string;
  projectSlug?: string;
  status: "placeholder" | "verified";
}

export const testimonials: Testimonial[] = [
  // Témoignage de Sacha (the square) : validé par Enzo le 16 sept. 2026, à
  // garder (l'id « sample » est historique, ce n'est plus un exemple).
  {
    id: "sample",
    quoteKey: "studio.proof.quotes.sample",
    authorKey: "studio.proof.authors.sample",
    status: "verified",
  },
  {
    id: "7eyes",
    quoteKey: "studio.proof.quotes.7eyes",
    authorKey: "studio.proof.authors.7eyes",
    projectSlug: "7eyes",
    status: "placeholder",
  },
  {
    id: "lumiere",
    quoteKey: "studio.proof.quotes.lumiere",
    authorKey: "studio.proof.authors.lumiere",
    projectSlug: "lumiere-de-soso",
    status: "placeholder",
  },
];
