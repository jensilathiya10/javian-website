import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/scroll";

const DURATION_MS = 3200;
const LETTERS = "JAVIAN".split("");

/**
 * Brand intro. Mounts with the home page, so it plays on first visit, reload and every
 * return to "/". The page renders underneath while it runs; it removes itself afterwards.
 */
export function Preloader() {
  const [done, setDone] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (done) return;
    document.documentElement.classList.add("preloading");
    // Timer is created/cleared per effect run, so Strict Mode's double mount stays correct.
    const t = window.setTimeout(() => setDone(true), DURATION_MS);
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
