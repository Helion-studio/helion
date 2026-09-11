"use client";

import { useEffect, useRef } from "react";

/**
 * AMBIENT LIGHT — the page's mood layer. A fixed blue/black wash that
 * adjusts itself to how you move: scroll depth sets the intensity
 * (deeper = a touch more blue in the air), the cursor steers the light
 * on pointer devices. One element, CSS gradients, variables written
 * directly — no re-renders, no layout cost.
 */
export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let target = { x: 50, y: 30, i: 0.4 };
    let current = { x: 50, y: 30, i: 0.4 };

    const apply = () => {
      raf = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      current.i += (target.i - current.i) * 0.08;
      el.style.setProperty("--amb-x", `${current.x.toFixed(2)}%`);
      el.style.setProperty("--amb-y", `${current.y.toFixed(2)}%`);
      el.style.setProperty("--amb-i", current.i.toFixed(3));
      if (
        Math.abs(target.x - current.x) > 0.05 ||
        Math.abs(target.y - current.y) > 0.05 ||
        Math.abs(target.i - current.i) > 0.005
      ) {
        raf = requestAnimationFrame(apply);
      }
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      // 0 at the top, 1 near the bottom of the page — the mood deepens
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target.i = 0.35 + 0.5 * Math.min(1, window.scrollY / max);
      wake();
    };

    const onMove =
      window.matchMedia("(pointer: fine)").matches
        ? (e: PointerEvent) => {
            target.x = (e.clientX / window.innerWidth) * 100;
            target.y = (e.clientY / window.innerHeight) * 100;
            wake();
          }
        : null;

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (onMove) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} aria-hidden className="ambient" />;
}
