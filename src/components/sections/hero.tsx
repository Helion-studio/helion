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
import { Cursor } from "@/components/hero/cursor";
import { Magnetic } from "@/components/hero/magnetic";

/**
 * HERO — the blue artwork with light, real depth on pointer devices:
 * the whole scene tilts toward the cursor on springs while the content
 * drifts against it. Mobile: static artwork + entrance, nothing heavier.
 * (Custom cursor and magnetic pull removed — they lagged.)
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
          <div aria-hidden className="hero-glow absolute" />
        </motion.div>
      </div>

      {/* scene lighting: fade the artwork into the page void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-28 bg-gradient-to-b from-transparent to-void"
      />

      {/* content */}
      <motion.div
        style={rm ? undefined : { opacity: fade, y: rise, scale: shrink }}
        className="relative z-40 flex min-h-svh flex-col items-center justify-center px-6 py-28 text-center"
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
              — Booking Q4 builds
            </span>
          </motion.span>

          <h1 className="mt-8 font-display text-hero font-light leading-[0.95] tracking-[-0.03em] text-balance">
            <motion.span {...up(1.1)} className="block">
              Ambition,
            </motion.span>
            <motion.span {...up(1.22)} className="block font-medium">
              engineered.
            </motion.span>
          </h1>

          <motion.p
            {...up(1.7)}
            className="mt-7 max-w-[52ch] text-pretty text-lead leading-relaxed tracking-[-0.01em] text-white/65"
          >
            We build high-performance software engineered for your success. Meet Notch
            Team — a dedicated engineering group ready to bring your biggest ideas to life,
            from initial concept to deployment.
          </motion.p>

          <motion.div {...up(1.9)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="/contact" className="btn-primary">
                Let&rsquo;s Build
                <ArrowRight className="size-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="/work" className="btn-ghost">
                Explore Our Work
                <ArrowUpRight className="size-4" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* chat pill */}
      <motion.div {...up(2.2)} className="absolute right-5 bottom-24 z-50 md:right-12 md:bottom-16">
        <Magnetic pull={0.14}>
          <a
            href="/contact"
            aria-label="Chat with the team"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#070b12]/85 py-2 pr-4 pl-2.5 backdrop-blur-[8px] transition-colors duration-300 hover:border-white/25"
          >
            <span className="relative flex size-8 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff]">
              <MessagesSquare className="size-4" />
              <span aria-hidden className="animate-pulse-dot absolute top-0 right-0 size-1.5 rounded-full bg-energy" />
            </span>
            <span className="font-display text-tag font-medium tracking-[0.06em] text-white/80 uppercase">
              Chat with us
            </span>
          </a>
        </Magnetic>
      </motion.div>

      <Cursor />
    </section>
  );
}
