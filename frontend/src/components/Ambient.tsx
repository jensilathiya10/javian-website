import { useEffect, useRef } from "react";
import { onScrollFrame, prefersReducedMotion } from "../lib/scroll";

/** Fixed atmospheric lighting. Two gradient fields drift with page progress (transform only). */
export function Ambient() {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    return onScrollFrame((y, vh) => {
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, y / max);
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (reduce) return;
      if (a.current) a.current.style.transform = `translate3d(${(p * 55).toFixed(1)}vw, ${(p * 70).toFixed(1)}vh, 0)`;
      if (b.current) b.current.style.transform = `translate3d(${(-p * 50).toFixed(1)}vw, ${(p * 45).toFixed(1)}vh, 0)`;
    });
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg" aria-hidden>
        <div
          ref={a}
          className="absolute -left-[20vw] -top-[25vh] h-[90vh] w-[90vw] will-change-transform"
          style={{ background: "radial-gradient(closest-side, rgb(128 87 255 / 0.30), transparent)" }}
        />
        <div
          ref={b}
          className="absolute -right-[10vw] top-[5vh] h-[70vh] w-[70vw] will-change-transform"
          style={{ background: "radial-gradient(closest-side, rgb(53 217 255 / 0.14), transparent)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgb(23 20 61 / 0.45))" }} />
      </div>
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent" aria-hidden>
        <div
          ref={bar}
          className="h-full origin-left"
          style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, #8057ff, #35d9ff)" }}
        />
      </div>
    </>
  );
}
