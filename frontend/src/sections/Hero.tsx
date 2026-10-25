import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { HeroVisual } from "../components/HeroVisual";
import { onScrollFrame, prefersReducedMotion } from "../lib/scroll";

const HEADLINE = "WE BUILD TECHNOLOGY FOR WHAT COMES NEXT.".split(" ");
const GRAD_FROM = Infinity; // plain white headline

/**
 * Scroll-linked hero: the section is taller than the viewport and its content is sticky.
 * Scrolling through the extra height zooms the J network toward the camera while the text fades;
 * the whole scene then fades out as the next section scrolls in.
 */
export function Hero() {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const progress = useMemo(() => ({ v: 0, get() { return this.v; } }), []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    return onScrollFrame((_y, vh) => {
      const el = wrap.current;
      if (!el) return;
      const span = Math.max(1, el.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span));
      progress.v = p;
      const fadeText = Math.min(1, p / 0.5);
      if (copy.current) {
        copy.current.style.opacity = String(1 - fadeText);
        copy.current.style.transform = `translate3d(0, ${(-fadeText * 40).toFixed(1)}px, 0)`;
        copy.current.style.pointerEvents = fadeText > 0.6 ? "none" : "";
      }
      if (stage.current) stage.current.style.opacity = String(1 - Math.min(1, Math.max(0, (p - 0.6) / 0.4)));
    });
  }, [progress]);

  return (
    <section id="top" ref={wrap} className="relative overflow-x-clip [@media(prefers-reduced-motion:no-preference)]:h-[200svh]">
      <div ref={stage} className="sticky top-0 flex h-[100svh] min-h-[560px] items-center overflow-hidden pt-28 pb-10 md:pt-32">
      <HeroVisual progress={progress} />
      <div ref={copy} className="container-x relative z-10 w-full will-change-transform">
        <div className="max-w-4xl">
          <p className="eyebrow enter mb-6" style={{ ["--d" as string]: "100ms" }}>
            JAVIAN TECHNOLOGIES
          </p>
          <h1 className="display text-[clamp(2.4rem,min(6.4vw,9vh),5.4rem)]" aria-label="Custom software development and AI automation — we build technology for what comes next">
            {HEADLINE.map((w, i) => (
              <span key={i} className="word mr-[0.22em]" aria-hidden>
                <span className={i >= GRAD_FROM ? "grad-text" : undefined} style={{ ["--i" as string]: i }}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p className="enter mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg" style={{ ["--d" as string]: "650ms" }}>
            Custom software development, web and mobile products, AI automation
            and business systems — engineered for growing businesses.
          </p>
          <div className="enter mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "800ms" }}>
            <Link to={{ pathname: "/", hash: "contact" }} className="btn btn-primary justify-center">
              Start a Project <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link to={{ pathname: "/", hash: "work" }} className="link-arrow justify-center">
              Explore Our Work <span className="arrow arrow-down" aria-hidden>↓</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
