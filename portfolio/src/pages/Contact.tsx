import { useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "../data/profile";
import { SiteHeader } from "../components/SiteHeader";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact — Titouan Ory";
  }, []);

  const { email, linkedin, instagram, instagramHandle } = profile.contact;
  const links = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "LinkedIn", value: "Voir mon profil", href: linkedin },
    { label: "Instagram", value: instagramHandle, href: instagram },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <main className="flex flex-1 flex-col justify-center px-5 pb-20 md:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-[13px] font-medium uppercase tracking-[0.14em] text-muted"
        >
          Un projet, une collaboration, un partenariat ?
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
        >
          On en parle<span className="text-accent">.</span>
        </motion.h1>

        <ul className="border-t border-line">
          {links.map((l, i) => (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-baseline justify-between gap-6 border-b border-line py-6 md:py-8"
              >
                <span className="text-sm text-muted md:w-40">{l.label}</span>
                <span className="flex-1 truncate text-xl font-medium tracking-[-0.02em] transition-colors group-hover:text-accent md:text-4xl">
                  {l.value}
                </span>
                <span aria-hidden className="text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </main>
    </div>
  );
}
