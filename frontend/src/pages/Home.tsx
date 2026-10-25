import { Founders } from "../components/Founders";
import { Preloader } from "../components/Preloader";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { getRouteMeta } from "../lib/siteRoutes";
import { About } from "../sections/About";
import { AI } from "../sections/AI";
import { Contact } from "../sections/Contact";
import { Hero } from "../sections/Hero";
import { HomeFAQ } from "../sections/HomeFAQ";
import { Process } from "../sections/Process";
import { Services } from "../sections/Services";
import { Solutions } from "../sections/Solutions";
import { Work } from "../sections/Work";

const HOME = getRouteMeta("/")!;

export default function Home() {
  useDocumentMeta(HOME.title, HOME.description, HOME.canonical);
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": HOME.canonical,
    "name": HOME.title,
    "description": HOME.description,
    "url": HOME.canonical,
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
        <HomeFAQ />
        <Contact />
      </div>
    </>
  );
}
