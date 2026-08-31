export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GitHubMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.91-.88-2.91-2.9 0-.65.23-1.19.61-1.61-.06-.15-.27-.77.06-1.6 0 0 .62-.2 2.03.77a6.9 6.9 0 0 1 1.85-.25c.63 0 1.26.08 1.85.25 1.41-.97 2.03-.77 2.03-.77.33.83.12 1.45.06 1.6.38.42.61.95.61 1.61 0 2.03-1.14 2.7-2.92 2.9.3.26.56.76.56 1.54 0 1.11-.01 2.01-.01 2.29 0 .21.15.46.55.38A7.99 7.99 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Outlined service / feature icons — 24×24, stroke 1.6                */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ServerIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </svg>
  );
}

export function CodeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </svg>
  );
}

export function LayersIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function SparkleIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
      <path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </svg>
  );
}

export function MotionIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.2 8.6v6.8L15.6 12l-5.4-3.4Z" />
    </svg>
  );
}

export function GitBranchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M7 8.2v7.6M9.2 6h3.3a2 2 0 0 1 2 2v.8M17 11.2c0 2.6-2.1 3.5-4.6 3.9" />
    </svg>
  );
}

export function ZapIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <path d="M13 3 5 14h5l-1 7 8-11h-5l1-7Z" />
    </svg>
  );
}

export function GamepadIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <rect x="2" y="7" width="20" height="11" rx="3" />
      <path d="M7 12h4M9 10v4" />
      <path d="M16 11.5h.01M18.5 14h.01" />
    </svg>
  );
}

export function ChatIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...s}>
      <path d="M20 13.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7Z" />
    </svg>
  );
}

/** Resolve an icon name (from lib/site.ts) to its component. */
export function Icon({ name, className = "" }: { name: string; className?: string }) {
  switch (name) {
    case "server":
      return <ServerIcon className={className} />;
    case "code":
      return <CodeIcon className={className} />;
    case "layers":
      return <LayersIcon className={className} />;
    case "sparkle":
      return <SparkleIcon className={className} />;
    case "motion":
      return <MotionIcon className={className} />;
    case "git":
      return <GitBranchIcon className={className} />;
    case "zap":
      return <ZapIcon className={className} />;
    case "gamepad":
      return <GamepadIcon className={className} />;
    case "chat":
      return <ChatIcon className={className} />;
    default:
      return <SparkleIcon className={className} />;
  }
}
