import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { animate, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls } from "framer-motion";
import type { CrateLayout } from "./crateMath";

/** Nombre de px de molette pour avancer d'une carte (une "cran" de souris ≈ 100 px) */
const WHEEL_PX = 110;
/** Délai sans molette avant de "caler" la pile sur la carte la plus proche */
const WHEEL_SNAP_DELAY = 140;
/** Distance de déplacement (px) en dessous de laquelle un appui est un clic, pas un drag */
const DRAG_THRESHOLD = 6;
/** Élasticité quand on tire au-delà de la première / dernière carte */
const RUBBER = 0.3;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

interface Options {
  count: number;
  initialIndex: number;
  layout: CrateLayout;
  reduced: boolean;
  /** Élément qui reçoit la molette et le drag */
  stageRef: RefObject<HTMLElement | null>;
  /** Appelé quand on valide la carte active (Entrée) */
  onOpen: (index: number) => void;
}

/**
 * Gère toutes les façons de feuilleter le bac :
 * molette / trackpad, drag souris, swipe tactile et clavier.
 *
 * La position est une MotionValue (pas un state React) : elle change à chaque frame
 * sans provoquer de re-rendu, ce qui garde l'animation fluide.
 */
export function useCrateControls({ count, initialIndex, layout, reduced, stageRef, onOpen }: Options) {
  const position = useMotionValue(initialIndex);
  const [active, setActive] = useState(initialIndex);

  const target = useRef(initialIndex); // carte visée (peut être fractionnaire pendant la molette)
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const snapTimer = useRef<number | undefined>(undefined);
  const dragMoved = useRef(false); // vrai si le dernier appui était un drag (pour ignorer le clic)

  // Met à jour l'index actif (arrondi) seulement quand il change réellement
  useMotionValueEvent(position, "change", (v) => {
    setActive(clamp(Math.round(v), 0, count - 1));
  });

  /** Anime la position vers une valeur avec un ressort (ou instantanément si reduced motion). */
  const animateTo = useCallback(
    (value: number, opts: { velocity?: number; soft?: boolean } = {}) => {
      anim.current?.stop();
      if (reduced) {
        position.set(value);
        return;
      }
      anim.current = animate(position, value, {
        type: "spring",
        // "soft" = suivi de la molette, plus souple ; sinon calage final plus ferme
        stiffness: opts.soft ? 140 : 190,
        damping: opts.soft ? 26 : 28,
        mass: 1,
        restDelta: 0.0005,
        ...(opts.velocity !== undefined ? { velocity: opts.velocity } : {}),
      });
    },
    [position, reduced],
  );

  /** Aller à une carte précise. */
  const goTo = useCallback(
    (index: number) => {
      const i = clamp(Math.round(index), 0, count - 1);
      window.clearTimeout(snapTimer.current);
      target.current = i;
      animateTo(i);
    },
    [animateTo, count],
  );

  const next = useCallback(() => goTo(Math.round(target.current) + 1), [goTo]);
  const prev = useCallback(() => goTo(Math.round(target.current) - 1), [goTo]);

  // ---------- Molette / trackpad ----------
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // la page d'accueil ne défile pas : la molette feuillette le bac
      const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? window.innerHeight : 1;
      const delta = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      target.current = clamp(target.current + delta / WHEEL_PX, -RUBBER, count - 1 + RUBBER);
      animateTo(target.current, { soft: true });
      // Quand la molette s'arrête, on se cale sur la carte la plus proche
      window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => goTo(target.current), WHEEL_SNAP_DELAY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(snapTimer.current);
    };
  }, [stageRef, count, animateTo, goTo]);

  // ---------- Drag souris + swipe tactile (Pointer Events) ----------
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      anim.current?.stop();
      window.clearTimeout(snapTimer.current);
      dragMoved.current = false;

      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = position.get();
      // Direction de la diagonale à l'écran (vers le haut-droit), normalisée
      const len = Math.hypot(layout.stepX, layout.stepY);
      const dirX = layout.stepX / len;
      const dirY = -layout.stepY / len;
      // Nombre de px de drag pour passer d'une carte à l'autre
      const pxPerCard = layout.size * 0.5;
      // Échantillons récents pour calculer la vitesse au relâchement (inertie)
      const samples: { t: number; p: number }[] = [{ t: performance.now(), p: startPos }];

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!dragMoved.current) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
          dragMoved.current = true;
        }
        // Projection du geste sur la diagonale : le contenu suit le doigt / la souris.
        // Glisser vers le haut-droit ramène les cartes précédentes, vers le bas-gauche les suivantes.
        const proj = dx * dirX + dy * dirY;
        let p = startPos - proj / pxPerCard;
        // Effet élastique aux extrémités
        if (p < 0) p *= RUBBER;
        if (p > count - 1) p = count - 1 + (p - (count - 1)) * RUBBER;
        position.set(p);
        const now = performance.now();
        samples.push({ t: now, p });
        while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        if (!dragMoved.current) return;
        // Vitesse en cartes/seconde sur les 100 dernières ms
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = Math.max((last.t - first.t) / 1000, 0.016);
        const velocity = (last.p - first.p) / dt;
        // Inertie : on projette la position là où l'élan l'aurait emmenée
        const projected = position.get() + velocity * 0.22;
        const dest = clamp(Math.round(projected), 0, count - 1);
        target.current = dest;
        animateTo(dest, { velocity });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [position, layout, count, animateTo],
  );

  // ---------- Clavier ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(count - 1);
          break;
        case "Enter": {
          // Si un lien ou un bouton a le focus, on laisse le navigateur gérer
          const focused = document.activeElement;
          if (focused && focused !== document.body && !stageRef.current?.contains(focused)) return;
          if (focused && focused.tagName === "BUTTON") return; // le bouton de la carte gère son propre clic
          e.preventDefault();
          onOpen(Math.round(target.current));
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, count, onOpen, stageRef]);

  // Si on bascule en mode "reduced motion" ou si la mise en page change, on recale.
  useEffect(() => {
    position.set(clamp(Math.round(target.current), 0, count - 1));
  }, [reduced, count, position]);

  /** À appeler dans le onClick d'une carte : vrai si le geste était un drag. */
  const wasDrag = useCallback(() => dragMoved.current, []);

  return { position, active, goTo, next, prev, onPointerDown, wasDrag };
}
