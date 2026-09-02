"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { ShootingStars } from "@/components/blocks/shooting-stars";
import { site } from "@/lib/site";

const EASE = [0.4, 0, 0.2, 1] as const;
const HEADLINE = ["We", "build", "what", "others", "only", "imagine."];

/* WebGL is client-only and must never block first paint */
const Cosmos = dynamic(() => import("@/components/three/cosmos"), {
  ssr: false,
});

/** Feature-detect once so a machine without WebGL still gets a good hero. */
function useWebGL() {
  const [ok, setOk] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(
        !!(
          window.WebGLRenderingContext &&
          (c.getContext("webgl") || c.getContext("experimental-webgl"))
        ),
      );
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

export function HeroCosmic() {
  const reduce = useReducedMotion();
  const webgl = useWebGL();

  const word: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: reduce ? 0 : 0.25 + i * 0.05,
        ease: EASE,
      },
    }),
  };

  const fade = (delay: number): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: reduce ? 0 : delay, ease: EASE },
    },
  });

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 md:px-12 lg:px-16"
    >
      {/* ---------- WebGL: star volume + dome ---------- */}
      <div className="absolute inset-0 -z-30">{webgl && <Cosmos />}</div>

      {/* ---------- CSS: atmospheric bloom under the dome ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[62vh]
          [background:radial-gradient(60%_100%_at_50%_100%,rgba(0,102,255,0.20)_0%,rgba(0,102,255,0.08)_38%,transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[32vh]
          [background:radial-gradient(45%_100%_at_50%_112%,rgba(0,170,255,0.26)_0%,transparent_70%)]"
      />

      {/* ---------- CSS: shooting stars ---------- */}
      <ShootingStars />

      {/* ---------- CSS: vignette so type always wins ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_80%_at_50%_0%,transparent_42%,rgba(0,0,0,0.6)_100%)]"
      />

      {/* ---------- text ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center pb-[32vh] pt-24 text-center sm:pb-[28vh]">
        <motion.h1
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-1 font-display font-semibold text-white"
          style={{
            fontSize: "clamp(38px, 5.6vw, 92px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {HEADLINE.map((w, i) => (
            <motion.span
              key={w + i}
              custom={i}
              variants={word}
              className="inline-block"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fade(0.62)}
          className="mt-7 font-normal text-white/70"
          style={{ fontSize: "clamp(16px, 1.4vw, 22px)" }}
        >
          Bring your imagination to life at{" "}
          <span className="rainbow-underline text-white">Helion Studio</span>
        </motion.p>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fade(0.74)}
          className="mt-3 max-w-xl text-[14px] font-normal text-white/50 sm:text-[15px]"
        >
          Get in touch with people who not only ship, but give a reason it
          works.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fade(0.88)}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={site.cta.href}
            className="inline-flex items-center justify-center rounded-full border border-white bg-white px-7 py-3.5
              text-sm font-medium text-black transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:scale-[1.02] hover:bg-white/10 hover:text-white
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Start your project
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-3.5
              text-sm font-medium text-white transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              hover:scale-[1.02] hover:border-white/60 hover:bg-white/5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Visit our work
          </a>
        </motion.div>
      </div>

      {/* ---------- no-WebGL fallback: pure CSS dome ---------- */}
      {webgl === false && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -z-20 h-[38vh] w-[160vw] -translate-x-1/2 rounded-t-[50%]
            border-t border-[#0066ff]/40
            [background:radial-gradient(120%_180%_at_50%_100%,#0b1836_0%,#03050d_45%,#000_75%)]"
        />
      )}
    </section>
  );
}
