"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * DEPTH STRIP — our interactive bridge between the hero and the staircase.
 *
 * Three screenshots float as rim-lit 3D panes. Desktop: they fan out in
 * perspective and settle flat as you scroll through, each parallaxing at
 * its own depth. Mobile: the same panes stack and tilt upright as they
 * enter the viewport. Scroll-driven only — nothing here depends on a
 * pointer, so phones get the full effect at full speed.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PANES = [
  {
    src: "/work/ledgerline.jpg",
    name: "Ledgerline",
    line: "Payments events, streaming live.",
    tilt: 14,
    depth: -90,
    drift: 46,
  },
  {
    src: "/work/quorum.jpg",
    name: "Quorum",
    line: "Sixty cursors, one canvas.",
    tilt: 0,
    depth: 40,
    drift: 0,
  },
  {
    src: "/work/atlas-relay.jpg",
    name: "Atlas Relay",
    line: "60,000 devices, boringly stable.",
    tilt: -14,
    depth: -60,
    drift: -40,
  },
];

export function DepthStrip() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // the group settles from fanned → flat → fanned (mirrored) through the section
  const settle = useTransform(scrollYProgress, [0.05, 0.5, 0.95], [1, 0, -1]);
  const rise = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      aria-label="What we ship"
      className="relative overflow-hidden py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
        <p className="eyebrow justify-center">
          <span className="font-mono text-arc">01</span> What we ship
        </p>
        <h2 className="mx-auto mt-5 max-w-xl font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
          The work, <span className="font-medium">up close.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-pretty text-body leading-relaxed text-white/55">
          Three systems we shipped this year. Scroll — they meet you halfway.
        </p>
      </div>

      <div
        className="mx-auto mt-14 max-w-7xl px-5 md:mt-20 md:px-8"
        style={{ perspective: 1200 }}
      >
        <motion.div
          style={rm ? undefined : { y: rise }}
          className="grid gap-8 sm:grid-cols-3 md:gap-10"
        >
          {PANES.map((pane, i) => (
            <Pane key={pane.src} pane={pane} index={i} settle={settle} rm={rm} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Pane({
  pane,
  index,
  settle,
  rm,
}: {
  pane: (typeof PANES)[number];
  index: number;
  settle: ReturnType<typeof useTransform<number, number>>;
  rm: boolean | null;
}) {
  // each pane keeps its own tilt character, scaled by the group's settle value
  const rotateY = useTransform(settle, (s: number) => pane.tilt * s);
  const y = useTransform(settle, (s: number) => pane.drift * s);
  const z = useTransform(settle, (s: number) => pane.depth * (0.5 - Math.abs(0.5 - Math.abs(s))));

  return (
    <motion.figure
      initial={rm ? false : { opacity: 0, y: 60, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
      style={rm ? undefined : { rotateY, y, z }}
      className="will-change-transform"
    >
      <div className="pane-3d aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pane.src}
          alt={`${pane.name} — ${pane.line}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <span className="font-display text-[15px] font-medium text-white">{pane.name}</span>
        <span className="text-micro tracking-[0.06em] text-white/45 uppercase">{pane.line}</span>
      </figcaption>
    </motion.figure>
  );
}
