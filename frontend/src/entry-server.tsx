import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Navigate, Route, Routes } from "react-router-dom";
import { Ambient } from "./components/Ambient";
import { Footer } from "./components/Footer";
import { JourneyBar } from "./components/JourneyBar";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
// Eager imports — no lazy/Suspense in SSR so all pages render their actual HTML
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

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <SSRApp />
    </StaticRouter>,
  );
}
