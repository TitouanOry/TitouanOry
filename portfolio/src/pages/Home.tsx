import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { projects, type Project } from "../data/projects";
import { Crate } from "../components/crate/Crate";
import { SiteHeader } from "../components/SiteHeader";
import { getCrateIndex, setCrateIndex } from "../state/crateIndex";
import { useCardTransition } from "../transition/CardTransition";

/** Accueil : le bac à disques en plein écran. */
export default function Home() {
  const navigate = useNavigate();
  const { launch } = useCardTransition();

  useEffect(() => {
    document.title = "Titouan Ory — Portfolio";
    // Précharge la page projet pour que la transition démarre sans attente
    void import("./Project");
  }, []);

  const handleOpen = useCallback(
    (project: Project, _index: number, rect: DOMRect | null) => {
      // Lance l'animation "la pochette devient l'en-tête", puis change de page
      if (rect) launch({ slug: project.slug, src: project.cover, alt: project.coverAlt, from: rect });
      navigate(`/projets/${project.slug}`);
    },
    [launch, navigate],
  );

  return (
    <main className="fixed inset-0 overflow-hidden bg-paper">
      <h1 className="sr-only">Titouan Ory — projets</h1>
      <SiteHeader overlay />
      <Crate projects={projects} initialIndex={getCrateIndex()} onActiveChange={setCrateIndex} onOpen={handleOpen} />
    </main>
  );
}
