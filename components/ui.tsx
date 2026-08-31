/**
 * Shared button styling so every button on the site shares the same
 * radius, height and hover behaviour.
 */

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap";

export const btnPrimary = `${base} bg-accent text-white hover:bg-accent-deep`;

export const btnGhost = `${base} border border-line-strong bg-white text-ink hover:bg-canvas-alt`;

export const btnOnNavy = `${base} border border-white/20 text-white hover:bg-white/[0.07]`;
