"use client";

/**
 * 21st.dev — beratberkayg/hero-1
 * Pasted from the registry, with four fixes required to run in this project:
 *
 *  1. `hsl(var(--background))` → `var(--background)`
 *     Our theme tokens are oklch() colours, not HSL channel triplets, so the
 *     original wrapper produced an invalid colour and the bottom fade vanished.
 *  2. `animate-fade-in` / `animate-fade-up` keyframes added to tailwind.config.ts.
 *     The title, subtitle and radial accent ship with `opacity-0`, so without
 *     those keyframes the hero renders BLANK. This was the critical one.
 *  3. `font-geist` — Geist is loaded in layout.tsx and mapped to `--font-geist`.
 *  4. Renamed `Hero` → `Hero1` to avoid colliding with our section component.
 *
 * Palette swapped from the demo's neutral greys to the Helion steel ramp.
 */

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Hero1Props {
  eyebrow?: string;
  eyebrowHref?: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional slot rendered between the eyebrow and the title (e.g. the logo). */
  children?: React.ReactNode;
  className?: string;
}

export function Hero1({
  eyebrow = "Innovate Without Limits",
  eyebrowHref = "#",
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
  children,
  className,
}: Hero1Props) {
  return (
    <section
      id="hero"
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-b-xl px-6 pt-32 text-center md:px-8 md:pt-40",
        "min-h-[calc(100svh-40px)]",
        // light mode kept for completeness; the site runs dark
        "bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)]",
        // FIX: Helion ramp instead of the demo's #898e8e → #ffffff
        "dark:bg-[linear-gradient(to_bottom,#12161d,#12161d_28%,#5b7085_76%,#dce6ef_99%)]",
        className,
      )}
    >
      {/* Grid BG */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 h-[600px] w-full opacity-80
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
        dark:bg-[linear-gradient(to_right,#2b3644_1px,transparent_1px),linear-gradient(to_bottom,#2b3644_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent — the horizon */}
      <div
        aria-hidden
        className="animate-fade-up absolute left-1/2 top-[calc(100%-90px)]
        h-[500px] w-[700px] -translate-x-1/2 rounded-[100%]
        bg-white dark:bg-helion-void
        bg-[radial-gradient(closest-side,#fff_82%,#000000)]
        dark:bg-[radial-gradient(closest-side,#12161d_82%,#dce6ef)]
        md:h-[500px] md:w-[1100px] lg:top-[calc(100%-150px)] lg:h-[750px] lg:w-[140%]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href={eyebrowHref} className="group inline-block">
          <span
            className="font-geist mx-auto flex w-fit items-center justify-center rounded-3xl
            border-[2px] border-gray-300/20 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5
            to-transparent px-5 py-2 text-sm uppercase tracking-tight text-gray-600
            transition-colors group-hover:border-helion-steel/40 dark:border-white/10 dark:text-helion-mist"
          >
            {eyebrow}
            <ChevronRight className="ml-2 inline h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </a>
      )}

      {children}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br
        from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold
        leading-none tracking-tighter text-transparent opacity-0
        sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mx-auto mb-12 max-w-2xl -translate-y-4 text-balance
        text-lg tracking-tight text-gray-600 opacity-0 md:text-xl dark:text-helion-mist/70"
        style={{ ["--animation-delay" as string]: "200ms" }}
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div
          className="animate-fade-in flex justify-center opacity-0"
          style={{ ["--animation-delay" as string]: "400ms" }}
        >
          <Button
            asChild
            size="lg"
            className="font-geist z-20 mt-[-20px] h-12 w-fit rounded-xl text-center
            text-lg tracking-tighter md:w-52"
          >
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      )}

      {/* Bottom Fade — FIX: var(--background), not hsl(var(--background)) */}
      <div
        aria-hidden
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,var(--background)_10%,transparent)]"
      />
    </section>
  );
}
