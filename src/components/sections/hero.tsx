"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ArrowUpRight, MessagesSquare } from "lucide-react";
import { ParticleField } from "@/components/hero/particles";
import { LimbGlow } from "@/components/hero/limb-glow";
import { Cursor } from "@/components/hero/cursor";
import { Magnetic } from "@/components/hero/magnetic";
import { site } from "@/lib/site";

/**
 * HERO — kept exactly as approved (same artwork, same composition, same
 * motion), with two changes: the copy is the store's, and the blue is now
 * real light instead of a blurred circle. The WebGL limb glow rides the
 * planet's edge with a travelling highlight; the CSS bloom underneath stays
 * as the fallback for reduced-motion and no-WebGL visitors.
 * Mobile: static artwork + entrance, no pointer tilt, glow at half res.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-1, 1], [3, -3]), { stiffness: 50, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-1, 1], [-3.5, 3.5]), { stiffness: 50, damping: 20 });
  const x = useSpring(useTransform(px, [-1, 1], [14, -14]), { stiffness: 50, damping: 20 });
  const y = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 50, damping: 20 });
  const drift = useSpring(useTransform(py, [-1, 1], [-6, 6]), { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (rm || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, rm]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 0.9], [0, -60]);
  const shrink = useTransform(scrollYProgress, [0, 0.9], [1, 0.95]);

  const up = (delay: number) => ({
    initial: rm ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: rm ? { duration: 0 } : { delay, duration: 0.7, ease: EASE },
  });

  return (
    <section ref={ref} id="home" className="relative min-h-svh overflow-hidden bg-void">
      {!rm && (
        <div className="particle-layer is-live absolute inset-0 z-10">
          <ParticleField />
        </div>
      )}

      {/* artwork — one tilting layer */}
      <div className="absolute inset-0 z-20 [perspective:1200px]">
        <motion.div style={{ rotateX, rotateY, x, y }} className="absolute -inset-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/hero-bg-blue.jpg"
            srcSet="/hero/hero-bg-blue-1600.jpg 1600w, /hero/hero-bg-blue.jpg 3840w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="hero-bg-base h-full w-full object-cover"
          />
          {/* CSS bloom: the fallback and the base wash under the WebGL light */}
          <div aria-hidden className="hero-glow absolute" />
        </motion.div>
      </div>

      {/* real light on the limb — additive, pointer-aware, half-res */}
      <LimbGlow className="absolute inset-0 z-30" />
      {/* static arc for reduced-motion / no-WebGL: same look, zero frames */}
      {rm && <div aria-hidden className="hero-limb absolute inset-0 z-30" />}

      {/* scene lighting: fade the artwork into the page void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-b from-transparent to-void"
      />

      {/* content */}
      <motion.div
        style={rm ? undefined : { opacity: fade, y: rise, scale: shrink }}
        className="relative z-50 flex min-h-svh flex-col items-center justify-center px-6 py-28 text-center"
      >
        <motion.div style={{ y: rm ? undefined : drift }} className="flex max-w-3xl flex-col items-center">
          <motion.span
            {...up(0.9)}
            role="status"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#070b12]/80 px-4 py-1.5 backdrop-blur-[8px]"
          >
            <span aria-hidden className="animate-pulse-dot size-[6px] rounded-full bg-energy" />
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white uppercase">
              Live
            </span>
            <span className="font-display text-tag font-medium tracking-[0.08em] text-white/40 uppercase">
              — {site.location.split("·").length} regions open
            </span>
          </motion.span>

          <h1 className="mt-8 font-display text-hero font-light leading-[0.95] tracking-[-0.03em] text-balance">
            <motion.span {...up(1.1)} className="block">
              Infra
            </motion.span>
            <motion.span {...up(1.22)} className="block font-medium">
              you can ssh into.
            </motion.span>
          </h1>

          <motion.p
            {...up(1.7)}
            className="mt-7 max-w-[52ch] text-pretty text-lead leading-relaxed tracking-[-0.01em] text-white/65"
          >
            SSD-backed VPS with full root, deployed in about forty seconds. Meet Dannystore
            — a small fleet of NVMe nodes in {site.location.split("·").length} regions, built
            for people who would rather read a man page than a support thread.
          </motion.p>

          <motion.div {...up(1.9)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="#plans" className="tactile btn-primary">
                <span aria-hidden className="tactile-shine" />
                <span className="flex items-center gap-2">
                  See the plans
                  <ArrowRight className="size-4" />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#flow" className="tactile btn-ghost">
                <span aria-hidden className="tactile-shine" />
                <span className="flex items-center gap-2">
                  How it works
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* contact pill */}
      <motion.div {...up(2.2)} className="absolute right-5 bottom-24 z-[60] md:right-12 md:bottom-16">
        <a
          href={`mailto:${site.email}`}
          aria-label="Talk to someone at Dannystore"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#070b12]/85 py-2 pr-4 pl-2.5 backdrop-blur-[8px] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/25 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff]">
            <MessagesSquare className="size-4" />
            <span aria-hidden className="animate-pulse-dot absolute top-0 right-0 size-1.5 rounded-full bg-energy" />
          </span>
          <span className="font-display text-tag font-medium tracking-[0.06em] text-white/80 uppercase">
            Talk to us
          </span>
        </a>
      </motion.div>

      <Cursor />

      {/* scroll cue */}
      <motion.div
        {...up(2.5)}
        className="absolute bottom-7 left-1/2 z-[55] flex -translate-x-1/2 flex-col items-center gap-2.5"
      >
        <span className="font-mono text-micro tracking-[0.32em] text-white/35 uppercase">Scroll</span>
        <span aria-hidden className="scroll-cue" />
      </motion.div>
    </section>
  );
}
