// Position d'origine (viewport) de la vignette cliquée dans la galerie
// « travaux ». Lue par le hero de la page /work pour s'animer DEPUIS cette
// position (morph unifié : le vrai hero se déplie lui-même, sans clone ni
// raccord). Variable de module → persiste durant la navigation client (SPA),
// consommée puis remise à null. Rien à sérialiser : même contexte JS.
export const morphOrigin: { rect: DOMRect | null; slug: string | null } = {
  rect: null,
  slug: null,
};
