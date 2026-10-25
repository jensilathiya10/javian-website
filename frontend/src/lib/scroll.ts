// One passive scroll listener for the whole app; subscribers run once per frame.
type Frame = (y: number, vh: number) => void;

const subs = new Set<Frame>();
let raf = 0;
let bound = false;

function tick() {
  raf = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  subs.forEach((f) => f(y, vh));
}
function schedule() {
  if (!raf) raf = requestAnimationFrame(tick);
}

export function onScrollFrame(fn: Frame): () => void {
  subs.add(fn);
  if (!bound) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    bound = true;
  }
  fn(window.scrollY, window.innerHeight);
  return () => {
    subs.delete(fn);
    if (!subs.size && bound) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      raf = 0;
      bound = false;
    }
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
