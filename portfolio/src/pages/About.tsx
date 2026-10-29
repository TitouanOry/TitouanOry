import { useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "../data/profile";
import { SiteHeader } from "../components/SiteHeader";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function About() {
  useEffect(() => {
    document.title = "À propos — Titouan Ory";
  }, []);

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader />
      <main className="px-5 pb-24 md:px-10">
        {/* Bio */}
        <section className="grid gap-10 pt-12 pb-20 md:grid-cols-12 md:pt-24 md:pb-28">
          <motion.h1
            {...fade()}
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:col-span-12"
          >
            Raconter le sport <br className="hidden md:block" />
            et la mer<span className="text-accent">.</span>
          </motion.h1>
          <motion.div {...fade(0.1)} className="space-y-5 text-lg leading-relaxed md:col-span-7 md:col-start-6 md:text-xl">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-base text-muted">{profile.location}</p>
          </motion.div>
        </section>

        {/* Compétences */}
        <section className="grid gap-10 border-t border-line py-16 md:grid-cols-12 md:py-24">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:col-span-4">Compétences</h2>
          <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
            {profile.skills.map((s) => (
              <div key={s.group}>
                <h3 className="mb-4 font-semibold">{s.group}</h3>
                <ul className="space-y-2 text-muted">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Parcours */}
        <section className="grid gap-10 border-t border-line py-16 md:grid-cols-12 md:py-24">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted md:col-span-4">Parcours</h2>
          <ol className="md:col-span-8">
            {profile.timeline.map((t) => (
              <li key={t.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <span className="font-mono text-sm leading-7 text-muted tabular-nums">{t.period}</span>
                <div>
                  <p className="text-lg font-medium">{t.title}</p>
                  <p className="text-muted">{t.place}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
