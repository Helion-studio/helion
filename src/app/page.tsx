import { Hero } from "@/components/sections/hero";
import { Showcase } from "@/components/sections/showcase";
import { Story } from "@/components/sections/story";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Showcase />
      <Story />
      {/* next sections mount here */}
    </main>
  );
}
