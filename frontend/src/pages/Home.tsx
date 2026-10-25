import { lazy, Suspense } from "react";
import { Preloader } from "../components/Preloader";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { getRouteMeta } from "../lib/siteRoutes";
import { About } from "../sections/About";
import { AI } from "../sections/AI";
import { Hero } from "../sections/Hero";
import { Process } from "../sections/Process";
import { Services } from "../sections/Services";
import { Solutions } from "../sections/Solutions";
import { Work } from "../sections/Work";

// Lazy-loaded: below the fold, split into separate JS chunks
const LazyFounders = lazy(() => import("../components/Founders").then(m => ({ default: m.Founders })));
const LazyHomeFAQ = lazy(() => import("../sections/HomeFAQ").then(m => ({ default: m.HomeFAQ })));
const LazyContact = lazy(() => import("../sections/Contact").then(m => ({ default: m.Contact })));

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
        <Suspense fallback={<div className="min-h-[640px]" />}>
          <LazyFounders />
        </Suspense>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <LazyHomeFAQ />
        </Suspense>
        <Suspense fallback={<div className="min-h-[480px]" />}>
          <LazyContact />
        </Suspense>
      </div>
    </>
  );
}
