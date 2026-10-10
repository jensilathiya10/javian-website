import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { BUSINESS_VALUE, MODULES } from "../lib/content";

export function Solutions() {
  const [sel, setSel] = useState("erp");
  const cur = MODULES.find((m) => m.id === sel)!;

  return (
    <section id="solutions" className="relative py-6 md:py-9">
      <div className="container-x">
        <SectionHead label="Business systems" title={<>One connected ecosystem. <span className="grad-text">Built around your business.</span></>}>
          Modular systems that share information, so teams work from the same picture. Select a module to explore it.
        </SectionHead>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              <div className="absolute inset-[12%] rounded-full" style={{ background: "radial-gradient(closest-side, rgb(128 87 255 / 0.28), transparent)" }} />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                {/* ring between neighbouring modules */}
                <polygon
                  points={MODULES.map((m) => `${m.x},${m.y}`).join(" ")}
                  fill="none"
                  stroke="rgb(201 190 255 / 0.14)"
                  strokeWidth="0.4"
                  strokeDasharray="1 1.5"
                />
                {MODULES.map((m, i) => {
                  const on = m.id === sel;
                  return (
                    <g key={m.id}>
                      <line x1="50" y1="50" x2={m.x} y2={m.y} stroke={on ? "rgb(53 217 255 / 0.55)" : "rgb(201 190 255 / 0.2)"} strokeWidth={on ? 0.7 : 0.4} style={{ transition: "stroke .3s" }} />
                      <line x1="50" y1="50" x2={m.x} y2={m.y} pathLength="100" stroke={on ? "#35d9ff" : "#8057ff"} strokeWidth={on ? 1.1 : 0.7} strokeLinecap="round" className="streak" style={{ animationDelay: `${i * -0.5}s`, opacity: on ? 1 : 0.55 }} />
                    </g>
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-lav/50 bg-indigo text-center shadow-[0_0_50px_-8px_rgb(128_87_255/0.8)]">
                <span className="text-[0.7rem] font-extrabold leading-tight tracking-wide sm:text-sm">Business platform</span>
                <span className="mt-1 hidden font-mono text-[0.55rem] uppercase tracking-widest text-cyan sm:block">shared data</span>
              </div>

              {MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={sel === m.id}
                  onClick={() => setSel(m.id)}
                  onMouseEnter={() => setSel(m.id)}
                  onFocus={() => setSel(m.id)}
                  className={`absolute min-h-11 min-w-[72px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-300 sm:text-sm ${
                    sel === m.id
                      ? "border-cyan bg-cyan/15 text-ink shadow-[0_0_30px_-6px_rgb(53_217_255/0.8)]"
                      : "border-line-strong bg-bg/80 text-lav hover:border-lav"
                  }`}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="space-y-10">
            <div className="panel p-6 md:p-8" aria-live="polite">
              <p className="eyebrow !text-cyan">Module · illustrative</p>
              <h3 className="display mt-3 text-3xl">{cur.label}</h3>
              <p className="mt-3 min-h-[3.5rem] text-muted">{cur.text}</p>
              <p className="mt-4 font-mono text-xs text-muted/80">Capabilities we can build, not released products.</p>
            </div>
            <ul className="space-y-6">
              {BUSINESS_VALUE.map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2.5 h-px w-8 shrink-0" style={{ background: "linear-gradient(90deg,#8057ff,#35d9ff)" }} />
                  <div>
                    <h3 className="font-bold">{t}</h3>
                    <p className="mt-1 text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
