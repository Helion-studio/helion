/* Previous 3D hero — kept so we can bring the WebGL scene back in
   (e.g. behind the new hero, or on an interior page). Not currently mounted. */
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { Logo } from "@/components/logo";
import { site, brand } from "@/lib/site";
import { cn } from "@/lib/utils";

/* WebGL never runs on the server and never blocks first paint */
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgba(139,162,184,0.16),transparent_70%)]" />
  ),
});

const STATS = [
  { value: "99.98%", label: "Uptime, 12mo" },
  { value: "42ms", label: "Median p50" },
  { value: "8×", label: "Deploys / day" },
  { value: "120+", label: "Systems shipped" },
];

export function Hero3D() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 22, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: [0.22, 0.8, 0.24, 1] as const },
    },
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* ---------- layer 1: 3D ---------- */}
      <div className="absolute inset-0 -z-20">
        <HeroScene />
      </div>

      {/* ---------- layer 2: 2D atmosphere ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_45%,transparent_35%,var(--background)_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,rgba(220,230,239,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,230,239,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(62%_52%_at_50%_40%,black,transparent)]"
      />

      {/* ---------- layer 3: content ---------- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-5xl px-5 py-28 text-center sm:px-8"
      >
        <motion.div variants={item} className="flex justify-center">
          <div
            className={cn(
              "group rounded-full border border-white/10 bg-white/[0.04]",
              "backdrop-blur-sm transition-colors hover:bg-white/[0.08]",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center gap-2 px-4 py-1.5 text-xs tracking-wide">
              <span className="size-1.5 rounded-full bg-helion-mist shadow-[0_0_10px_#b4c8d8]" />
              <span>Helion Studio — booking Q4 builds</span>
              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
        </motion.div>

        {/* the mark, floating above the headline */}
        <motion.div variants={item} className="mt-10 flex justify-center">
          <Logo size={92} glow priority className="drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 text-balance text-[clamp(2.4rem,8vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.035em]"
        >
          Software that{" "}
          <AuroraText
            colors={[brand.ice, brand.mist, brand.steel, brand.ice]}
            speed={0.8}
          >
            holds
          </AuroraText>
          <br className="hidden sm:block" /> under real load.
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          {site.description}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-full bg-gradient-to-b from-helion-ice to-helion-mist px-7 text-[0.95rem] font-medium text-helion-ink shadow-[0_12px_44px_-14px_rgba(180,200,216,0.75)] transition-transform hover:scale-[1.02] hover:opacity-95 sm:w-auto"
          >
            <a href={site.cta.href}>
              {site.cta.label}
              <ArrowRight className="size-4" />
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full border-white/12 bg-white/[0.03] px-7 text-[0.95rem] backdrop-blur-sm hover:bg-white/[0.07] sm:w-auto"
          >
            <a href="#work">
              See the work
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </motion.div>

        <motion.dl
          variants={item}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-background/70 px-4 py-5 backdrop-blur-sm"
            >
              <dt className="bg-gradient-to-b from-helion-ice to-helion-steel bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Scroll
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-helion-mist to-transparent" />
      </div>
    </section>
  );
}
