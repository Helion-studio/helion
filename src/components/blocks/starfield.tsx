"use client";

import * as React from "react";

/**
 * Procedural starfield — 3 depth layers + intermittent shooting stars.
 *
 * Performance notes (per spec §8):
 *  - single 2D canvas, no blur filters, no DOM nodes per star
 *  - DPR capped at 2
 *  - rAF pauses when the tab is hidden OR the hero scrolls out of view
 *  - star count scales with viewport area, so phones draw far fewer
 *  - prefers-reduced-motion => stars render once, statically, no shooting stars
 */

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number; // twinkle speed
  ph: number; // phase
  depth: number; // parallax factor
};

type Shooter = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  len: number;
};

export function Starfield({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let raf = 0;
    let running = true;
    let nextShot = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      stars = [];

      // layer 1 — tiny distant
      const far = Math.round(area / 5200);
      for (let i = 0; i < far; i++)
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.35 + Math.random() * 0.35,
          a: 0.25 + Math.random() * 0.3,
          tw: 0.15 + Math.random() * 0.35,
          ph: Math.random() * Math.PI * 2,
          depth: 0.15,
        });

      // layer 2 — mid field
      const mid = Math.round(area / 16000);
      for (let i = 0; i < mid; i++)
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.7 + Math.random() * 0.5,
          a: 0.45 + Math.random() * 0.35,
          tw: 0.4 + Math.random() * 0.6,
          ph: Math.random() * Math.PI * 2,
          depth: 0.4,
        });

      // layer 3 — occasional bright foreground
      const near = Math.round(area / 70000);
      for (let i = 0; i < near; i++)
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.1 + Math.random() * 0.8,
          a: 0.75 + Math.random() * 0.25,
          tw: 0.7 + Math.random() * 0.9,
          ph: Math.random() * Math.PI * 2,
          depth: 1,
        });
    };

    const spawnShooter = () => {
      const fromTop = Math.random() > 0.35;
      const speed = 0.9 + Math.random() * 0.7;
      const angle = (Math.PI / 180) * (28 + Math.random() * 16);
      shooters.push({
        x: fromTop ? Math.random() * w * 0.9 : -60,
        y: fromTop ? -40 : Math.random() * h * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        ttl: 600 + Math.random() * 400,
        len: 90 + Math.random() * 90,
      });
    };

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // eased pointer parallax
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      const t = now / 1000;
      for (const s of stars) {
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * s.tw + s.ph);
        const px = s.x + pointer.x * s.depth * 14;
        const py = s.y + pointer.y * s.depth * 14;
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = s.depth === 1 ? "#eaf4ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduce) {
        if (now > nextShot) {
          spawnShooter();
          nextShot = now + 4000 + Math.random() * 8000; // 4–12s
        }

        shooters = shooters.filter((sh) => sh.life < sh.ttl);
        for (const sh of shooters) {
          sh.life += dt;
          sh.x += sh.vx * dt;
          sh.y += sh.vy * dt;

          const p = sh.life / sh.ttl;
          const fade = Math.sin(Math.PI * p); // ease in and out
          const tailX = sh.x - sh.vx * sh.len;
          const tailY = sh.y - sh.vy * sh.len;

          const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, `rgba(220,240,255,${0.85 * fade})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(sh.x, sh.y);
          ctx.stroke();

          ctx.globalAlpha = fade;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(sh.x, sh.y, 1.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    build();

    if (reduce) {
      draw(performance.now());
      running = false;
    } else {
      nextShot = performance.now() + 2000;
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      build();
      if (reduce) draw(performance.now());
    };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const setRunning = (v: boolean) => {
      if (reduce) return;
      if (v && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      } else if (!v && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onVis = () => setRunning(!document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
