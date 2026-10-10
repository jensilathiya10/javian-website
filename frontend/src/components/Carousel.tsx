import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { prefersReducedMotion } from "../lib/scroll";

interface Props {
  count: number;
  /** Accessible name, e.g. "Development process". */
  label: string;
  /** Classes for the scroll track; set the card width via the --cw custom property here. */
  trackClass?: string;
  indicator: "dots" | "bar";
  dotLabels?: string[];
  renderItem: (index: number, active: boolean) => ReactNode;
}

interface View {
  active: number; // card that "owns" the current position
  first: number; // first / last substantially visible card
  last: number;
  atStart: boolean;
  atEnd: boolean;
  progress: number;
}

const INITIAL: View = { active: 0, first: 0, last: 0, atStart: true, atEnd: false, progress: 0 };

/**
 * Native CSS scroll-snap carousel. Wheel and vertical touch gestures are never intercepted,
 * so the page keeps scrolling normally; snapping only applies on the horizontal axis.
 * No autoplay and no looping: the arrows stop at the first and last position.
 *
 * Navigation works on real scroll positions, not card indexes: when several cards are visible
 * at once the last few cards share one maximum scroll offset, so stepping by card would stall.
 */
export function Carousel({ count, label, trackClass = "", indicator, dotLabels, renderItem }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(INITIAL);
  const drag = useRef<{ x: number; left: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  /** Scroll offset that places each card at its snap position, clamped to the scrollable range. */
  const positions = useCallback((): number[] => {
    const t = track.current;
    if (!t) return [];
    const max = Math.max(0, t.scrollWidth - t.clientWidth);
    return (Array.from(t.children) as HTMLElement[]).map((el) => {
      const centered = getComputedStyle(el).scrollSnapAlign.includes("center");
      const left = centered ? el.offsetLeft + el.offsetWidth / 2 - t.clientWidth / 2 : el.offsetLeft;
      return Math.min(max, Math.max(0, left));
    });
  }, []);

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return 0;
    const x = t.scrollLeft;
    const max = Math.max(0, t.scrollWidth - t.clientWidth);
    const pos = positions();
    const atStart = x <= 2;
    const atEnd = max <= 2 || x >= max - 2;

    let active = 0;
    let best = Infinity;
    pos.forEach((p, i) => {
      const d = Math.abs(p - x);
      // ties (cards sharing the end position) resolve to the later card only once we are at the end
      if (d < best - 0.5 || (atEnd && d <= best + 0.5)) {
        best = d;
        active = i;
      }
    });
    if (atStart) active = 0;

    // Visible range: cards at least 60% inside the viewport.
    let first = -1;
    let last = -1;
    (Array.from(t.children) as HTMLElement[]).forEach((el, i) => {
      const overlap = Math.min(el.offsetLeft + el.offsetWidth, x + t.clientWidth) - Math.max(el.offsetLeft, x);
      if (overlap >= el.offsetWidth * 0.6) {
        if (first < 0) first = i;
        last = i;
      }
    });
    if (first < 0) first = last = active;

    setView((v) => {
      const next: View = { active, first, last, atStart, atEnd: atEnd && max > 2, progress: max > 0 ? Math.min(1, x / max) : 0 };
      return v.active === next.active && v.first === next.first && v.last === next.last && v.atStart === next.atStart && v.atEnd === next.atEnd && Math.abs(v.progress - next.progress) < 0.002
        ? v
        : next;
    });
    return active;
  }, [positions]);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const on = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), measure()));
    };
    t.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    measure();
    return () => {
      t.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  const scrollToX = useCallback((left: number) => {
    // Animation is pointless in a hidden tab and skipped for reduced motion.
    const behavior = prefersReducedMotion() || document.hidden ? "auto" : "smooth";
    track.current?.scrollTo({ left, behavior });
  }, []);

  const goTo = useCallback((i: number) => {
    const p = positions();
    if (p.length) scrollToX(p[Math.max(0, Math.min(count - 1, i))]);
  }, [count, positions, scrollToX]);

  const step = useCallback((dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const x = t.scrollLeft;
    const stops = Array.from(new Set(positions().map((p) => Math.round(p)))).sort((a, b) => a - b);
    const target = dir === 1 ? stops.find((p) => p > x + 4) : [...stops].reverse().find((p) => p < x - 4);
    if (target !== undefined) scrollToX(target);
  }, [positions, scrollToX]);

  const onKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Home") scrollToX(0);
    else if (e.key === "End") scrollToX(track.current ? track.current.scrollWidth : 0);
    else return;
    e.preventDefault();
  };

  // Mouse dragging (touch and trackpad use native scrolling).
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    const t = track.current;
    if (!d || !t) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      t.setPointerCapture(d.id);
      t.dataset.drag = "true";
    }
    if (d.moved) t.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    const t = track.current;
    if (!d?.moved || !t) return;
    delete t.dataset.drag;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    goTo(measure());
  };

  const range = view.first === view.last ? pad(view.first + 1) : `${pad(view.first + 1)}–${pad(view.last + 1)}`;
  // Cards use the first fully visible card as "active" in bar mode, the centred card in dots mode.
  const highlighted = indicator === "bar" ? view.first : view.active;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        className={`car-track ${trackClass}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        aria-label={`${label}. Use the left and right arrow keys to move between cards.`}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="car-item"
            data-active={i === highlighted}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {renderItem(i, i === highlighted)}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        {indicator === "dots" ? (
          <ol className="flex items-center gap-1" aria-label="Choose a step">
            {Array.from({ length: count }, (_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${dotLabels?.[i] ?? `card ${i + 1}`}`}
                  aria-current={i === view.active ? "step" : undefined}
                  className="car-dot"
                  data-on={i === view.active}
                  data-done={i < view.active}
                >
                  <span />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <span className="eyebrow shrink-0 tabular-nums" aria-hidden>
              {range} / {pad(count)}
            </span>
            <div className="car-bar" aria-hidden>
              <span style={{ width: `${(100 * (view.last - view.first + 1)) / count}%`, left: `${view.progress * (100 - (100 * (view.last - view.first + 1)) / count)}%` }} />
            </div>
          </div>
        )}

        <div className="flex shrink-0 gap-2">
          <button type="button" className="car-btn" aria-label="Previous" aria-disabled={view.atStart} onClick={() => !view.atStart && step(-1)}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" className="car-btn" aria-label="Next" aria-disabled={view.atEnd} onClick={() => !view.atEnd && step(1)}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {indicator === "dots" ? `${dotLabels?.[view.active] ?? label}, ${view.active + 1} of ${count}` : `Showing ${range} of ${count}`}
      </p>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
