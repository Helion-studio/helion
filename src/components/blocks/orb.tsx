"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The Orb — visual anchor (spec §5).
 *
 * Built from layered radial/conic gradients rather than blur filters, so it
 * costs almost nothing to composite even on a mid-range phone.
 *
 *  - obsidian body: #0A0A0F core -> #000 at the edges
 *  - atmospheric bloom: #0066FF at ~20% behind the sphere
 *  - fresnel: a faint ice-blue rim light
 *  - edge sweep: a rotating conic hotspot, masked to a 2–4px ring, so a small
 *    specular travels continuously around the rim (lighthouse sweep)
 */
export function Orb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group/orb pointer-events-auto relative aspect-square",
        "w-[clamp(280px,35vw,520px)]",
        className,
      )}
    >
      {/* atmospheric bloom */}
      <div
        aria-hidden
        className="absolute -inset-[38%] rounded-full opacity-90 transition-opacity duration-700 group-hover/orb:opacity-100
          [background:radial-gradient(circle,rgba(0,102,255,0.20)_0%,rgba(0,102,255,0.10)_38%,rgba(0,102,255,0)_68%)]"
      />
      {/* tighter core glow */}
      <div
        aria-hidden
        className="absolute -inset-[12%] rounded-full
          [background:radial-gradient(circle,rgba(0,170,255,0.22)_0%,rgba(0,102,255,0.08)_45%,transparent_70%)]"
      />

      {/* obsidian body */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full
          [background:radial-gradient(circle_at_50%_42%,#0A0A0F_0%,#07070c_55%,#000000_100%)]
          shadow-[inset_0_-30px_60px_-30px_rgba(0,102,255,0.35),inset_0_20px_60px_-40px_rgba(255,255,255,0.10)]"
      />

      {/* fresnel rim */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full
          [background:radial-gradient(circle,transparent_78%,rgba(0,170,255,0.28)_92%,rgba(0,170,255,0.05)_100%)]"
      />

      {/* edge sweep — rotating specular, masked to the rim */}
      <div
        aria-hidden
        className="orb-sweep absolute inset-0 overflow-hidden rounded-full"
      >
        <div className="orb-sweep-rotor absolute inset-0 rounded-full" />
      </div>
    </div>
  );
}
