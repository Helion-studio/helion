"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient particle field — desktop only (coarse pointers get nothing:
 * speed over sparkle on low-end phones).
 *
 * Motion: a gentle flow field (cheap curl-ish noise from sin/cos of
 * position + time) keeps every mote drifting on its own slow path, and
 * the cursor pushes particles aside — the page literally feels you.
 * Nearby motes still link up with faint lines. Pauses off-screen and
 * under prefers-reduced-motion.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return; // touch: skip entirely
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let visible = true;
    const mouse = { x: -1e4, y: -1e4 };

    type P = { x: number; y: number; z: number; vx: number; vy: number };
    let ps: P[] = [];

    const spawn = () => {
      ps = Array.from({ length: 64 }, () => {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 0.05;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 400 - 200,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!ps.length) spawn();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      t += 0.016;

      ctx.clearRect(0, 0, w, h);

      const near: number[] = [];
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // flow field — every mote walks its own slow path
        const a = Math.sin(p.y * 0.004 + t * 0.25) * Math.PI;
        const b = Math.cos(p.x * 0.004 - t * 0.2) * Math.PI;
        p.vx += Math.cos(a + b) * 0.0016;
        p.vy += Math.sin(a + b) * 0.0016;

        // the cursor pushes matter aside
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const d = Math.sqrt(d2) + 0.01;
          const f = (1 - d / 140) * 0.08;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
          near.push(i);
        } else if (d2 < 260 * 260) {
          near.push(i);
        }

        // damp + speed cap
        p.vx *= 0.985;
        p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.4) {
          p.vx = (p.vx / sp) * 0.4;
          p.vy = (p.vy / sp) * 0.4;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;

        const depth = (p.z + 200) / 400;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.7 + depth * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${(0.12 + depth * 0.4).toFixed(3)})`;
        ctx.fill();
      }

      // link lines where the cursor has gathered attention
      const links = new Uint8Array(ps.length);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.lineWidth = 1;
      for (let a = 0; a < near.length; a++) {
        const i = near[a];
        for (let b = a + 1; b < near.length; b++) {
          const j = near[b];
          if (links[i] >= 3 || links[j] >= 3) continue;
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          if (dx * dx + dy * dy < 130 * 130) {
            links[i]++;
            links[j]++;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
