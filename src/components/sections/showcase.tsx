import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/projects";
import { FlipDeck } from "@/components/sections/flip-deck";

/**
 * Landing showcase — server wrapper; the flip-card deck itself is the
 * client component (scroll-driven). No cards, no borders around text:
 * the deck floats on ambient light that fades into the page.
 */
export async function Showcase() {
  const featured = (await getProjects()).slice(0, 4);
  if (featured.length < 2) return null;

  return (
    <section aria-label="Selected work" className="relative overflow-hidden py-24 md:py-32">
      {/* ambient light behind the deck */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-[12%] h-[560px] w-[560px] rounded-full bg-arc/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              <span className="font-mono text-arc">02</span> Selected work
            </p>
            <h2 className="mt-5 max-w-xl font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
              Real systems. <span className="font-medium">Real numbers.</span>
            </h2>
          </div>
          <Link
            href="/work"
            className="group hidden items-center gap-2 font-display text-nav font-medium text-white/60 transition-colors hover:text-white sm:inline-flex"
          >
            All projects
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <FlipDeck projects={featured} className="mt-14 md:mt-20" />
      </div>
    </section>
  );
}
