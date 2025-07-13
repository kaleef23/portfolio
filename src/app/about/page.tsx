
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground font-body flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-20 bg-white">
        <Header />
      </header>
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="md:col-span-2">
              <Image
                src="https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/kai-2961.jpg?updatedAt=1752041049383"
                alt="Portrait of Dele Kaleef"
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                data-ai-hint="photographer portrait"
              />
            </div>
            <div className="md:col-span-3 prose prose-lg max-w-none text-foreground/80 leading-relaxed">
              <h1 className="font-headline text-5xl sm:text-6xl text-foreground mb-6">
                Kaleef Lawal
              </h1>
              <h2 className="font-headline text-2xl text-primary mt-0">
                A Lens on the World
              </h2>
              <p>
                Driven by a passion for capturing the fleeting moments that tell a larger story, I find beauty in the interplay of light, emotion, and environment. My work is an exploration of identity and form, whether in the quiet intensity of a portrait or the dynamic energy of a landscape.
              </p>
              <p>
                From the controlled environment of the studio to the unpredictable nature of the street, I seek to create images that are not just seen, but felt. Each photograph is a dialogue, a connection between myself, the subject, and the viewer.
              </p>
              <p>
                This portfolio is a collection of those conversations. It’s a journey through different worlds, seen through my unique perspective. Thank you for taking the time to explore it.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
