import { useEffect } from "react";

const SCRIPT_ID = "page-jsonld";

/** Injects a JSON-LD <script> into <head> and removes it on unmount or when data changes. */
export function useJsonLd(data: object | null) {
  useEffect(() => {
    if (!data) {
      document.getElementById(SCRIPT_ID)?.remove();
      return;
    }
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = SCRIPT_ID;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, [JSON.stringify(data)]); // eslint-disable-line react-hooks/exhaustive-deps
}
