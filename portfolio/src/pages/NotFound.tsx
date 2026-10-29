import { Link } from "react-router";
import { SiteHeader } from "../components/SiteHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-start justify-center px-5 md:px-10">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-[-0.04em]">Ce disque n'est pas dans le bac.</h1>
        <Link to="/" className="mt-8 text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
          ← Retour aux projets
        </Link>
      </main>
    </div>
  );
}
