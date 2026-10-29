/**
 * Mémorise la dernière carte consultée, pour que le retour à l'accueil
 * ré-ouvre le bac au bon endroit (simple variable de module, pas besoin de plus).
 */
let lastIndex = 0;
export const getCrateIndex = () => lastIndex;
export const setCrateIndex = (i: number) => {
  lastIndex = i;
};
