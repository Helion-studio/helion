import { Hero } from "@/components/sections/hero";
import { Showcase } from "@/components/sections/showcase";
import { Story } from "@/components/sections/story";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaBand } from "@/components/sections/cta-band";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Showcase />
      <Story />
      <StatsBand />
      <CtaBand />
    </main>
  );
}
