import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Transition "la pochette s'agrandit pour devenir l'en-tête".
 *
 * Principe (technique FLIP) :
 * 1. Au clic, l'accueil mémorise la position de la pochette à l'écran (`launch`).
 * 2. Un calque fixe affiche la même image exactement à cet endroit, au-dessus de tout.
 * 3. La page projet s'affiche et signale où se trouve son image d'en-tête (`registerTarget`).
 * 4. Le calque s'anime jusqu'à cette position, puis disparaît : l'en-tête prend le relais.
 */

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Flight {
  slug: string;
  src: string;
  alt: string;
  from: Rect;
}

interface CardTransitionApi {
  /** Projet en cours de transition (son en-tête doit rester caché pendant le vol) */
  flyingSlug: string | null;
  launch: (flight: { slug: string; src: string; alt: string; from: DOMRect }) => void;
  registerTarget: (slug: string, el: HTMLElement | null) => void;
}

const Ctx = createContext<CardTransitionApi | null>(null);

const DURATION = 0.85;
const EASE = [0.76, 0, 0.24, 1] as const; // ease-in-out appuyé, très "éditorial"

export function CardTransitionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [to, setTo] = useState<Rect | null>(null);
  const flightRef = useRef<Flight | null>(null);
  flightRef.current = flight;

  const launch = useCallback<CardTransitionApi["launch"]>(
    ({ slug, src, alt, from }) => {
      if (reduced) return; // pas de vol en mode "reduced motion"
      setTo(null);
      setFlight({ slug, src, alt, from: { top: from.top, left: from.left, width: from.width, height: from.height } });
    },
    [reduced],
  );

  const registerTarget = useCallback<CardTransitionApi["registerTarget"]>((slug, el) => {
    if (!el || flightRef.current?.slug !== slug) return;
    // On attend une frame : la page a eu le temps de remonter en haut et de se mettre en page
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      setTo({ top: r.top, left: r.left, width: r.width, height: r.height });
    });
  }, []);

  // Sécurité : si la cible n'arrive jamais (page introuvable…), on arrête le vol
  useEffect(() => {
    if (!flight) return;
    const t = window.setTimeout(() => setFlight(null), (DURATION + 0.8) * 1000);
    return () => window.clearTimeout(t);
  }, [flight]);

  const api = useMemo(() => ({ flyingSlug: flight?.slug ?? null, launch, registerTarget }), [flight, launch, registerTarget]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {flight && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-[3000] overflow-hidden bg-neutral-200"
          initial={{ ...flight.from, borderRadius: 3 }}
          animate={to ? { ...to, borderRadius: 0 } : undefined}
          transition={{ duration: DURATION, ease: EASE }}
          onAnimationComplete={() => {
            if (to) setFlight(null);
          }}
        >
          <img src={flight.src} alt="" className="h-full w-full object-cover" draggable={false} />
        </motion.div>
      )}
    </Ctx.Provider>
  );
}

export function useCardTransition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCardTransition doit être utilisé dans <CardTransitionProvider>");
  return ctx;
}
