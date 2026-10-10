import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

interface Props {
  count: number;
  /** Accessible name, e.g. "Development process". */
  label: string;
  dotLabels: string[];
  /** Card width as CSS (set responsively via --cw on `className`). */
  className?: string;
  renderItem: (index: number, active: boolean) => ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.6;
const LOCK_MS = 350; // ignore inputs arriving faster than this so the ring never stacks transitions
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 500;
const GAP = 1.04; // neighbour offset as a fraction of card width

/** Shortest signed distance from `active` to `i` around a ring of `n` (range -n/2 … n/2). */
export function ringOffset(i: number, active: number, n: number): number {
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

/** Visual state for a card by ring distance: centre large, neighbours partially visible, rest hidden. */
function poseFor(d: number) {
  const a = Math.abs(d);
  return {
    x: `${d * GAP * 100}%`,
    scale: a === 0 ? 1 : a === 1 ? 0.86 : 0.72,
    opacity: a === 0 ? 1 : a === 1 ? 0.5 : 0,
    filter: `blur(${a === 0 ? 0 : a === 1 ? 2.5 : 6}px)`,
  };
}

/**
 * Infinite ring carousel. Every card sits in one grid cell and is positioned by its circular
 * distance from the active index, so the loop has no clones, no blank slide and no reset: the card
 * that wraps from one side to the other does so while fully transparent (its transition is skipped).
 */
export function RingCarousel({ count, label, dotLabels, className = "", renderItem }: Props) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const lastMove = useRef(0);
  const dragged = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const prevOffsets = useRef<number[]>(Array.from({ length: count }, (_, i) => ringOffset(i, 0, count)));

  // Remember each card's previous ring distance so a wrap (far jump) can skip its animation.
  useEffect(() => {
    prevOffsets.current = Array.from({ length: count }, (_, i) => ringOffset(i, active, count));
  }, [active, count]);

  // Cards that are aria-hidden must not be reachable by keyboard either: park their focusables.
  useEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>(".ring-item").forEach((el, i) => {
      const live = ringOffset(i, active, count) === 0;
      el.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, [tabindex]").forEach((f) => {
        if (live) f.removeAttribute("tabindex");
        else f.tabIndex = -1;
      });
    });
  }, [active, count]);

  const go = useCallback(
    (to: number) => {
      const now = performance.now();
      if (now - lastMove.current < LOCK_MS) return;
      lastMove.current = now;
      setActive(((to % count) + count) % count);
    },
    [count],
  );
  const step = (dir: 1 | -1) => go(active + dir);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(count - 1);
    else return;
    e.preventDefault();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE_DISTANCE || info.velocity.x <= -SWIPE_VELOCITY) step(1);
    else if (info.offset.x >= SWIPE_DISTANCE || info.velocity.x >= SWIPE_VELOCITY) step(-1);
    // keep suppressing the click that follows a drag for one tick
    setTimeout(() => (dragged.current = false), 0);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        className="relative overflow-hidden py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#8fb0ff]/60 rounded-3xl"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${label}. Use the left and right arrow keys to move between stages.`}
      >
        <motion.div
          ref={stage}
          className="grid cursor-grab touch-pan-y select-none active:cursor-grabbing"
          drag="x"
          dragSnapToOrigin
          dragElastic={0.18}
          dragMomentum={false}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={onDragEnd}
        >
          {Array.from({ length: count }, (_, i) => {
            const d = ringOffset(i, active, count);
            const isActive = d === 0;
            const wrapped = Math.abs(d - prevOffsets.current[i]) > 2.5; // jumped across the ring
            const pose = poseFor(d);
            return (
              <motion.div
                key={i}
                className={`ring-item col-start-1 row-start-1 w-[var(--cw)] justify-self-center will-change-transform ${className}`}
                data-active={isActive}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!isActive}
                initial={false}
                animate={pose}
                transition={reduce || wrapped ? { duration: 0 } : { duration: DURATION, ease: EASE }}
                style={{ zIndex: 10 - Math.round(Math.abs(d)), pointerEvents: Math.abs(d) <= 1 ? "auto" : "none" }}
                onClickCapture={(e) => {
                  if (dragged.current) {
                    e.stopPropagation();
                    return;
                  }
                  if (!isActive) {
                    e.stopPropagation();
                    go(i);
                  }
                }}
              >
                {renderItem(i, isActive)}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <ol className="flex items-center gap-1" aria-label="Choose a step">
          {Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${dotLabels[i] ?? `stage ${i + 1}`}`}
                aria-current={i === active ? "step" : undefined}
                className="car-dot"
                data-on={i === active}
                data-done={i < active}
              >
                <span />
              </button>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="car-btn" aria-label="Previous" onClick={() => step(-1)}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" className="car-btn" aria-label="Next" onClick={() => step(1)}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {`${dotLabels[active] ?? label}, ${active + 1} of ${count}`}
      </p>
    </div>
  );
}
