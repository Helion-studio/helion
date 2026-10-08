import { BrandMark } from "@/components/brand-mark";
import Link from "next/link";
import { site } from "@/lib/site";

/** Site footer — brand, routes, contact, socials. */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-void">
      <div className="mx-auto max-w-7xl px-5 pt-12 md:px-8">
        <p aria-hidden className="footer-wordmark font-display">
          {site.fullName.toUpperCase()}
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark size={24} />
            <span className="font-display text-sm font-medium tracking-[0.18em] text-white uppercase">
              {site.name} {site.suffix}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-body leading-relaxed text-white/50">
            {site.description}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="font-display text-micro font-medium tracking-[0.14em] text-white/35 uppercase">
            VPS
          </p>
          {site.nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-body text-white/60 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="text-body text-white/60 transition-colors hover:text-white"
          >
            Contact
          </a>
        </nav>

        <div className="flex flex-col gap-3">
          <p className="font-display text-micro font-medium tracking-[0.14em] text-white/35 uppercase">
            Reach us
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-body text-white/60 transition-colors hover:text-white"
          >
            {site.email}
          </a>
          <p className="text-body text-white/60">{site.tagline}</p>
          <div className="mt-2 flex gap-5">
            <a href={site.social.github} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              GitHub
            </a>
            <a href={site.social.x} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              X
            </a>
            <a href={site.social.status} className="text-micro tracking-wide text-white/40 uppercase transition-colors hover:text-white">
              Status
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
          <p className="text-micro tracking-wide text-white/35">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p className="text-micro tracking-wide text-white/35">
            Engineered in-house. No templates were harmed.
          </p>
        </div>
      </div>

      {/* the quiet ending — one mark, centered, after everything */}
      <div className="flex justify-center px-5 pt-12 pb-14">
        <Link
          href="/"
          aria-label={`${site.fullName} — back to top`}
          className="opacity-80 transition-opacity duration-300 hover:opacity-100"
        >
          <BrandMark size={30} />
        </Link>
      </div>
    </footer>
  );
}
