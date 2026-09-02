"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Helion mark. Uses next/image so it's optimised + lazy where appropriate.
 * `glow` adds the soft steel halo used in the header and hero.
 */
export function Logo({
  size = 28,
  className,
  glow = false,
  priority = false,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-helion-steel/35 blur-lg"
        />
      )}
      <Image
        src="/logo.png"
        alt="Helion Studio"
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function Wordmark({
  size = 28,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo size={size} glow priority={priority} />
      <span className="text-[0.95rem] font-semibold tracking-tight">
        Helion
        <span className="font-normal text-muted-foreground"> Studio</span>
      </span>
    </span>
  );
}
