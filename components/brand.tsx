import Image from "next/image";

/**
 * Helion mark.
 *
 * Two variants exist because the original mark is ~62% dark tones — it loses
 * all definition on the navy header/footer bands.
 *
 *  - "white" → knockout silhouette, for navy / dark backgrounds
 *  - "color" → the original full-colour mark, for light backgrounds
 *
 * Source assets live in /public. Intrinsic ratio is 980×808.
 */

const MARK_WIDTH = 512;
const MARK_HEIGHT = 422; // keeps the 980:808 aspect

export function BrandMark({
  className = "",
  variant = "white",
}: {
  className?: string;
  variant?: "color" | "white";
}) {
  return (
    <Image
      src={variant === "color" ? "/helion-mark.png" : "/helion-mark-white.png"}
      alt=""
      aria-hidden="true"
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      className={className}
    />
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
