import { Hero } from "@/components/sections/hero";
import { ChromeSpiral } from "@/components/sections/chrome-spiral";
import { Plans, Flow, FinalCta } from "@/components/sections/plans";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ChromeSpiral />
      <Plans />
      <Flow />
      <FinalCta />
    </main>
  );
}
