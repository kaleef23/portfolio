import Navigation from "@/components/navigation";
import FullScreenSlider from "@/components/full-screen-slider";
import { portfolioItems } from "@/data/portfolio-items";
import { notFound } from "next/navigation";

export default async function SliderPage({ params }: { params: { id: string } }) {
  const getParams = await params;

  const item = portfolioItems.find((p) => p.id.toString() === getParams.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="h-dvh w-dvw flex flex-col bg-white">
      <header className="fixed top-0 left-0 w-full z-20">
        <Navigation />
      </header>
      <main className="flex-1 pt-20 h-full">
        <FullScreenSlider items={portfolioItems} />
      </main>
    </div>
  );
}
