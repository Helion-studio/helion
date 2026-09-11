import { Hero } from "@/components/sections/hero";
import { ChromeSpiral } from "@/components/sections/chrome-spiral";
import { Services, FinalCta } from "@/components/sections/services";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ChromeSpiral />
      <Services />
      <FinalCta />
    </main>
  );
}
