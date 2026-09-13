"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Model pane — mounts a 3D scene only when it approaches the viewport.
 * The GLB + three.js chunks load lazily, so the initial page never pays
 * for scenes the visitor hasn't scrolled to.
 */
const CarScene = dynamic(
  () => import("@/components/3d/car-scene").then((m) => m.CarScene),
  { ssr: false },
);
const ServerScene = dynamic(
  () => import("@/components/3d/server-scene").then((m) => m.ServerScene),
  { ssr: false },
);

export function ModelPane({ kind, label }: { kind: "car" | "server"; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="pane-3d aspect-[16/10] bg-[#05070c]">
      {inView ? (
        kind === "car" ? (
          <CarScene />
        ) : (
          <ServerScene />
        )
      ) : (
        <div className="h-full w-full animate-pulse bg-white/[0.02]" aria-label={label} />
      )}
    </div>
  );
}
