import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/scroll";

const DURATION_MS = 3200;
const LETTERS = "JAVIAN".split("");
const SESSION_KEY = "jv_preloaded";

export function Preloader() {
  const [done, setDone] = useState(() => {
    if (prefersReducedMotion()) return true;
    try { if (sessionStorage.getItem(SESSION_KEY)) return true; } catch { /* private mode */ }
    return false;
  });

  useEffect(() => {
    if (done) return;
    document.documentElement.classList.add("preloading");
    const t = window.setTimeout(() => {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* private mode */ }
      setDone(true);
    }, DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove("preloading");
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      className="preloader"
      aria-hidden
      data-testid="preloader"
      onAnimationEnd={(e) => e.target === e.currentTarget && setDone(true)}
    >
      <div className="preloader-inner">
        <div className="preloader-word">
          {LETTERS.map((c, i) => (
            <span key={i} className="preloader-letter" style={{ ["--i" as string]: i }}>
              {c}
            </span>
          ))}
        </div>
        <div className="preloader-sweep" />
        <div className="preloader-sub">TECHNOLOGIES</div>
      </div>
    </div>
  );
}
