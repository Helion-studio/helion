"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lottie — a ~1.5 KB interpreter for the subset of the format we ship.
 *
 * Why not lottie-web (250 KB min): our workflow icons are simple
 * opacity/position/scale keyframes on shapes, so a browser-native
 * requestAnimationFrame loop over CSS transforms is a far better trade.
 *
 * Supported: fr/ip/op, layers with ks.o (opacity), ks.p (position),
 * ks.s (scale) and simple linear keyframes (`{x:{t,v}}` or `[{t,s,e}]`).
 * Anything it does not understand renders as a static frame, so a real
 * .lottie/json from After Effects never breaks the layout — it just stops
 * animating the parts we skip.
 *
 * Cost: no layout thrash (writes `transform`/`opacity` only), pauses
 * off-screen, never runs under prefers-reduced-motion.
 */

type Anim = {
  v?: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  layers: {
    ty?: number;
    nm?: string;
    ks?: {
      o?: unknown;
      p?: unknown;
      s?: unknown;
    };
  }[];
};

type Props = {
  /** inline animation, or a URL to fetch (e.g. /vps/deploy.lottie.json) */
  data?: Anim | null;
  src?: string;
  className?: string;
  label?: string;
  /** start when in view; also replays on hover/focus */
  playOnView?: boolean;
};

const num = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

/** value at time t for our two keyframe shapes, or a constant */
function sample(prop: unknown, t: number, fallback: number): number {
  if (prop == null) return fallback;
  if (typeof prop === "number") return prop;

  const anyProp = prop as { a?: number; x?: { t: unknown; v: unknown }; k?: unknown };

  // { a: 1, x: { t: [...], v: [...] } } — the shape our generator emits
  if (anyProp.x && typeof anyProp.x === "object") {
    const times = (anyProp.x.t as number[]) ?? [];
    const values = (anyProp.x.v as number[]) ?? [];
    if (!times.length) return fallback;
    if (t <= times[0]) return num(values[0], fallback);
    const last = times.length - 1;
    if (t >= times[last]) return num(values[last], fallback);
    let i = 0;
    while (i < last && times[i + 1] <= t) i++;
    const span = times[i + 1] - times[i] || 1;
    const mix = (t - times[i]) / span;
    return num(values[i], fallback) * (1 - mix) + num(values[i + 1], fallback) * mix;
  }

  // [{ t, s: [v], e: [v] }] — stock lottie keyframes
  if (Array.isArray(anyProp.k) && anyProp.k.length) {
    const keys = anyProp.k as { t: number; s?: number[]; e?: number[] }[];
    const at = (i: number) => num(keys[i].s?.[0] ?? keys[i].e?.[0], fallback);
    if (t <= keys[0].t) return at(0);
    const lastIdx = keys.length - 1;
    if (t >= keys[lastIdx].t) return at(lastIdx);
    let i = 0;
    while (i < lastIdx && keys[i + 1].t <= t) i++;
    const span = keys[i + 1].t - keys[i].t || 1;
    const mix = (t - keys[i].t) / span;
    return at(i) * (1 - mix) + at(i + 1) * mix;
  }

  // { a: 0, k: v } — constant
  return num(anyProp.k as number, fallback);
}

export function Lottie({ data, src, className, label, playOnView = true }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [anim, setAnim] = useState<Anim | null>(data ?? null);

  useEffect(() => {
    if (!src || data) return;
    let dead = false;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: Anim) => {
        if (!dead && json?.layers) setAnim(json);
      })
      .catch(() => {
        /* no file yet — the static fallback renders, nothing breaks */
      });
    return () => {
      dead = true;
    };
  }, [src, data]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !anim) return;

    const nodes = Array.from(host.querySelectorAll<HTMLElement>("[data-layer]"));
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fr = anim.fr || 30;
    const span = Math.max(1, anim.op - anim.ip);
    const layers = anim.layers;

    const paint = (t: number) => {
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const ks = layers[i]?.ks;
        if (!ks) continue;
        const opacity = sample(ks.o, t, 100) / 100;
        const scale = sample(ks.s, t, 100) / 100;
        // position keyframes arrive as { x: [t...], y: [t...] } — optional nudge
        const px = sample((ks.p as { x?: unknown } | undefined)?.x, t, NaN);
        const py = sample((ks.p as { y?: unknown } | undefined)?.y, t, NaN);
        const move = Number.isFinite(px) || Number.isFinite(py);
        el.style.opacity = opacity.toFixed(3);
        el.style.transform =
          `scale(${scale.toFixed(3)})` +
          (move
            ? ` translate(${(Number.isFinite(px) ? px / host.clientWidth : 0) * 100}%, ` +
              `${(Number.isFinite(py) ? py / host.clientHeight : 0) * 100}%)`
            : "");
      }
    };

    paint(anim.ip);
    if (reduced) return; // static, legible frame

    let raf = 0;
    let visible = true;
    let t0 = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    io.observe(host);

    // clock-driven, so playback speed follows the file's frame rate and is
    // identical on a 60 Hz laptop and a 120 Hz phone
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (!t0) t0 = now;
      const t = anim.ip + ((now - t0) / 1000) * fr;
      if (t - anim.ip >= span) t0 = now; // loop from the top
      paint(t);
    };

    if (playOnView) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [anim, playOnView]);

  if (!anim) {
    return (
      <div
        ref={hostRef}
        className={`lottie lottie--empty ${className ?? ""}`}
        role="img"
        aria-label={label ?? "Animation"}
      />
    );
  }

  return (
    <div
      ref={hostRef}
      className={`lottie ${className ?? ""}`}
      style={{ aspectRatio: `${anim.w} / ${anim.h}` }}
      role="img"
      aria-label={label ?? "Animation"}
    >
      {anim.layers.map((layer, i) => (
        <span
          key={`${layer.nm ?? "layer"}-${i}`}
          data-layer={i}
          className={`lottie__layer lottie__layer--${i}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

/**
 * Generator for the small animations we ship — one place, so a real lottie
 * export can replace any of them by dropping the file in public/vps/ and
 * passing `src` instead of `data`.
 */
export function makeAnim(
  frames: number,
  layers: { o?: unknown; p?: unknown; s?: unknown; nm?: string }[],
): Anim {
  return {
    fr: 30,
    ip: 0,
    op: frames,
    w: 120,
    h: 120,
    layers: layers.map((l) => ({
      ty: 4,
      nm: l.nm ?? "layer",
      ks: { o: l.o ?? 100, p: l.p ?? { x: 60, y: 60 }, s: l.s ?? 100 },
    })),
  };
}

/** pulse: opacity 0→1→0 across the timeline (two beats) */
export const pulseOpacity = (frames: number) => ({
  a: 1,
  x: {
    t: [0, frames * 0.25, frames * 0.5, frames * 0.75, frames],
    v: [20, 100, 40, 100, 20],
  },
});

/** scale: grow + settle, used for the "node appears" beat */
export const popScale = (frames: number) => ({
  a: 1,
  x: {
    t: [0, frames * 0.3, frames * 0.55, frames],
    v: [60, 112, 96, 100],
  },
});
