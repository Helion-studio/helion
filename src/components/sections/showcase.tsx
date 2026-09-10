import { getProjects } from "@/lib/projects";
import { FlipDeck } from "@/components/sections/flip-deck";

/**
 * Landing showcase — four visual product shots as a locked flip deck.
 * Web products only (the CLI/backend work lives on /work, not here).
 */
const FEATURED = ["ledgerline", "northwind", "quorum", "beacon"];

export async function Showcase() {
  const all = await getProjects();
  const picked = FEATURED.map((s) => all.find((p) => p.slug === s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  if (picked.length < 2) return null;

  return (
    <section aria-label="Selected work" className="relative overflow-hidden">
      {/* ambient light behind the deck */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-[10%] h-[560px] w-[560px] rounded-full bg-arc/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-24 pb-4 md:px-8 md:pt-32">
        <p className="eyebrow">
          <span className="font-mono text-arc">02</span> Selected work
        </p>
        <h2 className="mt-5 max-w-xl font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
          Real systems. <span className="font-medium">Real numbers.</span>
        </h2>
      </div>

      <FlipDeck projects={picked} className="relative" />
    </section>
  );
}
