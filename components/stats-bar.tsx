import { stats } from "@/lib/site";

/** Transitional social-proof band between the hero and services. */
export function StatsBar() {
  return (
    <section aria-label="By the numbers" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-line px-6 lg:px-10">
        {stats.map((stat) => (
          <div key={stat.label} className="px-3 py-10 text-center lg:py-12" title={stat.note}>
            <div className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold tracking-tight text-ink">
              {stat.value}
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
