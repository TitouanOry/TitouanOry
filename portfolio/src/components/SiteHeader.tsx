import { Link, NavLink } from "react-router";
import { profile } from "../data/profile";

/** En-tête : nom en haut à gauche, liens À propos / Contact en haut à droite. */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 transition-colors hover:text-ink ${isActive ? "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-accent" : "text-muted"}`;

  return (
    <header
      className={`${overlay ? "absolute" : "sticky bg-paper/85 backdrop-blur-md"} inset-x-0 top-0 z-[2000] flex items-start justify-between px-5 py-5 md:px-10 md:py-7`}
    >
      <Link to="/" className="group leading-tight" aria-label={`${profile.name} — accueil`}>
        <span className="block text-[15px] font-semibold tracking-[-0.01em]">{profile.name}</span>
        <span className="block text-[13px] text-muted">
          {profile.role} <span className="hidden sm:inline">· {profile.tagline}</span>
        </span>
      </Link>
      <nav className="flex gap-5 text-[14px] md:gap-8" aria-label="Navigation principale">
        <NavLink to="/a-propos" className={link}>
          À propos
        </NavLink>
        <NavLink to="/contact" className={link}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
