import { BrandMark, Wordmark } from "@/components/brand";
import { nav, site } from "@/lib/site";
import { ArrowRight } from "@/components/icons";
import { btnPrimary } from "@/components/ui";

/**
 * Split-3 navy bar: brand left · nav centre · CTA right.
 * Height matches the client reference (86px on desktop).
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy">
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto] items-center gap-6 px-6 lg:h-[86px] lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        {/* LEFT — brand lockup */}
        <a href="#top" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
          <BrandMark
            variant="white"
            className="h-8 w-auto transition-opacity duration-200 group-hover:opacity-80"
          />
          <Wordmark className="text-[15px] tracking-tight" />
        </a>

        {/* CENTRE — primary nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="rounded-lg px-1 py-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* RIGHT — primary CTA */}
        <div className="flex items-center justify-end gap-4">
          <a
            href={`mailto:${site.email}`}
            className="hidden text-sm text-white/60 transition-colors duration-200 hover:text-white xl:block"
          >
            {site.email}
          </a>
          <a href="#contact" className={`group ${btnPrimary}`}>
            Start your project
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </header>
  );
}
