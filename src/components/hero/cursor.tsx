"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor v2 — reduced, not gone. One 8px dot (instant) + one ring that
 * lags ~90ms via pure CSS transition. No rAF loop, no trail, no state.
 * Fine pointers only; disabled under reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    const move = (e: PointerEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const t = e.target as Element | null;
      ring.classList.toggle("is-hot", !!t?.closest?.("a, button, summary, input, textarea"));
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
