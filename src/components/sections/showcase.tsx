import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/projects";

/**
 * Landing-page showcase — real project screenshots scrolling in two
 * counter-directional rows (CSS marquee, GPU transform, pauses on hover,
 * static under reduced-motion). Clicking a shot opens the project page.
 */
export async function Showcase() {
  const projects = (await getProjects()).slice(0, 6);
  if (projects.length === 0) return null;

  const rowA = projects.filter((_, i) => i % 2 === 0);
  const rowB = projects.filter((_, i) => i % 2 === 1);
  const doubled = (items: typeof projects) => [...items, ...items]; // seamless -50% loop

  const Card = ({ p }: { p: (typeof projects)[number] }) => (
    <Link
      href={`/work/${p.slug}`}
      className="group relative block w-[78vw] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-[400px]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[#0a0e15]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.thumbnail}
          alt={`${p.name} — ${p.category}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030508]/90 via-transparent to-transparent" />
      <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-[15px] font-semibold tracking-tight text-white">
            {p.name}
          </p>
          <p className="mt-0.5 text-micro tracking-[0.08em] text-white/55 uppercase">
            {p.category} · {p.year}
          </p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#030508]/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );

  return (
    <section aria-label="Selected work" className="relative overflow-hidden py-24 md:py-32">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent md:w-32" />

      <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between px-5 md:px-8">
        <div>
          <p className="flex items-center gap-3 font-display text-tag font-medium tracking-[0.14em] text-white/40 uppercase">
            <span className="font-mono text-arc">02</span>
            <span aria-hidden className="h-px w-10 bg-white/15" />
            Selected work
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

      <div className="marquee-hover-pause space-y-5">
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max gap-5 pr-5">
            {doubled(rowA).map((p, i) => (
              <Card key={`${p.slug}-${i}`} p={p} />
            ))}
          </div>
        </div>
        <div className="marquee-reverse overflow-hidden">
          <div
            className="marquee-track flex w-max gap-5 pr-5"
            style={{ ["--marquee-speed" as string]: "54s" }}
          >
            {doubled(rowB).map((p, i) => (
              <Card key={`${p.slug}-${i}`} p={p} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 px-5 text-center sm:hidden">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-display text-nav font-medium text-white"
        >
          All projects
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
