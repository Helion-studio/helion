import { closingCta, site } from "@/lib/site";
import { ArrowRight, Icon } from "@/components/icons";
import { btnPrimary } from "@/components/ui";

/**
 * Navy band that bookends the page — same colour as the header.
 * Icon + headline left, CTA right.
 */
export function ClosingCta() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`;

  return (
    <section id="contact" className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 lg:flex-row lg:items-center lg:px-10 lg:py-16">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
            <Icon name={closingCta.icon} className="size-[22px]" />
          </div>
          <div>
            <h2 className="text-[clamp(1.35rem,2.6vw,1.85rem)] font-semibold tracking-[-0.02em] text-white">
              {closingCta.heading}
            </h2>
            <p className="mt-1 text-[14.5px] text-white/60">{closingCta.body}</p>
          </div>
        </div>

        <a href={mailto} className={`group ${btnPrimary}`}>
          {closingCta.button.label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
