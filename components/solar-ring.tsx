/** Decorative geometric visual — a slowly rotating wireframe "aperture". */

function polygon(cx: number, cy: number, r: number, sides: number, rotation = 0) {
  return Array.from({ length: sides })
    .map((_, i) => {
      const angle = ((i * 360) / sides + rotation - 90) * (Math.PI / 180);
      return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
    })
    .join(" ");
}

function rays(cx: number, cy: number, inner: number, outer: number, count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const a = ((i * 360) / count - 90) * (Math.PI / 180);
    return (
      <line
        key={i}
        x1={cx + inner * Math.cos(a)}
        y1={cy + inner * Math.sin(a)}
        x2={cx + outer * Math.cos(a)}
        y2={cy + outer * Math.sin(a)}
      />
    );
  });
}

export function SolarRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className={className}>
      <g className="spin-cw">
        <circle
          cx="200"
          cy="200"
          r="188"
          stroke="rgba(14,18,28,0.10)"
          strokeWidth="1"
          strokeDasharray="1 13"
        />
      </g>

      <circle cx="200" cy="200" r="150" stroke="rgba(14,18,28,0.07)" strokeWidth="1" />
      <circle cx="200" cy="200" r="58" stroke="rgba(14,18,28,0.07)" strokeWidth="1" />

      <g stroke="rgba(14,18,28,0.10)" strokeWidth="1">
        {rays(200, 200, 152, 164, 24)}
      </g>

      <g className="spin-ccw">
        <polygon
          points={polygon(200, 200, 118, 6)}
          stroke="rgba(30,85,254,0.22)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <polygon
          points={polygon(200, 200, 118, 6, 30)}
          stroke="rgba(30,85,254,0.11)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <polygon
          points={polygon(200, 200, 92, 3)}
          stroke="rgba(14,18,28,0.10)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>

      <g className="spin-cw">
        <polygon
          points={polygon(200, 200, 92, 3, 180)}
          stroke="rgba(14,18,28,0.08)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>

      <circle cx="200" cy="200" r="3.5" fill="#1e55fe" opacity="0.75" />
    </svg>
  );
}
