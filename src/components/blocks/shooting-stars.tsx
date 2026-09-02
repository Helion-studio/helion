"use client";

import * as React from "react";

/**
 * Shooting stars — deliberately kept in CSS/DOM rather than WebGL.
 * There are only ever 1–2 on screen, so a transform-and-opacity animation on
 * a 1px gradient element is cheaper than any GPU pass, and it composites on
 * its own layer without touching the WebGL frame budget.
 *
 * Random interval 4–12s, travel 600–1000ms (spec §7).
 */

type Shot = {
  id: number;
  top: number;
  left: number;
  angle: number;
  length: number;
  duration: number;
};

export function ShootingStars() {
  const [shots, setShots] = React.useState<Shot[]>([]);
  const idRef = React.useRef(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number;
    let cancelled = false;

    const schedule = () => {
      const wait = 4000 + Math.random() * 8000; // 4–12s
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (!document.hidden) {
          const id = idRef.current++;
          const shot: Shot = {
            id,
            top: Math.random() * 45,
            left: Math.random() * 80,
            angle: 28 + Math.random() * 18,
            length: 120 + Math.random() * 140,
            duration: 600 + Math.random() * 400,
          };
          setShots((s) => [...s, shot]);
          window.setTimeout(
            () => setShots((s) => s.filter((x) => x.id !== id)),
            shot.duration + 120,
          );
        }
        schedule();
      }, wait);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {shots.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.length}px`,
            transform: `rotate(${s.angle}deg)`,
            animationDuration: `${s.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
