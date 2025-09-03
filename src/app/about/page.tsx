import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground font-josephin font-body flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-20 bg-white">
        <Header />
      </header>
      <main className="flex-grow pt-28 pb-10 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-2">
            <h1 className="font-bold text-lg sm:text-2xl text-foreground">
              About
            </h1>
            {/* <p className="mt-4 text-lg text-foreground/70 max-w-3xl mx-auto">
              Exploring the intersections of identity, culture, and the human condition through the art of photography.
            </p> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:gap-16 prose prose-lg max-w-none text-foreground/80 leading-relaxed">
            {/* Column 1 */}
            <div className="prose">
              <p>
                Kaleef Lawal is a Nigerian-born visual artist and photographer
                based in Berlin. His work explores the intersections of
                identity, tradition, and contemporary expression, drawing from a
                deep-rooted passion for storytelling. For over eight years,
                Kaleef has utilized light, form, and emotion to create images
                that convey meaning beyond words
              </p>
              <p>
                He holds a Certificate in Photography from the Africa Digital
                Media Institute in Nairobi and a BA in Photography from the
                University of Europe for Applied Sciences in Berlin. In 2022,
                Kaleef completed a six-month internship with renowned Dutch
                photographer Erwin Olaf at his Amsterdam studio—an experience
                that deeply influenced his approach to conceptual and staged
                photography
              </p>
            </div>

            {/* Column 2 */}
            <div className="prose">
              <p>
                His work spans portraiture, fashion, and conceptual projects,
                often centered around themes of cultural heritage, mental
                health, and belonging. Whether capturing the bold lines of a
                {"dancer’s "} body or the symbolic power of traditional objects,{" "}
                {"Kaleef’s "} photographs invite viewers to pause, reflect, and
                reconnect with themselves and with culture.
              </p>
              <p>
                {"Kaleef’s "} images have been exhibited internationally and
                recognized with several awards, including the 1st Prize at The
                Art Report Africa Prize (2023), the {"People’s "} Choice Award
                at the BBA Photography Prize (2022), and the MPB European Award
                (2022).
              </p>
            </div>

            {/* Column 3 */}
            <div className="prose">
              <div className="mt-5">
                <h3 className="font-semibold text-lg text-primary mt-0 mb-4">
                  Selected Exhibitions
                </h3>
                <ul className="list-none p-0 space-y-2">
                  <li>
                    2023 - Die Brücke Art Jam, Group show, Berlin Art Week,
                    Berlin, Germany
                  </li>
                  <li>
                    2022 - BBA photography prize, Group Show, BBA gallery,
                    Berlin, Germany
                  </li>
                  <li>
                    2021 - NFT week, Group show, Door Door Gallery, New York,
                    USA
                  </li>
                  <li>
                    2021 - Portrait Show, Group show, Through the Lens
                    Collective Gallery, Johannesburg, South Africa
                  </li>
                </ul>
              </div>
              <div>
                <ul className="list-none p-0 space-y-2">
                  <li>
                    <span className="font-semibold">Instagram</span> - <a href="https://www.instagram.com/delelawalphotog/">delelawalphotog</a>
                  </li>
                  <li>
                    <span className="font-semibold">Linkedin </span> - <a href="https://www.linkedin.com/in/oladelelawal/">Oladele Lawal</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
