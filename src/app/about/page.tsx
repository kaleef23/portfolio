import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSiteContent } from "../admin/action";

export default async function AboutPage() {

  const siteContent = await getSiteContent();
  const { about } = siteContent;
  const exhibitionsList = about.exhibitions.split('\n').filter(Boolean);

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:gap-16 prose prose-lg max-w-none text-foreground/80 leading-relaxed">
            {/* Column 1 */}
            <div className="prose">
              <p dangerouslySetInnerHTML={{ __html: about.col1.paragraph1.replace(/\n/g, '<br />') }} />
              <p dangerouslySetInnerHTML={{ __html: about.col1.paragraph2.replace(/\n/g, '<br />') }} />
            </div>

            {/* Column 2 */}
            <div className="prose">
              <p dangerouslySetInnerHTML={{ __html: about.col2.paragraph1.replace(/\n/g, '<br />') }} />
              <p dangerouslySetInnerHTML={{ __html: about.col2.paragraph2.replace(/\n/g, '<br />') }} />
            </div>


            {/* Column 3 */}
            <div className="prose">
              <div className="mt-5">
                <h3 className="font-semibold text-lg text-primary mt-0 mb-4">
                  Selected Exhibitions
                </h3>
                <ul className="list-none p-0 space-y-2">
                  {exhibitionsList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
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
