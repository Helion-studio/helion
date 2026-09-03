import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        {/* next sections mount here */}
      </main>
    </>
  );
}
