"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * SHOWCASE DECK v2 — the deck is LOCKED. It sits pinned in place for the
 * whole stretch; scrolling only flips the top card to the back and swaps
 * the one-line caption beside it. Desktop: caption left, deck right.
 * Mobile: deck on top, caption beneath. No project essay — one line each.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Card({
  p,
  queue,
  flipped,
  rm,
}: {
  p: Project;
  queue: number;
  flipped: boolean;
  rm: boolean | null;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 40 - queue * 10, transformStyle: "preserve-3d" }}
      initial={false}
      animate={
        rm
          ? { y: queue * 12, scale: 1 - queue * 0.045 }
          : {
              rotateY: flipped ? 180 : 0,
              y: queue * 16,
              scale: 1 - queue * 0.05,
              rotate: (queue % 2 ? 1 : -1) * queue * 1.2,
            }
      }
      transition={{ duration: 0.65, ease: EASE }}
    >
      {/* face — the screenshot */}
      <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.thumbnail}
          alt={`${p.name} — ${p.category}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
        <p className="absolute bottom-4 left-5 font-display text-sm font-semibold text-white">
          {p.name}
        </p>
      </div>

      {/* back — brand pattern */}
      <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-[#070b12] [transform:rotateY(180deg)]">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.14),transparent_65%)]" />
        <div className="absolute inset-0 [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_10px)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
          <p className="font-mono text-micro tracking-[0.34em] text-white/35 uppercase">
            Top-notch
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function FlipDeck({ projects, className }: { projects: Project[]; className?: string }) {
  const rm = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = projects.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999))));
  });

  const current = projects[active];

  return (
    <div ref={ref} className={`relative ${className ?? ""}`} style={{ height: `${n * 90}svh` }}>
      {/* the locked scene */}
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          {/* one-line caption — left on desktop */}
          <div className="order-2 min-h-36 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={rm ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={rm ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
                  0{active + 1} / 0{n} — {current.year}
                </p>
                <Link
                  href={`/work/${current.slug}`}
                  className="group mt-3 inline-flex items-center gap-2.5"
                >
                  <span className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-medium tracking-[-0.02em] text-white">
                    {current.name}
                  </span>
                  <ArrowUpRight className="size-5 text-white/40 transition group-hover:rotate-45 group-hover:text-white" />
                </Link>
                <p className="mt-2.5 max-w-[38ch] text-body leading-relaxed text-white/60">
                  {current.blurb}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* progress ticks */}
            <div className="mt-8 flex items-center gap-1.5" aria-hidden>
              {projects.map((p, i) => (
                <span
                  key={p.slug}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? "w-7 bg-arc" : "w-2.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* the deck — locked right, flips in place */}
          <div className="order-1 lg:order-2" style={{ perspective: 1400 }}>
            <div className="relative mx-auto h-[230px] w-[82vw] max-w-[400px] sm:h-[290px] lg:h-[400px] lg:max-w-[470px]">
              {projects.map((p, i) => (
                <Card
                  key={p.slug}
                  p={p}
                  queue={(i - active + n) % n}
                  flipped={i < active}
                  rm={rm}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
