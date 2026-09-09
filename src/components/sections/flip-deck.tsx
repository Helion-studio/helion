"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * SHOWCASE DECK — four project screenshots stacked like a deck of cards.
 * Scrolling the text track flips the top card over to the back of the
 * deck (rotateY 180, back face is the brand pattern), promoting the next
 * card; scrolling back up unflips. Desktop: deck pinned right, text
 * scrolls left. Mobile: deck pinned in a strip at the top, text scrolls
 * beneath it.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Deck({
  projects,
  active,
  rm,
  className,
}: {
  projects: Project[];
  active: number;
  rm: boolean | null;
  className?: string;
}) {
  const n = projects.length;

  return (
    <div className={className} aria-hidden={false}>
      {projects.map((p, i) => {
        const queue = (i - active + n) % n; // 0 = top of the deck
        const flipped = i < active; // has been passed → shows its back
        return (
          <motion.div
            key={p.slug}
            className="absolute inset-0"
            style={{ zIndex: 40 - queue * 10, transformStyle: "preserve-3d" }}
            initial={false}
            animate={
              rm
                ? { y: queue * 10, scale: 1 - queue * 0.04 }
                : {
                    rotateY: flipped ? 180 : 0,
                    y: queue * 16,
                    scale: 1 - queue * 0.05,
                    rotate: (i % 2 ? 1 : -1) * queue * 1.4,
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
              <div className="absolute right-4 bottom-4 left-4">
                <p className="font-display text-sm font-semibold text-white">{p.name}</p>
                <p className="mt-0.5 text-micro tracking-[0.08em] text-white/55 uppercase">
                  {p.category}
                </p>
              </div>
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
      })}
    </div>
  );
}

export function FlipDeck({ projects, className }: { projects: Project[]; className?: string }) {
  const rm = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.65", "end 0.75"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(projects.length - 1, Math.max(0, Math.floor(p * projects.length))));
  });

  return (
    <div className={className}>
      {/* mobile — pinned deck strip above the scrolling text */}
      <div
        className="sticky top-[4.5rem] z-30 -mx-5 mb-8 bg-void/95 px-5 pt-2 pb-4 backdrop-blur-md lg:hidden"
        style={{ perspective: 1200 }}
      >
        <Deck projects={projects} active={active} rm={rm} className="relative mx-auto h-[248px] max-w-md" />
      </div>

      <div className="lg:flex lg:items-start lg:gap-16">
        {/* desktop — deck pinned in the right column */}
        <div className="hidden lg:block lg:w-[44%]">
          <div className="sticky top-28" style={{ perspective: 1200 }}>
            <Deck projects={projects} active={active} rm={rm} className="relative h-[460px]" />
          </div>
        </div>

        {/* the text track — scrolls on the left (desktop) / below (mobile) */}
        <div ref={trackRef} className="lg:w-[56%]">
          {projects.map((p, i) => (
            <div key={p.slug} className="flex min-h-[72svh] items-center py-10 lg:min-h-[88svh]">
              <div
                className={`max-w-md transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-30"
                }`}
              >
                <p className="font-mono text-micro tracking-[0.14em] text-arc uppercase">
                  0{i + 1} — {p.category}
                </p>
                <h3 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] font-light tracking-[-0.02em] text-white">
                  {p.name}
                </h3>
                <p className="mt-4 text-body leading-relaxed text-white/60">{p.blurb}</p>

                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-lg leading-none font-medium text-white">
                        {m.k}
                      </p>
                      <p className="mt-1.5 text-micro tracking-[0.08em] text-white/40 uppercase">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/work/${p.slug}`}
                  className="group mt-7 inline-flex items-center gap-2 font-display text-nav font-medium text-white transition-colors hover:text-accent"
                >
                  View project
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
