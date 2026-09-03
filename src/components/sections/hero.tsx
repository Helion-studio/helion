"use client";

import dynamic from "next/dynamic";
import { Component, Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ParticleField } from "@/components/hero/particles";
import { Cursor } from "@/components/hero/cursor";
import { Magnetic } from "@/components/hero/magnetic";
import { TeamPresence } from "@/components/hero/team-presence";

/**
 * HELION STUDIO — HERO v2 ("mission control")
 *
 * Z-stack: 10 particles · 20 arc (WebGL) · 40 badge · 50 type + CTAs ·
 *         60 nav (in navbar.tsx) · 70 cursor + team avatars.
 *
 * Load sequence (from the brief): void at 0ms → arc draws itself 200–1400ms
 * → bloom 800–2000ms → badge 1200ms → headline words 1400ms+80ms stagger →
 * subhead 2000ms → CTAs 2200ms → avatars 2500ms → particles 3000ms.
 *
 * Low-power path (mobile / reduced-motion / no WebGL): static arc image
 * fallback, no particles, no cursor, no magnetic pull, everything visible.
 */

const ArcScene = dynamic(
  () => import("@/components/hero/arc-scene").then((m) => m.ArcScene),
  { ssr: false },
);

const POWER3_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BACK_OUT: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const LINE_1 = ["We", "build", "what", "others"];
const LINE_2 = ["only", "imagine"];

/** If WebGL dies at runtime, drop to the static backdrop instead of a blank hero. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Static arc artwork — the low-power / mobile fallback layer. */
function StaticBackdrop({ breathe }: { breathe: boolean }) {
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-bg-blue.jpg"
        srcSet="/hero/hero-bg-blue-1600.jpg 1600w, /hero/hero-bg-blue.jpg 3840w"
        sizes="100vw"
        alt=""
        className={`h-full w-full object-cover ${breathe ? "hero-bg-base" : ""}`}
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute top-[8%] -right-[10%] h-[85%] w-[70%] [background:radial-gradient(closest-side,rgba(47,163,255,0.28),transparent_72%)]"
      />
    </div>
  );
}

export function Hero() {
  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // "boot" = solid void (SSR + first paint) → client decides the render path
  const [mode, setMode] = useState<"boot" | "webgl" | "static">("boot");
  const [backdropBreathes, setBackdropBreathes] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let webgl = false;
    try {
      const probe = document.createElement("canvas");
      webgl = !!(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setBackdropBreathes(finePointer && !reduced);
    setMode(reduced || !finePointer || !webgl ? "static" : "webgl");
  }, []);

  // headline + CTAs yield to the scroll once later sections exist
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.9], [0, -60]);
  const contentScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.95]);

  const drop = (delay: number, dur = 0.8) =>
    ({
      initial: rm ? false : { opacity: 0, y: 40, rotateX: 25 },
      animate: { opacity: 1, y: 0, rotateX: 0 },
      transition: rm ? { duration: 0 } : { delay, duration: dur, ease: POWER3_OUT },
    }) as const;

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[100svh] overflow-hidden bg-void">
      {/* JS-off insurance: never leave content trapped at opacity 0 */}
      <noscript>
        <style>{`#home [style]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      {/* z-10 — ambient particles (desktop WebGL path only) */}
      {mode === "webgl" && (
        <div className="particle-layer is-live pointer-events-none absolute inset-0 z-10">
          <ParticleField />
        </div>
      )}

      {/* z-20/30 — the arc */}
      {mode === "webgl" && (
        <div className="absolute inset-0 z-20">
          <SceneBoundary onError={() => setMode("static")}>
            <ArcScene />
          </SceneBoundary>
        </div>
      )}
      {mode === "static" && (
        <div className="absolute inset-0 z-20">
          <StaticBackdrop breathe={backdropBreathes} />
        </div>
      )}

      {/* z-40/50 — badge, headline, sub, CTAs */}
      <motion.div
        style={rm ? undefined : { opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="relative z-40 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-28 pb-28 text-center"
      >
        {/* status badge */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={rm ? { duration: 0 } : { delay: 1.2, duration: 0.6, ease: "easeOut" }}
          className="relative z-40 mb-8"
          role="status"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-[8px]">
            <span aria-hidden className="animate-pulse-dot size-[6px] rounded-full bg-energy" />
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white uppercase">
              Live
            </span>
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white/40 uppercase">
              — Booking Q4 builds
            </span>
          </span>
        </motion.div>

        {/* headline — word-staggered reveal, "imagine" carries the weight shift */}
        <h1
          className="relative z-50 font-display text-hero leading-[0.95] font-light tracking-[-0.03em] text-balance"
          style={{ perspective: 1000 }}
        >
          {LINE_1.map((word, i) => (
            <Fragment key={word}>
              <motion.span
                className="inline-block will-change-transform [transform-origin:50%_100%]"
                {...drop(1.4 + i * 0.08)}
              >
                {word}
              </motion.span>{" "}
            </Fragment>
          ))}
          <span className="block">
            {LINE_2.map((word, i) => (
              <Fragment key={word}>
                <motion.span
                  className={`inline-block will-change-transform [transform-origin:50%_100%] ${
                    word === "imagine" ? "font-medium" : ""
                  }`}
                  {...drop(1.4 + (LINE_1.length + i) * 0.08)}
                >
                  {word}
                </motion.span>{" "}
              </Fragment>
            ))}
          </span>
        </h1>

        {/* subheadline */}
        <motion.p
          initial={rm ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={rm ? { duration: 0 } : { delay: 2.0, duration: 0.7, ease: POWER3_OUT }}
          className="relative z-50 mt-7 max-w-[52ch] text-lead leading-relaxed font-normal tracking-[-0.01em] text-white/65"
        >
          Helion Studio designs and ships production software — real-time platforms, developer
          tooling and interfaces that feel instant on every device.
        </motion.p>

        {/* CTAs — elastic pop, magnetic pull */}
        <motion.div
          initial={rm ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={rm ? { duration: 0 } : { delay: 2.2, duration: 0.7, ease: BACK_OUT }}
          className="relative z-50 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#contact"
              className="group inline-flex items-center rounded-full bg-white px-7 py-3.5 font-display text-nav font-medium text-void transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
            >
              Start your project
              <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex items-center rounded-full border border-white/10 px-7 py-3.5 font-display text-nav font-medium text-white transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.03]"
            >
              Visit our work
              <ArrowUpRight className="ml-2 size-4 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* z-70 — team presence + custom cursor */}
      <TeamPresence />
      <Cursor />
    </section>
  );
}
