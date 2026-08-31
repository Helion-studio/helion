import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ClosingCta } from "@/components/closing-cta";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
