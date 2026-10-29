import { useCallback, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "../../data/projects";
import { useViewport } from "../../hooks/useViewport";
import { computeLayout } from "./crateMath";
import { useCrateControls } from "./useCrateControls";
import { CrateCard } from "./CrateCard";
import { ActiveInfo } from "./ActiveInfo";
import { ProgressBars } from "./ProgressBars";

interface Props {
  projects: Project[];
  initialIndex?: number;
  /** Appelé à chaque changement de carte active */
  onActiveChange?: (index: number) => void;
  /** Appelé quand on ouvre la carte active ; `rect` = position de la pochette à l'écran */
  onOpen: (project: Project, index: number, rect: DOMRect | null) => void;
}

/**
 * Le bac à disques : pile de pochettes en diagonale et en perspective.
 * Molette, drag, swipe, clavier → la pile se feuillette avec inertie.
 */
export function Crate({ projects, initialIndex = 0, onActiveChange, onOpen }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sleeveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion() ?? false;
  const { width, height } = useViewport();
  const layout = useMemo(() => computeLayout(width, height), [width, height]);
  const isMobile = width < 768;

  const open = useCallback(
    (index: number) => {
      const el = sleeveRefs.current[index];
      onOpen(projects[index], index, el ? el.getBoundingClientRect() : null);
    },
    [onOpen, projects],
  );

  const { position, active, goTo, onPointerDown, wasDrag } = useCrateControls({
    count: projects.length,
    initialIndex,
    layout,
    reduced,
    stageRef,
    onOpen: open,
  });

  useEffect(() => onActiveChange?.(active), [active, onActiveChange]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Scène 3D : la perspective est commune à toutes les cartes */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        className="absolute inset-0 touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ perspective: reduced ? undefined : "1600px", perspectiveOrigin: "45% 50%" }}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Projets — utilise les flèches pour feuilleter, Entrée pour ouvrir"
      >
        {projects.map((project, i) => (
          <CrateCard
            key={project.slug}
            ref={(el) => {
              sleeveRefs.current[i] = el;
            }}
            project={project}
            index={i}
            isActive={i === active}
            position={position}
            layout={layout}
            reduced={reduced}
            distance={Math.abs(i - active)}
            onClick={() => {
              if (wasDrag()) return; // fin d'un drag : ce n'est pas un vrai clic
              if (i === active) open(i);
              else goTo(i);
            }}
          />
        ))}
      </div>

      {/* Infos du projet actif — coin bas-droit (desktop) / bas (mobile) */}
      <div
        className={
          isMobile
            ? "pointer-events-none absolute inset-x-5 bottom-16"
            : "pointer-events-none absolute right-10 bottom-20 max-w-[22rem] text-right"
        }
      >
        <ActiveInfo project={projects[active]} index={active} total={projects.length} reduced={reduced} />
      </div>

      {/* Indicateur de progression */}
      <div className={`absolute bottom-6 ${isMobile ? "left-5" : "left-1/2 -translate-x-1/2"}`}>
        <ProgressBars projects={projects} active={active} onSelect={goTo} />
      </div>

      {/* Aide discrète */}
      <p className="pointer-events-none absolute bottom-7 right-5 hidden text-[11px] tracking-wide text-muted md:right-10 md:block">
        Scroll · glisser · ← → pour feuilleter — Entrée pour ouvrir
      </p>
      <p className="pointer-events-none absolute bottom-7 right-5 text-[11px] tracking-wide text-muted md:hidden">
        Glisse · touche pour ouvrir
      </p>
    </div>
  );
}
