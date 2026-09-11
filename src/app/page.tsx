import { Hero } from "@/components/sections/hero";
import { DepthStrip } from "@/components/sections/depth-strip";
import { Story } from "@/components/sections/story";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <DepthStrip />
      <Story />
    </main>
  );
}
