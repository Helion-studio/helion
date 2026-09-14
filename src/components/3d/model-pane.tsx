"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Model pane — lazy-mounts a 3D scene when it approaches the viewport.
 * If WebGL or the model fails, the generated key-art image takes over so
 * the design never shows a dead pane.
 */
const CarScene = dynamic(
  () => import("@/components/3d/car-scene").then((m) => m.CarScene),
  { ssr: false },
);
const ServerScene = dynamic(
  () => import("@/components/3d/server-scene").then((m) => m.ServerScene),
  { ssr: false },
);

export function ModelPane({
  kind,
  label,
  fallback,
}: {
  kind: "car" | "server";
  label: string;
  fallback: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);

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
      {inView && !failed ? (
        kind === "car" ? (
          <CarScene onFail={onFail} />
        ) : (
          <ServerScene onFail={onFail} />
        )
      ) : failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallback} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full animate-pulse bg-white/[0.02]" aria-label={label} />
      )}
    </div>
  );
}
