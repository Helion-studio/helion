"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Magnetic wrapper — the child is pulled toward the cursor inside a 60px
 * radius and springs back on release (tension 150 / friction 15).
 * Fine pointers only.
 */
export function Magnetic({
  children,
  radius = 60,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const reach = radius + Math.max(r.width, r.height) / 2;
      if (Math.hypot(dx, dy) < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y, radius, strength]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className ?? "inline-block"}>
      {children}
    </motion.div>
  );
}
