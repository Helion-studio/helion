"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Team presence — the human signature. Four builders stacked bottom-right,
 * each floating on its own sine wave, expanding into a glass tooltip on
 * hover/focus. The lead avatar carries the pulsing cyan "online" dot.
 * (Initials stand in until real team photos are supplied.)
 */
const TEAM = [
  { name: "Alex", shade: "#0b1e3f", period: 3.2 },
  { name: "Sam", shade: "#123a6b", period: 3.8 },
  { name: "Jordan", shade: "#0d2848", period: 4.4 },
  { name: "Casey", shade: "#10315e", period: 5.0 },
];

export function TeamPresence() {
  const rm = useReducedMotion();

  return (
    <motion.div
      initial={rm ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rm ? { duration: 0 } : { delay: 2.5, duration: 0.7, ease: "easeOut" }}
      className="group absolute right-5 bottom-24 z-[70] md:right-12 md:bottom-16"
    >
      <div
        tabIndex={0}
        aria-label="4 builders online: Alex, Sam, Jordan, Casey"
        className="flex -space-x-3 outline-none transition-all duration-300 group-hover:space-x-2 group-focus-visible:space-x-2"
      >
        {TEAM.map((m, i) => (
          <motion.div
            key={m.name}
            animate={rm ? undefined : { y: [0, -8, 0] }}
            transition={
              rm
                ? undefined
                : { duration: m.period, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }
            }
            className="relative flex size-10 items-center justify-center rounded-full font-display text-[13px] font-medium text-[#cfe4ff] shadow-[0_0_12px_rgba(59,130,246,0.2)] ring-2 ring-void"
            style={{ backgroundColor: m.shade }}
          >
            {m.name[0]}
            {i === 0 && (
              <span
                aria-hidden
                className="animate-pulse-dot absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-energy ring-2 ring-void"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-0 bottom-full mb-3 translate-y-1 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="font-display text-tag font-medium tracking-[0.08em] text-white uppercase">
          4 builders online
        </p>
        <p className="mt-1 text-micro text-white/65">Alex · Sam · Jordan · Casey</p>
      </div>
    </motion.div>
  );
}
