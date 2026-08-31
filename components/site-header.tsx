import { BrandMark, Wordmark } from "@/components/brand";
import { nav, site } from "@/lib/site";

/**
 * Navy band pinned to the top. Height matches the client reference (86px).
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:h-[86px] lg:px-10">
        <a href="#top" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
          <BrandMark className="size-7 text-white transition-transform duration-700 ease-out group-hover:rotate-90" />
          <Wordmark className="text-[15px] tracking-tight" />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="rounded-full px-3.5 py-2 text-sm text-white/60 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="hidden text-sm text-white/60 transition-colors duration-200 hover:text-white xl:block"
          >
            {site.email}
          </a>
          <a
            href="#contact"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-deep"
          >
            Start your project
          </a>
        </div>
      </div>
    </header>
  );
}
