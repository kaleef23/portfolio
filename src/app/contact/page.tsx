
import Header from "@/components/header";
import ContactForm from "@/components/contact-form";
import { Mail, Phone, Instagram, Twitter, Linkedin } from 'lucide-react';
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground font-body flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-20 bg-white">
        <Header />
      </header>
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-headline text-center mb-12">{"Let's Chat!"}</h1>
          
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>

          <div className="mt-20 border-t border-border pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-headline mb-6">Contact</h2>
              <div className="space-y-4 text-foreground/80">
                <a
                  href="mailto:kaleef.lawal@gmail.com"
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>kaleef.lawal@gmail.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>(+49) 0176 20619491</span>
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-headline mb-6">Follow</h2>
              <div className="space-y-4 text-foreground/80">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
                 <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
