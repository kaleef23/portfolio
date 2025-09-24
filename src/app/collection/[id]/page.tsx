import FullScreenSlider from "@/components/full-screen-slider";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import { getCollection } from "@/app/admin/action";
import { PortfolioItem } from "@/lib/types";

export default async function SliderPage({
  params,
}: {
  params: { id: string };
}) {
  const getParams = await params;

  const collection = await getCollection(getParams.id);

  if (!collection) {
    notFound();
  }

  console.log(collection);
  

  // Adapt collection images to PortfolioItem[]
  const sliderItems: PortfolioItem[] = collection.images.map((img, index) => ({
    id: `${collection.id}-${index}`,
    title: collection.title,
    artistName: 'Dele Kaleef',
    // description: collection.description,
    imageUrl: img.url,
    category: img.category || 'image',
    shopifyUrl: '#',
    width: 'auto',
  }));

  return (
    <div className="h-dvh w-dvw flex flex-col bg-white font-josephin">
      <header className="fixed top-0 left-0 w-full z-20">
        <Header />
      </header>
      <main className="flex-1 pt-20 h-full">
        <FullScreenSlider items={sliderItems} />
      </main>
    </div>
  );
}
