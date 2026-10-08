"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, MessagesSquare } from "lucide-react";
import { ParticleField } from "@/components/hero/particles";
import { Cursor } from "@/components/hero/cursor";
import { Magnetic } from "@/components/hero/magnetic";
import { heroStats, plans } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * HERO — rebuilt to the approved mockup, with zero image bytes.
 *
 * Layout, words, buttons and the stat row match the mockup line for line:
 *   LIVE badge → "Infrastructure, / elevated." → one-line promise →
 *   [Explore VPS plans] [View infrastructure] → 99.99% uptime · NVMe · 24/7
 *
 * The planet and its light are CSS only: a masked radial-gradient sphere
 * (`.hero-planet`) plus one rim arc (`.hero-rim`) — no WebGL, no curves
 * drawn on top of the artwork, no canvas. The star field and the scroll cue
 * are the only moving parts on desktop; touch devices get the static frame.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const rm = useReducedMotion();

  const up = (delay: number) => ({
    initial: rm ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: rm ? { duration: 0 } : { delay, duration: 0.7, ease: EASE },
  });

  return (
    <section id="home" className="hero-shell relative min-h-svh overflow-hidden bg-void">
      {/* night sky: stars + the planet's own light, all CSS */}
      <div aria-hidden className="hero-sky" />
      <div aria-hidden className="hero-planet" />
      <div aria-hidden className="hero-rim" />
      <div aria-hidden className="hero-fade" />

      {!rm && (
        <div className="particle-layer is-live absolute inset-0 z-10">
          <ParticleField />
        </div>
      )}

      {/* content */}
      <div className="relative z-30 flex min-h-svh flex-col items-center justify-center px-6 py-28 text-center">
        <div className="flex max-w-3xl flex-col items-center">
          <motion.span
            {...up(0.9)}
            role="status"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-[#070b12]/80 px-4 py-1.5 backdrop-blur-[8px]"
          >
            <span aria-hidden className="animate-pulse-dot size-[6px] rounded-full bg-energy" />
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white uppercase">
              Live
            </span>
            <span aria-hidden className="h-px w-5 bg-white/25" />
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white/45 uppercase">
              {plans.length} VPS plans online
            </span>
          </motion.span>

          <h1 className="mt-8 font-display text-hero font-light leading-[0.95] tracking-[-0.03em] text-balance">
            <motion.span {...up(1.1)} className="block">
              Infrastructure,
            </motion.span>
            <motion.span {...up(1.22)} className="hero-lead-word block font-medium">
              elevated.
            </motion.span>
          </h1>

          <motion.p
            {...up(1.7)}
            className="mt-7 max-w-[46ch] text-pretty text-lead leading-relaxed tracking-[-0.01em] text-white/70"
          >
            High-performance VPS hosting for projects that refuse to slow down.
          </motion.p>

          <motion.div {...up(1.9)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="#plans" className="tactile btn-primary">
                <span aria-hidden className="tactile-shine" />
                <span className="flex items-center gap-2">
                  Explore VPS plans
                  <ArrowRight className="size-4" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#plans" className="tactile btn-ghost">
                <span aria-hidden className="tactile-shine" />
                <span className="flex items-center gap-2">
                  View infrastructure
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Magnetic>
          </motion.div>

          <motion.ul
            {...up(2.1)}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            aria-label="What every plan includes"
          >
            {heroStats.map((stat, i) => (
              <li key={stat} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-energy/70" />}
                <span className="font-display text-body text-white/55">{stat}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* chat pill */}
      <motion.div {...up(2.2)} className="absolute right-5 bottom-10 z-40 md:right-12 md:bottom-12">
        <Magnetic pull={0.14}>
          <a
            href={`mailto:${site.email}`}
            aria-label={`Talk to someone at ${site.fullName}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#070b12]/85 py-2 pr-4 pl-2.5 backdrop-blur-[8px] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/25 active:translate-y-0 active:scale-[0.98]"
          >
            <span className="relative flex size-8 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff]">
              <MessagesSquare className="size-4" />
            </span>
            <span className="font-display text-tag font-medium tracking-[0.06em] text-white/80 uppercase">
              Chat with us
            </span>
          </a>
        </Magnetic>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        {...up(2.5)}
        className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5"
      >
        <span className="font-mono text-micro tracking-[0.32em] text-white/35 uppercase">Scroll</span>
        <span aria-hidden className="scroll-cue" />
      </motion.div>

      <Cursor />
    </section>
  );
}
