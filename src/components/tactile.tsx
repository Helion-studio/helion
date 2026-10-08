"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Tactile — the store's one button primitive. Makes every CTA *respond*:
 *
 *   hover   → pointer-tracked specular shine + the icon slides forward
 *   press   → sinks to 0.97 on a spring, shine snaps to full brightness
 *   release → a ripple runs out from the exact point you clicked
 *   focus   → visible ring for keyboards (never removed)
 *
 * Implementation notes for perf: the shine rides two CSS custom properties
 * written directly to the node (no React state per pixel, no re-render),
 * the press uses transform-only motion values so it never triggers layout,
 * and the whole thing degrades to a plain static button when the visitor
 * asks for reduced motion. Renders <Link>, <button> or <a> from the same
 * markup so the visual can never drift between uses.
 */
type TactileProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "configure";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function Tactile({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  ariaLabel,
}: TactileProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const rm = useReducedMotion();
  const base =
    variant === "primary" ? "btn-primary" : variant === "configure" ? "btn-configure" : "btn-ghost";

  const follow = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || rm || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.classList.add("is-hot");
  };
  const cool = () => ref.current?.classList.remove("is-hot");

  const ripple = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || rm) return;
    const r = el.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "tactile-ripple";
    dot.style.left = `${e.clientX - r.left}px`;
    dot.style.top = `${e.clientY - r.top}px`;
    el.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
    // hard cap: never leave orphans if the tab is backgrounded mid-press
    setTimeout(() => dot.remove(), 700);
  };

  const press = {
    whileHover: rm ? undefined : { y: -1 },
    whileTap: rm ? undefined : { scale: 0.97, y: 0 },
    transition: rm ? { duration: 0 } : { type: "spring" as const, stiffness: 520, damping: 26, mass: 0.6 },
  };

  const inner = (
    <>
      <span aria-hidden className="tactile-shine" />
      <span aria-hidden className="tactile-label flex items-center gap-2">{children}</span>
    </>
  );

  const cls = `tactile ${base} ${className}`.trim();

  if (href) {
    const external = /^https?:|^mailto:/.test(href);
    if (external) {
      return (
        <motion.a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cls}
          onPointerMove={follow}
          onPointerLeave={cool}
          onPointerDown={ripple}
          {...press}
        >
          {inner}
        </motion.a>
      );
    }
    return (
      <motion.div {...press}>
        <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} className={cls} onPointerMove={follow} onPointerLeave={cool} onPointerDown={ripple}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cls}
      aria-label={ariaLabel}
      onPointerMove={follow}
      onPointerLeave={cool}
      onPointerDown={ripple}
      onClick={onClick}
      {...press}
    >
      {inner}
    </motion.button>
  );
}
