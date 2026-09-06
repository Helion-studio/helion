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
 * TOP-NOTCH TEAM — HERO
 *
 * The blue artwork is the hero on every device. On PCs it gets real, light
 * depth: the artwork tilts in perspective toward the cursor (±3°), the
 * content parallaxes against it a few pixels, all on soft springs — cheap
 * transform-only framer-motion, no WebGL. Mobile stays simple: static
 * artwork, short entrance, no tilt, no cursor, no magnetic pull.
 *
 * Copy rule: no comparisons — words that move on their own.
 */

const POWER3_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BACK_OUT: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const LINE_1 = ["Ambition,"];
const LINE_2 = ["engineered."];

export function Hero() {
  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // depth mode: pointer-driven perspective (PC only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-1, 1], [3, -3]), { stiffness: 50, damping: 20 });
  const tiltY = useSpring(useTransform(px, [-1, 1], [-3.5, 3.5]), { stiffness: 50, damping: 20 });
  const bgX = useSpring(useTransform(px, [-1, 1], [14, -14]), { stiffness: 50, damping: 20 });
  const bgY = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 50, damping: 20 });
  const fgY = useSpring(useTransform(py, [-1, 1], [-6, 6]), { stiffness: 50, damping: 22 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || rm) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, rm]);

  // headline + CTAs yield to the scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.9], [0, -60]);
  const contentScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.95]);

  // one entrance timeline — snappy cinematic; tilt/cursor/particles/magnetic
  // are what get simplified on mobile (pointer: coarse), not the copy timing
  const d = {
    badge: rm ? { duration: 0 } : { delay: 0.9, duration: 0.6, ease: "easeOut" as const },
    word: (i: number) =>
      rm
        ? { duration: 0 }
        : { delay: 1.1 + i * 0.09, duration: 0.8, ease: POWER3_OUT },
    sub: rm ? { duration: 0 } : { delay: 1.7, duration: 0.7, ease: POWER3_OUT },
    cta: rm ? { duration: 0 } : { delay: 1.9, duration: 0.7, ease: BACK_OUT },
    chat: rm ? { duration: 0 } : { delay: 2.2, duration: 0.6, ease: "easeOut" as const },
  };

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[100svh] overflow-hidden bg-void">
      <noscript>
        <style>{`#home [style]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      {/* ambient particles — PC only */}
      {!rm && (
        <div className="particle-layer is-live pointer-events-none absolute inset-0 z-10">
          <ParticleField />
        </div>
      )}

      {/* the artwork — tilts in perspective on PC */}
      <div className="absolute inset-0 z-20" style={{ perspective: 1200 }}>
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="absolute inset-0">
          <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/hero-bg-blue.jpg"
              srcSet="/hero/hero-bg-blue-1600.jpg 1600w, /hero/hero-bg-blue.jpg 3840w"
              sizes="100vw"
              alt=""
              className="hero-bg-base h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="hero-glow pointer-events-none absolute top-[8%] -right-[10%] h-[85%] w-[70%] [background:radial-gradient(closest-side,rgba(47,163,255,0.28),transparent_72%)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* badge, headline, sub, CTAs */}
      <motion.div
        style={rm ? undefined : { opacity: contentOpacity, y: contentY, scale: contentScale }}
        className="relative z-40 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-28 pb-28 text-center"
      >
        <motion.div style={{ y: rm ? undefined : fgY }} className="flex flex-col items-center">
          {/* status badge */}
          <motion.div
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={d.badge}
            className="mb-8"
            role="status"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#070b12]/80 px-4 py-1.5 backdrop-blur-[8px]">
              <span aria-hidden className="animate-pulse-dot size-[6px] rounded-full bg-energy" />
              <span className="font-display text-tag font-medium tracking-[0.08em] text-white uppercase">
                Live
              </span>
              <span className="font-display text-tag font-medium tracking-[0.08em] text-white/40 uppercase">
                — Booking Q4 builds
              </span>
            </span>
          </motion.div>

          {/* headline */}
          <h1
            className="font-display text-hero leading-[0.95] font-light tracking-[-0.03em] text-balance"
            style={{ perspective: 1000 }}
          >
            {LINE_1.map((word, i) => (
              <span key={word} className="inline-block overflow-visible">
                <motion.span
                  className="inline-block will-change-transform [transform-origin:50%_100%]"
                  initial={rm ? false : { opacity: 0, y: 40, rotateX: 25 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={d.word(i)}
                >
                  {word}
                </motion.span>{" "}
              </span>
            ))}
            <span className="block">
              {LINE_2.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block font-medium will-change-transform [transform-origin:50%_100%]"
                  initial={rm ? false : { opacity: 0, y: 40, rotateX: 25 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={d.word(LINE_1.length + i)}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* subheadline */}
          <motion.p
            initial={rm ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={d.sub}
            className="mt-7 max-w-[52ch] text-lead leading-relaxed font-normal tracking-[-0.01em] text-white/65"
          >
            Top-notch Team designs and ships production software — real-time platforms, developer
            tooling and interfaces that feel instant on every device.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={rm ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={d.cta}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic>
              <a
                href="/contact"
                className="group inline-flex items-center rounded-full bg-white px-7 py-3.5 font-display text-nav font-medium text-void transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]"
              >
                Start your project
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/work"
                className="group inline-flex items-center rounded-full border border-white/10 bg-[#070b12]/60 px-7 py-3.5 font-display text-nav font-medium text-white backdrop-blur-[6px] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
              >
                Visit our work
                <ArrowUpRight className="ml-2 size-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* chat CTA — replaced the avatar cluster (the team is more than four) */}
      <motion.div
        initial={rm ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={d.chat}
        className="absolute right-5 bottom-24 z-[70] md:right-12 md:bottom-16"
      >
        <Magnetic>
          <a
            href="/contact"
            aria-label="Chat with the team"
            className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-[#070b12]/85 py-2 pr-4 pl-2.5 backdrop-blur-[8px] transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]"
          >
            <span className="relative flex size-8 items-center justify-center rounded-full bg-arc/15 text-[#9ccbff] transition-colors group-hover:bg-arc/25">
              <MessagesSquare className="size-4" />
              <span
                aria-hidden
                className="animate-pulse-dot absolute top-0 right-0 size-1.5 rounded-full bg-energy"
              />
            </span>
            <span className="font-display text-tag font-medium tracking-[0.06em] text-white/80 uppercase group-hover:text-white">
              Chat with us
            </span>
          </a>
        </Magnetic>
      </motion.div>

      <Cursor />
    </section>
  );
}
