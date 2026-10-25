import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type SocialKind = "linkedin" | "x" | "email";

interface Founder {
  name: string;
  role: string;
  bio: string;
  photo: string;
  /** Placeholder silhouette colour (shown until a real photo exists). */
  tint: string;
  /** Only add verified links: { kind: "linkedin", href: "https://…" } or { kind: "email", href: "mailto:…" }. */
  socials: { kind: SocialKind; href: string }[];
}

// Roles and bios are editable placeholders, not confirmed facts. Photos live in public/images/founders/.
const FOUNDERS: Founder[] = [
  {
    name: "Abhi",
    role: "Co-Founder",
    bio: "Focuses on collaboration, innovation, and turning ideas into practical digital solutions.",
    photo: "/images/founders/abhi-2.jpg",
    tint: "#4d4378",
    socials: [{ kind: "linkedin", href: "https://www.linkedin.com/in/abhikheni8" }],
  },
  {
    name: "Jensi",
    role: "Co-Founder",
    bio: "Builds modern digital experiences and scalable software solutions with a focus on thoughtful design and reliable technology.",
    photo: "/images/founders/jensi.jpg",
    tint: "#384e6b",
    socials: [{ kind: "linkedin", href: "https://www.linkedin.com/in/jensi-lathiya-371a25231" }],
  },
  {
    name: "Avi",
    role: "Co-Founder",
    bio: "Helps shape Javian's vision and strategy, bringing ideas to life through meaningful technology.",
    photo: "/images/founders/avi.jpg",
    tint: "#386b5f",
    socials: [{ kind: "linkedin", href: "https://www.linkedin.com/in/avi-kheni" }],
  },
];

const SOCIAL_LABEL: Record<SocialKind, string> = { linkedin: "LinkedIn", x: "X", email: "Email" };
const SOCIAL_ICON: Record<SocialKind, ReactNode> = {
  linkedin: <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM20.44 13.4c0-3.1-1.65-4.55-3.85-4.55a3.3 3.3 0 0 0-2.99 1.65V8.5h-3.37V20h3.37v-6.1c0-1.6.3-3.15 2.3-3.15 1.96 0 1.99 1.83 1.99 3.25V20h3.37v-6.6Z" />,
  x: <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z" />,
  email: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2 .6v.28l7 4.9 7-4.9V7.1l-7 4.9-7-4.9Z" />,
};

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#8fb0ff";
const HEADING = "The people behind Javian.".split(" ");

/** Entrance choreography (seconds). Everything is driven from one in-view trigger so it reads as one sequence. */
const T = { glow: 0, eyebrow: 0.15, heading: 0.35, line: 0.8, subtitle: 0.95, cards: 1.05, cardStep: 0.16 };
const SMALL = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
const DIST = SMALL ? 14 : 26;
const TILT_MAX = 2.5; // degrees

// Fixed positions (percent) so decoration never shifts layout and renders identically every time.
const PARTICLES = [
  { x: 6, y: 18, s: 3, d: 0 }, { x: 18, y: 72, s: 2, d: 1.4 }, { x: 31, y: 10, s: 2, d: 2.6 },
  { x: 44, y: 86, s: 3, d: 0.8 }, { x: 57, y: 24, s: 2, d: 3.2 }, { x: 69, y: 78, s: 3, d: 1.9 },
  { x: 82, y: 14, s: 2, d: 0.4 }, { x: 93, y: 66, s: 3, d: 2.2 },
];
const NODES: [number, number][] = [[8, 30], [24, 14], [41, 38], [58, 12], [76, 34], [92, 16]];

/** Variants driven by a shared `show` flag; `custom` carries each element's delay. */
const rise = {
  out: { opacity: 0, y: DIST },
  in: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: d } }),
};
const maskUp = {
  out: { y: "110%" },
  in: (d: number) => ({ y: "0%", transition: { duration: 0.9, ease: EASE, delay: d } }),
};
const portraitReveal = {
  out: { clipPath: "inset(100% 0% 0% 0%)" },
  in: (d: number) => ({ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: EASE, delay: d } }),
};
const imageSettle = {
  out: { scale: 1.18 },
  in: (d: number) => ({ scale: 1, transition: { duration: 1.4, ease: EASE, delay: d } }),
};
const lightSweep = {
  out: { x: "-160%", opacity: 0 },
  in: (d: number) => ({ x: "320%", opacity: [0, 1, 0], transition: { duration: 1.2, ease: "easeInOut" as const, delay: d + 0.35 } }),
};

function SocialIcon({ kind }: { kind: SocialKind }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden focusable="false">
      {SOCIAL_ICON[kind]}
    </svg>
  );
}

function Portrait({ founder }: { founder: Founder }) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    // Silhouette shown until the real photo file is added.
    <div className="absolute inset-0 bg-gradient-to-br from-[#16181f] to-[#0a0a0c]" aria-hidden>
      <div className="absolute left-1/2 top-[14%] aspect-square w-[34%] -translate-x-1/2 rounded-full" style={{ background: founder.tint }} />
      <div className="absolute left-1/2 top-[46%] aspect-[1.2/1] w-[66%] -translate-x-1/2 rounded-t-full" style={{ background: founder.tint }} />
    </div>
  ) : (
    <img
      src={founder.photo}
      alt={`Portrait of ${founder.name}`}
      width={640}
      height={800}
      sizes="(min-width: 768px) 33vw, 100vw"
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
      className="h-full w-full object-cover"
    />
  );
}

function FounderCard({ founder, index, show, reduce }: { founder: Founder; index: number; show: boolean; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const raf = useRef(0);
  const base = T.cards + index * T.cardStep;
  const state = { initial: reduce ? false : "out", animate: reduce || show ? "in" : "out" } as const;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Pointer-reactive light + tilt: written straight to CSS variables (no React state), mouse only.
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el || reduce || e.pointerType !== "mouse" || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * TILT_MAX).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <li ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="group relative [--rx:0deg] [--ry:0deg] [--mx:50%] [--my:40%]">
      {/* Tilt target: portrait + frame only, never the text or the page. */}
      <div className="relative aspect-[4/5] transition-transform duration-500 ease-out will-change-transform [transform:perspective(1000px)_rotateX(var(--rx))_rotateY(var(--ry))] motion-reduce:transform-none [@media(hover:none)]:transform-none">
        <motion.div
          {...state}
          custom={base}
          variants={portraitReveal}
          className="absolute inset-0 overflow-hidden rounded-3xl bg-[#101116]"
        >
          <motion.div {...state} custom={base} variants={imageSettle} className="absolute inset-0">
            <div className="h-full w-full grayscale-[0.85] transition duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0 group-hover:brightness-110 group-focus-within:scale-[1.05] group-focus-within:grayscale-0 group-focus-within:brightness-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100">
              <Portrait founder={founder} />
            </div>
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/55 to-transparent" />
          {/* Studio light that follows the pointer (mouse only; static glow on keyboard focus). */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{ background: "radial-gradient(circle at var(--mx) var(--my), rgb(143 176 255 / 0.22), transparent 55%)" }}
            aria-hidden
          />
          {/* One-time cinematic light sweep during the reveal. */}
          {!reduce && (
            <motion.div
              {...state}
              custom={base}
              variants={lightSweep}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              aria-hidden
            />
          )}
        </motion.div>
        {/* Illuminated border + layered glow on hover/focus. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            background: "linear-gradient(140deg, rgb(143 176 255 / 0.9), rgb(143 176 255 / 0.05) 45%, rgb(128 87 255 / 0.5))",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            boxShadow: "0 0 30px -6px rgb(143 176 255 / 0.35), 0 0 80px -20px rgb(128 87 255 / 0.4)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-line" aria-hidden />
      </div>

      <div className="px-1 pt-5">
        <motion.h3
          {...state}
          custom={base + 0.45}
          variants={rise}
          className="text-xl font-bold text-ink md:text-2xl"
        >
          <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-1 group-focus-within:-translate-y-1 motion-reduce:transform-none">
            {founder.name}
          </span>
        </motion.h3>
        <motion.div {...state} custom={base + 0.55} variants={rise}>
          <p className="eyebrow mt-1 !text-[#8fb0ff]">{founder.role}</p>
          <span
            className="mt-2 block h-px w-8 transition-[width] duration-500 ease-out group-hover:w-20 group-focus-within:w-20 motion-reduce:transition-none"
            style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
            aria-hidden
          />
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{founder.bio}</p>
          {founder.socials.length > 0 && (
            <ul className="mt-4 flex gap-1" aria-label={`${founder.name}'s links`}>
              {founder.socials.map((s, i) => (
                <li
                  key={s.href}
                  className="translate-y-0.5 opacity-70 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transform-none"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <a
                    href={s.href}
                    target={s.kind === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} on ${SOCIAL_LABEL[s.kind]}`}
                    className="group/icon relative grid h-9 w-9 place-items-center rounded-full text-zinc-400 outline-none transition-colors hover:text-[#8fb0ff] focus-visible:text-[#8fb0ff] focus-visible:ring-2 focus-visible:ring-[#8fb0ff]/70"
                  >
                    <span className="transition-transform duration-300 group-hover/icon:-translate-y-0.5 motion-reduce:transform-none">
                      <SocialIcon kind={s.kind} />
                    </span>
                    <span className="absolute inset-x-2 bottom-1 h-px origin-center scale-x-0 bg-[#8fb0ff] transition-transform duration-300 group-hover/icon:scale-x-100 group-focus-visible/icon:scale-x-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </li>
  );
}

export function Founders() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const show = useInView(root, { once: true, amount: 0.25 });
  const state = { initial: reduce ? false : "out", animate: reduce || show ? "in" : "out" } as const;

  return (
    <section
      id="founders"
      ref={root}
      aria-labelledby="founders-title"
      className="relative isolate overflow-hidden bg-[#0a0a0c] py-16 md:py-24 [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]"
    >
      {/* Ambient environment: drifting light fields, particles, faint constellation and a travelling accent line. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <motion.div
          {...state}
          custom={T.glow}
          variants={{ out: { opacity: 0 }, in: (d: number) => ({ opacity: 1, transition: { duration: 1.6, delay: d } }) }}
          className="absolute inset-0"
        >
          <div className="founder-drift absolute -left-[12%] top-[6%] h-[62%] w-[55%] rounded-full opacity-[0.16]" style={{ background: "radial-gradient(closest-side, #8fb0ff, transparent)" }} />
          <div className="founder-drift-b absolute -right-[12%] bottom-0 h-[62%] w-[55%] rounded-full opacity-[0.14]" style={{ background: "radial-gradient(closest-side, #8057ff, transparent)" }} />
          <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(closest-side, #35d9ff, transparent)" }} />
          <svg className="absolute inset-x-0 top-0 h-[26%] w-full opacity-40" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline points={NODES.map((n) => n.join(",")).join(" ")} fill="none" stroke="rgb(143 176 255 / 0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="founder-particle absolute rounded-full bg-[#8fb0ff]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, boxShadow: "0 0 10px 2px rgb(143 176 255 / 0.5)" }}
            />
          ))}
          <div className="absolute inset-x-0 top-[64%] hidden h-px overflow-hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8fb0ff]/15 to-transparent" />
            <div className="founder-line absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#8fb0ff] to-transparent" />
          </div>
        </motion.div>
      </div>

      <div className="container-x">
        <header className="relative mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div
            className="founder-pulse pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[34rem] max-w-full rounded-full opacity-25"
            style={{ background: "radial-gradient(closest-side, #8fb0ff, transparent)" }}
            aria-hidden
          />
          <motion.p
            {...state}
            custom={T.eyebrow}
            variants={{
              out: { opacity: 0, letterSpacing: "0.5em" },
              in: (d: number) => ({ opacity: 1, letterSpacing: "0.14em", transition: { duration: 1.1, ease: EASE, delay: d } }),
            }}
            className="eyebrow mb-5 inline-flex items-center gap-3 !text-[#8fb0ff]"
          >
            <span className="founder-dot h-1.5 w-1.5 rounded-full bg-[#8fb0ff] shadow-[0_0_10px_2px_rgb(143_176_255/0.8)]" aria-hidden />
            FOUNDERS
          </motion.p>
          <h2 id="founders-title" className="display text-[clamp(2rem,4.8vw,3.8rem)]" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-top">
                <motion.span {...state} custom={T.heading + i * 0.09} variants={maskUp} className="inline-block">
                  {w}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.span
            {...state}
            custom={T.line}
            variants={{
              out: { scaleX: 0 },
              in: (d: number) => ({ scaleX: 1, transition: { duration: 1, ease: EASE, delay: d } }),
            }}
            className="mx-auto mt-6 block h-px w-40 origin-center"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
            aria-hidden
          />
          <motion.p {...state} custom={T.subtitle} variants={rise} className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">
            Three minds. One vision. Building technology that moves businesses forward.
          </motion.p>
        </header>

        <ul className="relative grid gap-10 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {FOUNDERS.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} show={show} reduce={reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
}
