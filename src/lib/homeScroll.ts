// Position de scroll de la home mémorisée juste avant d'ouvrir une étude de
// cas, restaurée au retour (bouton « studio. ») pour retomber au même endroit
// de la page plutôt qu'en haut. Variable de module → persiste durant la
// navigation client (SPA), consommée puis remise à null. Voir SmoothScroll
// (restauration) et work/shared.tsx (mémorisation).
export const homeScroll = { y: null as number | null };
