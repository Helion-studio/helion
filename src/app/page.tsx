import { Hero } from "@/components/sections/hero";
import { ChromeSpiral } from "@/components/sections/chrome-spiral";
import { Plans, FinalCta } from "@/components/sections/plans";
import { Infrastructure } from "@/components/sections/features";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ChromeSpiral />
      <Plans />
      <Infrastructure />
      <FinalCta />
    </main>
  );
}
