// src/app/works/[tag]/page.tsx
import { getCollectionsByTag } from "@/app/admin/action";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Collection } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = await params;
  if (tag !== "artistic" && tag !== "commercial") {
    notFound();
  }

  const collections: Collection[] = await getCollectionsByTag(tag);

  return (
    <div className="flex flex-col min-h-screen bg-background font-josephin">
      <Header />
      <main className="flex-grow px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-wider capitalize">
              {tag}
            </h1>
          </header>

          {collections.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {collections.map((collection) => (
                <Link
                  href={`/collection/${collection.id}`}
                  key={collection.id}
                  className="block break-inside-avoid group"
                >
                  <div className="relative overflow-hidden">
                    {collection.posterImageCategory === "video" ? (
                      <video
                        src={collection.posterImageUrl}
                        className="w-full h-auto object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={collection.posterImageUrl}
                        alt={collection.title}
                        width={500}
                        height={700}
                        className="w-full h-auto object-cover"
                        data-ai-hint="portfolio image"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center p-4">
                      <h3 className="text-white text-lg text-center font-headline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {collection.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-foreground/70">
              <p>
                No collections found for the &quot;{tag}&quot; category yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
