import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        {/* next steps mount here: capabilities → work → team → process → contact */}
      </main>
    </>
  );
}
