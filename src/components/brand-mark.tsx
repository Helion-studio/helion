/**
 * Brand mark — pure CSS, zero bytes. A tilted orbit ring with a satellite
 * dot, matching the mockup's glyph. Replaces the old /logo.png (deleted with
 * every other image): no file to ship, no layout shift, sharp at any size.
 */
export function BrandMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`brand-mark ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <span className="brand-mark__ring" />
      <span className="brand-mark__dot" />
    </span>
  );
}
