import { services } from "@/lib/site";
import { Icon } from "@/components/icons";

/**
 * Centred section header + 4-column card grid.
 * Cards have no borders — generous padding and type do the work.
 */
export function Services() {
  return (
    <section id="services" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* centred header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {services.eyebrow}
          </p>
          <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-ink">
            {services.headline}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{services.subtitle}</p>
        </div>

        {/* 4-up grid */}
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((item) => (
            <div key={item.title}>
              <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon name={item.icon} className="size-[22px]" />
              </div>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
