import { useEffect } from "react";

const setMeta = (selector: string, content: string) =>
  document.querySelector(selector)?.setAttribute("content", content);

const setCanonical = (href: string) => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export function useDocumentMeta(title: string, description?: string, url?: string, noindex = false) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    // Use pathname only (no query string or hash) so canonical stays clean.
    const canonical = url ?? (window.location.origin + window.location.pathname);
    setMeta('meta[property="og:url"]', canonical);
    setCanonical(canonical);
    setMeta('meta[name="robots"]', noindex ? "noindex, follow" : "index, follow");
  }, [title, description, url, noindex]);
}
