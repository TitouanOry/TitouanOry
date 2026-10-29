/**
 * Géométrie du bac à disques.
 *
 * Tout repose sur un seul nombre : `offset` = (index de la carte) − (position courante).
 *   offset = 0   → la carte est active, au premier plan
 *   offset > 0   → la carte est "derrière", vers le coin haut-droit
 *   offset < 0   → la carte a déjà été feuilletée, elle bascule vers le bas-gauche
 * La position est continue (ex. 2.35), ce qui donne des transitions fluides
 * pendant le scroll ou le drag : chaque carte est recalculée à chaque frame.
 */

export interface CrateLayout {
  /** Taille (côté) d'une carte carrée, en px */
  size: number;
  /** Décalage horizontal entre deux cartes, en px */
  stepX: number;
  /** Décalage vertical entre deux cartes, en px (vers le haut) */
  stepY: number;
  /** Profondeur entre deux cartes, en px (axe Z) */
  depth: number;
  /** Espace supplémentaire autour de la carte active, pour qu'elle respire */
  gap: number;
  /** Décalage du centre de la pile par rapport au centre de l'écran */
  originX: number;
  originY: number;
}

/** Calcule la mise en page selon la taille de l'écran (desktop / mobile). */
export function computeLayout(width: number, height: number): CrateLayout {
  const mobile = width < 768;
  if (mobile) {
    // Sur mobile : diagonale plus verticale, cartes plus grandes relativement à l'écran
    const size = Math.min(width * 0.62, height * 0.38, 340);
    return {
      size,
      stepX: size * 0.1,
      stepY: size * 0.19,
      depth: 70,
      gap: size * 0.32,
      originX: -width * 0.04,
      originY: height * 0.04,
    };
  }
  const size = Math.min(width * 0.3, height * 0.5, 440);
  return {
    size,
    stepX: size * 0.24,
    stepY: size * 0.12,
    depth: 90,
    gap: size * 0.36,
    originX: -width * 0.07,
    originY: height * 0.07,
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export interface CardStyle {
  transform: string;
  opacity: number;
  zIndex: number;
  /** Assombrissement des cartes en arrière-plan (0 → 1) */
  shade: number;
}

/**
 * Transformation 3D d'une carte selon son offset.
 * `reduced` = prefers-reduced-motion : on garde une pile lisible mais 100 % 2D.
 */
export function cardStyle(offset: number, l: CrateLayout, reduced: boolean): CardStyle {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  // t passe de 0 (carte active) à 1 (carte à une position ou plus de l'active)
  const t = clamp(abs, 0, 1);

  // Position sur la diagonale bas-gauche → haut-droit, + espace autour de l'active
  const x = l.originX + offset * l.stepX + sign * t * l.gap;
  const y = l.originY - offset * l.stepY - sign * t * l.gap * 0.55;

  // Les cartes déjà feuilletées (offset < 0) disparaissent vite ;
  // les cartes à venir restent visibles en arrière-plan.
  const opacity = offset < 0 ? clamp(1 - (abs - 1) * 0.45, 0, 1) : clamp(1 - (abs - 4.5) * 0.45, 0, 1);
  const zIndex = 1000 - Math.round(abs * 10) - (offset < 0 ? 5 : 0);
  const shade = t * 0.08 + clamp(abs - 1, 0, 6) * 0.025;

  if (reduced) {
    const scale = lerp(1, 0.86, t);
    return {
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      opacity,
      zIndex,
      shade,
    };
  }

  // La carte active se redresse (rotation faible), s'avance (Z) et grandit.
  const z = -abs * l.depth + (1 - t) * 60;
  const rotY = lerp(-8, -38, t); // inclinaison latérale
  const rotX = offset < 0 ? lerp(4, 22, t) : lerp(4, 10, t); // les cartes feuilletées basculent vers l'avant
  const rotZ = lerp(0, -2, t);
  const scale = lerp(1.08, 0.9, t);

  return {
    transform:
      `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
      `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`,
    opacity,
    zIndex,
    shade,
  };
}
