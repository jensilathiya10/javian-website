import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Navigate, Route, Routes } from "react-router-dom";
import { Ambient } from "./components/Ambient";
import { Footer } from "./components/Footer";
import { JourneyBar } from "./components/JourneyBar";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
// Eager imports — pages must render full HTML during prerendering
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProjectPage from "./pages/ProjectPage";
import Security from "./pages/Security";
import AIAutomationPage from "./pages/services/AIAutomationPage";
import CustomSoftwarePage from "./pages/services/CustomSoftwarePage";
import WebDesignPage from "./pages/services/WebDesignPage";

function SSRApp() {
  return (
    <>
      <Ambient />
      <Navbar />
      <JourneyBar />
      <main id="main" className="overflow-x-clip">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="/services/web-design-development" element={<WebDesignPage />} />
          <Route path="/services/custom-software-development" element={<CustomSoftwarePage />} />
          <Route path="/services/ai-automation" element={<AIAutomationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/security" element={<Security />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

/** Renders a route to a complete HTML string, waiting for all Suspense/lazy chunks. */
export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        cb();
      },
    });
    writable.on("finish", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    writable.on("error", reject);

    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <SSRApp />
      </StaticRouter>,
      {
        onAllReady() { pipe(writable); },
        onError: reject,
      },
    );
  });
}

// Re-exported so prerender.mjs can call them from the compiled SSR bundle.
export { getRouteMeta, buildRouteJsonLd } from "./lib/siteRoutes";
