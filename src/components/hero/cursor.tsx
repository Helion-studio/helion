"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — 12px arc-blue dot in mix-blend-difference, expands to a
 * 40px outlined ring over anything clickable, trailed by 5 lagging dots
 * (~0.08s apart). Fine pointers only; off for touch and reduced-motion.
 * Visuals live in globals.css (.cursor-dot / .cursor-trail).
 */
const TRAIL = [8, 7, 6, 5, 4];
const TRAIL_OPACITY = [0.5, 0.4, 0.3, 0.22, 0.15];

export function Cursor() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    const main = mainRef.current;
    const trail = trailRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!main) return;

    const all = [main, ...trail];
    all.forEach((el) => (el.style.visibility = "hidden"));
    html.classList.add("custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pts = trail.map(() => ({ x: pos.x, y: pos.y }));
    let shown = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        shown = true;
        all.forEach((el) => (el.style.visibility = "visible"));
      }
      const t = e.target as Element | null;
      main.classList.toggle("is-hover", !!t?.closest?.("a, button, [data-cursor]"));
    };
    const leave = () => {
      shown = false;
      all.forEach((el) => (el.style.visibility = "hidden"));
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      main.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      let px = pos.x;
      let py = pos.y;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += (px - p.x) * 0.32; // ≈ 0.08s of lag per dot
        p.y += (py - p.y) * 0.32;
        trail[i].style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        px = p.x;
        py = p.y;
      }
    };
    tick();

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={mainRef} className="cursor-dot" aria-hidden />
      {TRAIL.map((size, i) => (
        <div
          key={size}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          aria-hidden
          className="cursor-trail"
          style={{ width: size, height: size, opacity: TRAIL_OPACITY[i] }}
        />
      ))}
    </>
  );
}
