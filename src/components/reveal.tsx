"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Scroll-into-view reveal used across the site's pages. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={rm ? { duration: 0 } : { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Standard page header — eyebrow / h1 / lead, the site's hierarchy anchor. */
export function PageHead({
  index,
  eyebrow,
  title,
  lead,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <header className="mx-auto max-w-7xl px-5 pt-36 pb-16 md:px-8 md:pt-44 md:pb-20">
      <Reveal>
        <p className="flex items-center gap-3 font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
          <span className="font-mono text-arc">{index}</span>
          <span aria-hidden className="h-px w-10 bg-white/15" />
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-hero leading-[0.98] font-light tracking-[-0.03em] text-balance">
          {title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-lead leading-relaxed tracking-[-0.01em] text-white/65">
          {lead}
        </p>
      </Reveal>
    </header>
  );
}
