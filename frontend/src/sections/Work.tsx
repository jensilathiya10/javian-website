import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ProjectVisual } from "../components/ProjectVisual";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { FALLBACK_PROJECTS as projects } from "../lib/projects";
import { onScrollFrame, prefersReducedMotion } from "../lib/scroll";
import type { Project } from "../types";

// Four distinct compositions so projects don't read as repeated cards.
const LAYOUTS = [
  { grid: "lg:grid-cols-[1.35fr_1fr]", visual: "", text: "", tilt: -4 },
  { grid: "lg:grid-cols-[1fr_1.1fr]", visual: "lg:order-2", text: "lg:order-1", tilt: 5 },
  { grid: "lg:grid-cols-[1fr_1.35fr]", visual: "lg:order-2 lg:-mr-10", text: "lg:order-1", tilt: -6 },
  { grid: "lg:grid-cols-[1.15fr_1fr]", visual: "lg:-ml-10", text: "", tilt: 4 },
];

function Showcase({ p, i }: { p: Project; i: number }) {
  const L = LAYOUTS[i % LAYOUTS.length];
  const ref = useRef<HTMLDivElement>(null);

  // Subtle depth: layers drift at different rates relative to viewport centre.
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return onScrollFrame((_y, vh) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const d = ((r.top + r.height / 2) / vh - 0.5) * 2; // -1..1
      el.style.setProperty("--d", d.toFixed(3));
    });
  }, []);

  return (
    <Reveal>
      <article className={`grid items-center gap-8 lg:gap-16 ${L.grid}`}>
        <Link to={`/work/${p.slug}`} aria-label={`${p.title}: view project`} className={`group relative block ${L.visual}`}>
          <div ref={ref} className="relative">
            <div
              className="absolute inset-4 rounded-3xl border border-violet/40 bg-indigo/40 will-change-transform"
              style={{ transform: `translate3d(calc(var(--d,0) * 18px), calc(var(--d,0) * -22px), 0) rotate(${L.tilt}deg)` }}
              aria-hidden
            />
            <div className="relative will-change-transform transition-transform duration-500 group-hover:-translate-y-1" style={{ transform: "translate3d(0, calc(var(--d,0) * 10px), 0)" }}>
              <ProjectVisual slug={p.slug} title={p.title} />
              <div className="absolute inset-0 flex items-end justify-between rounded-2xl bg-gradient-to-t from-bg/90 via-bg/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:hidden">
                <span className="font-mono text-xs text-lav">{p.tags.slice(0, 3).join(" · ")}</span>
                <span className="text-sm font-bold">View Project <span className="text-cyan" aria-hidden>→</span></span>
              </div>
            </div>
          </div>
        </Link>

        <div className={L.text}>
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="rounded-full border border-cyan/50 px-2.5 py-0.5 text-cyan">{p.kind}</span>
            <span>0{i + 1}</span>
          </p>
          <h3 className="display text-3xl md:text-5xl">{p.title}</h3>
          <p className="mt-5 text-muted leading-relaxed">{p.summary}</p>
          <p className="mt-4 text-sm leading-relaxed">
            <span className="eyebrow mr-2 !text-lav">Problem</span>
            {p.problem}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies and services">
            {p.tags.map((t) => (
              <li key={t} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-muted">{t}</li>
            ))}
          </ul>
          <Link to={`/work/${p.slug}`} className="link-arrow mt-6">
            View Project <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="overflow-x-clip py-6 md:py-9">
      <div className="container-x">
        <SectionHead label="Selected work" title={<>Ideas, engineered <span className="grad-text">into reality.</span></>}>
          Product concepts and internal experiments showing how we approach real business problems. Each is labeled as a
          concept, not a client engagement.
        </SectionHead>
        <div className="space-y-16 md:space-y-24">
          {projects.map((p, i) => (
            <Showcase key={p.slug} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
