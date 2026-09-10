"use client";

import { useRef, type ReactNode } from "react";

/**
 * Magnetic v2 — lite. Pulls the child a few pixels toward the cursor
 * while hovering, springs back on leave via CSS transition.
 * No motion values, no springs, no global listeners.
 */
export function Magnetic({
  children,
  pull = 0.18,
  className,
}: {
  children: ReactNode;
  pull?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-out ${className ?? ""}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (el) el.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
