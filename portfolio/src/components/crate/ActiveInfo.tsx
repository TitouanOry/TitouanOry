import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../../data/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/** Titre, catégorie et année du projet actif, affichés dans un coin de l'écran. */
export function ActiveInfo({ project, index, total, reduced }: { project: Project; index: number; total: number; reduced: boolean }) {
  return (
    <div className="pointer-events-none select-none" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={project.slug}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: reduced ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-muted tabular-nums">
            {pad(index + 1)} / {pad(total)}
          </p>
          <h2 className="text-[clamp(1.6rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted">
            <span className="text-accent">●</span> {project.category} <span className="mx-1.5 opacity-40">/</span> {project.year}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
