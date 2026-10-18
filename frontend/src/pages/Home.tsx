import { Founders } from "../components/Founders";
import { Preloader } from "../components/Preloader";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { About } from "../sections/About";
import { AI } from "../sections/AI";
import { Contact } from "../sections/Contact";
import { Hero } from "../sections/Hero";
import { Process } from "../sections/Process";
import { Services } from "../sections/Services";
import { Solutions } from "../sections/Solutions";
import { Work } from "../sections/Work";

export default function Home() {
  useDocumentMeta(
    "Javian Technologies — Software, Business Systems & AI",
    "Javian Technologies builds reliable, scalable web and mobile products, custom business software, AI-powered automation and SaaS platforms.",
    "https://javiantech.com/",
  );
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://javiantech.com/",
    "name": "Javian Technologies — Software, Business Systems & AI",
    "description": "Javian Technologies builds reliable, scalable web and mobile products, custom business software, AI-powered automation and SaaS platforms.",
    "url": "https://javiantech.com/",
    "isPartOf": { "@id": "https://javiantech.com/#website" },
    "about": { "@id": "https://javiantech.com/#organization" },
  });
  return (
    <>
      <Preloader />
      <Hero />
      {/* Pulled up so the next section slides over the fading hero zoom (no empty gap). */}
      <div className="relative z-20 [@media(prefers-reduced-motion:no-preference)]:-mt-[55svh]">
        <Services />
        <Solutions />
        <AI />
        <Work />
        <Process />
        <About />
        <Founders />
        <Contact />
      </div>
    </>
  );
}
