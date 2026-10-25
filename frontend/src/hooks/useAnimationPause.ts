import { useEffect, useRef } from "react";

/**
 * Sets --anim-play to "paused" on the element while it is outside the
 * viewport, and "running" while it is inside. CSS animations reference
 * `animation-play-state: var(--anim-play, running)` to pick it up.
 */
export function useAnimationPause<T extends HTMLElement>(rootMargin = "0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.setProperty("--anim-play", entry.isIntersecting ? "running" : "paused");
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}
