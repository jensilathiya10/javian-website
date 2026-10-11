import { useEffect } from "react";

const setMeta = (selector: string, content: string) =>
  document.querySelector(selector)?.setAttribute("content", content);

export function useDocumentMeta(title: string, description?: string, url?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    const canonical = url ?? window.location.href;
    setMeta('meta[property="og:url"]', canonical);
  }, [title, description, url]);
}
