import { useCallback, useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import { getProjectBySlug, projects } from "../data/projects";
import { SiteHeader } from "../components/SiteHeader";
import { Img } from "../components/Img";
import { useCardTransition } from "../transition/CardTransition";
import { setCrateIndex } from "../state/crateIndex";
import NotFound from "./NotFound";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Bloc qui apparaît en fondu léger quand il entre dans l'écran. */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Titre de section, discret, avec numéro. */
function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-baseline gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
      <span className="font-mono text-accent">{n}</span>
      {children}
    </h2>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { flyingSlug, registerTarget } = useCardTransition();
  const index = projects.findIndex((p) => p.slug === slug);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — Titouan Ory`;
    setCrateIndex(index); // le retour à l'accueil se fera sur ce projet
  }, [project, index]);

  // L'image d'en-tête sert de "cible" à la transition depuis la pochette
  const heroRef = useCallback((el: HTMLDivElement | null) => registerTarget(slug ?? "", el), [registerTarget, slug]);

  if (!project) return <NotFound />;

  const next = projects[(index + 1) % projects.length];
  const isFlying = flyingSlug === project.slug;

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />

      <main>
        {/* ===== En-tête : grande image ===== */}
        <div className="px-5 md:px-10">
          <div
            ref={heroRef}
            className="relative aspect-square w-full overflow-hidden bg-neutral-200 sm:aspect-[16/9] lg:aspect-[21/9]"
            style={{ opacity: isFlying ? 0 : 1 }}
          >
            <Img src={project.cover} alt={project.coverAlt} priority className="h-full w-full object-cover" />
          </div>
        </div>

        {/* ===== Titre + infos ===== */}
        <motion.section
          className="grid gap-10 px-5 pt-10 pb-16 md:grid-cols-12 md:px-10 md:pt-14 md:pb-24"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: isFlying ? 0.55 : 0.1, ease: EASE }}
        >
          <div className="md:col-span-8">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
              <span aria-hidden>←</span> Tous les projets
            </Link>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{project.summary}</p>
          </div>
          <dl className="grid grid-cols-2 content-end gap-x-6 gap-y-5 border-t border-line pt-6 text-sm md:col-span-4 md:border-t-0 md:pt-0">
            {[
              ["Catégorie", project.category],
              ["Année", String(project.year)],
              ["Client", project.client],
              ["Rôle", project.role],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="mb-1 text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
          </dl>
        </motion.section>

        {/* ===== Contexte & objectif ===== */}
        <section className="grid gap-12 border-t border-line px-5 py-16 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
          <Reveal>
            <Label n="01">Contexte</Label>
            <p className="text-xl leading-relaxed md:text-2xl md:leading-snug">{project.context}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Label n="02">Objectif</Label>
            <p className="text-xl leading-relaxed md:text-2xl md:leading-snug">{project.objective}</p>
          </Reveal>
        </section>

        {/* ===== Ce que j'ai fait ===== */}
        <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
          <Reveal>
            <Label n="03">Ce que j'ai fait</Label>
            <ol className="grid gap-x-12 md:grid-cols-2">
              {project.actions.map((action, i) => (
                <li key={action} className="flex gap-5 border-b border-line py-5 text-lg">
                  <span className="font-mono text-sm leading-7 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {action}
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ===== Résultats chiffrés ===== */}
        <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
          <Label n="04">Résultats</Label>
          <div className="grid gap-10 sm:grid-cols-3">
            {project.results.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.08}>
                <p className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-accent tabular-nums">
                  {r.value}
                </p>
                <p className="mt-3 max-w-[16rem] text-muted">{r.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== Galerie ===== */}
        {project.gallery.length > 0 && (
          <section className="border-t border-line px-5 py-16 md:px-10 md:py-24" aria-label="Galerie">
            <Label n="05">Galerie</Label>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {project.gallery.map((src, i) => (
                <Reveal key={src} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                  <div className="overflow-hidden bg-neutral-200">
                    <Img
                      src={src}
                      alt={`${project.title} — image ${i + 1}`}
                      sizes={i % 3 === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ===== Projet suivant ===== */}
        <Link
          to={`/projets/${next.slug}`}
          className="group flex items-center justify-between gap-6 border-t border-line px-5 py-14 md:px-10 md:py-20"
        >
          <div>
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">Projet suivant</p>
            <p className="text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] transition-colors group-hover:text-accent">
              {next.title} <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
            </p>
            <p className="mt-3 text-sm text-muted">
              {next.category} / {next.year}
            </p>
          </div>
          <div className="sleeve hidden aspect-square w-40 shrink-0 overflow-hidden rounded-[3px] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 sm:block md:w-52">
            <Img src={next.cover} alt="" className="h-full w-full object-cover" />
          </div>
        </Link>
      </main>
    </div>
  );
}
