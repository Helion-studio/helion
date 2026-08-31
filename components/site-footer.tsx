import { BrandMark } from "@/components/brand";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <BrandMark variant="white" className="h-6 w-auto opacity-70" />
          <span>
            &copy; {year} {site.name}. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={site.repo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-200 hover:text-white"
          >
            GitHub
          </a>
          <a
            href={`mailto:${site.email}`}
            className="transition-colors duration-200 hover:text-white"
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
