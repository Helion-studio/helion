import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Story />
        {/* next sections mount here */}
      </main>
    </>
  );
}
