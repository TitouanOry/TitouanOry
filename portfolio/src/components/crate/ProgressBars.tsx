import type { Project } from "../../data/projects";

/** Fines barres en bas de l'écran : position dans la pile (cliquables). */
export function ProgressBars({ projects, active, onSelect }: { projects: Project[]; active: number; onSelect: (i: number) => void }) {
  return (
    <nav aria-label="Position dans la pile de projets" className="flex items-end gap-1 md:gap-1.5">
      {projects.map((p, i) => (
        <button
          key={p.slug}
          type="button"
          tabIndex={-1}
          onClick={() => onSelect(i)}
          aria-label={`Aller au projet ${i + 1} : ${p.title}`}
          className="group flex h-6 items-end py-1"
        >
          <span
            className={`block h-[2px] rounded-full transition-all duration-500 ease-out ${
              i === active ? "w-7 bg-accent md:w-10" : "w-3 bg-ink/15 md:w-5 group-hover:bg-ink/40"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
