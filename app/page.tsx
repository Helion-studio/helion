import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { Services } from "@/components/services";
import { ClosingCta } from "@/components/closing-cta";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
