import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Hero />
    </main>
  );
}
