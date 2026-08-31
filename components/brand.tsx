/**
 * PLACEHOLDER MARK — swap this file when the real logo is approved.
 * Everything imports `BrandMark` from here, so replacing the SVG below
 * rebrands the entire site.
 *
 * Clean geometric "aperture / helion" mark: ring + rays + core.
 */

const RAYS = 8;

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
    >
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.7" />
      <g stroke="currentColor" strokeWidth="1.7">
        {Array.from({ length: RAYS }).map((_, i) => (
          <line
            key={i}
            x1="16"
            y1="3.6"
            x2="16"
            y2="1.4"
            transform={`rotate(${i * (360 / RAYS)} 16 16)`}
          />
        ))}
      </g>
      <circle cx="16" cy="16" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-semibold text-white">Helion</span>
      <span className="font-normal text-white/55"> Studio</span>
    </span>
  );
}

/** Wordmark tuned for light backgrounds. */
export function WordmarkDark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-semibold text-ink">Helion</span>
      <span className="font-normal text-muted"> Studio</span>
    </span>
  );
}
