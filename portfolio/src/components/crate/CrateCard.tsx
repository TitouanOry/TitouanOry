import { forwardRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Project } from "../../data/projects";
import { cardStyle, type CrateLayout } from "./crateMath";
import { Img } from "../Img";

interface Props {
  project: Project;
  index: number;
  isActive: boolean;
  position: MotionValue<number>;
  layout: CrateLayout;
  reduced: boolean;
  /** Distance à la carte active (pour décider du lazy loading) */
  distance: number;
  onClick: () => void;
}

/**
 * Une pochette de vinyle dans le bac.
 * Sa transformation 3D est dérivée de la position globale à chaque frame.
 */
export const CrateCard = forwardRef<HTMLDivElement, Props>(function CrateCard(
  { project, index, isActive, position, layout, reduced, distance, onClick },
  sleeveRef,
) {
  // Style complet recalculé à chaque changement de position (sans re-rendu React)
  const style = useTransform(position, (p) => cardStyle(index - p, layout, reduced));
  const transform = useTransform(style, (s) => s.transform);
  const opacity = useTransform(style, (s) => s.opacity);
  const zIndex = useTransform(style, (s) => s.zIndex);
  const shade = useTransform(style, (s) => s.shade);
  // Le disque sort de la pochette quand la carte devient active
  const discX = useTransform(position, (p) => {
    const t = Math.min(Math.abs(index - p) * 1.6, 1);
    return `${(1 - t) * 34}%`;
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{ width: layout.size, height: layout.size, transform, opacity, zIndex }}
    >
      {/* Le disque vinyle, glissé derrière la pochette */}
      {!reduced && (
        <motion.div aria-hidden className="absolute inset-[3%] rounded-full" style={{ x: discX }}>
          <div className={`vinyl h-full w-full rounded-full ${isActive ? "vinyl-spin" : ""}`} />
        </motion.div>
      )}

      {/* La pochette */}
      <button
        type="button"
        onClick={onClick}
        tabIndex={isActive ? 0 : -1}
        aria-label={
          isActive
            ? `Ouvrir le projet ${project.title}, ${project.category}, ${project.year}`
            : `Afficher le projet ${project.title}`
        }
        aria-current={isActive ? "true" : undefined}
        className="sleeve group absolute inset-0 block cursor-pointer overflow-hidden rounded-[3px] bg-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      >
        <div ref={sleeveRef} className="absolute inset-0">
          <Img
            src={project.cover}
            alt={project.coverAlt}
            priority={distance < 3}
            className="h-full w-full object-cover select-none"
          />
        </div>
        {/* Assombrissement léger des cartes en arrière-plan */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />
        {/* Reflet très léger, comme sur une pochette plastifiée */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15" />
      </button>
    </motion.div>
  );
});
