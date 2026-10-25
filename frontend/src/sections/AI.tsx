import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { useAnimationPause } from "../hooks/useAnimationPause";
import { AI_CAPABILITIES, AI_FLOW } from "../lib/content";

const bar = "h-1.5 rounded-full bg-lav/30";

function MiniPanel({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="space-y-1.5">
        {["w-full", "w-4/5", "w-3/5"].map((w) => (
          <div key={w} className={`${bar} ${w}`} />
        ))}
      </div>
    );
  if (i === 1)
    return (
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} className="pulse-soft h-2 w-2 rounded-full bg-cyan" style={{ animationDelay: `${n * 0.25}s` }} />
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-cyan" /><div className={`${bar} w-2/3`} /></div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-violet" /><div className={`${bar} w-1/2`} /></div>
      </div>
    );
  return <div className="h-6 rounded-md bg-gradient-to-r from-violet/70 to-cyan/60" />;
}

export function AI() {
  const sectionRef = useAnimationPause<HTMLElement>("200px");
  return (
    <section id="ai" ref={sectionRef} className="relative overflow-hidden py-6 md:py-9">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" aria-hidden />
      <div className="container-x">
        <SectionHead label="AI & automation" title={<>AI automation for <span className="grad-text">real business workflows.</span></>}>
          Practical AI integrations and automation that reduce repetitive work and connect intelligent capabilities to your existing systems.
        </SectionHead>

        <Reveal>
          <div className="relative">
            {/* desktop: light streaking along one path behind the four panels */}
            <svg className="absolute inset-x-0 top-1/2 hidden h-24 w-full -translate-y-1/2 lg:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
              <path d="M0 50 C 120 10, 230 90, 375 50 S 625 10, 750 50 S 900 90, 1000 50" fill="none" stroke="rgb(128 87 255 / 0.4)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path d="M0 50 C 120 10, 230 90, 375 50 S 625 10, 750 50 S 900 90, 1000 50" pathLength="100" fill="none" stroke="#35d9ff" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="streak" style={{ strokeDasharray: "6 94", animationDuration: "4s" }} />
            </svg>
            <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-8" aria-label="AI workflow: data, AI, decision, action">
              {AI_FLOW.map(([title, sub], i) => (
                <li key={title} className="relative">
                  <div className="panel h-full bg-bg/80 p-5 backdrop-blur-sm">
                    <p className="eyebrow !text-cyan">Step 0{i + 1}</p>
                    <h3 className="display mt-3 text-3xl">{title}</h3>
                    <p className="mt-2 text-sm text-muted">{sub}</p>
                    <div className="mt-5 rounded-lg border border-line bg-bg/60 p-3" aria-hidden>
                      <MiniPanel i={i} />
                    </div>
                  </div>
                  {i < AI_FLOW.length - 1 && (
                    <span className="mx-auto mt-3 block h-8 w-px lg:hidden" style={{ background: "linear-gradient(#35d9ff, transparent)" }} aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <p className="eyebrow mb-5">Services and possible solutions</p>
          <ul className="flex flex-wrap gap-3">
            {AI_CAPABILITIES.map((c) => (
              <li key={c} className="rounded-full border border-line-strong bg-indigo/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-cyan hover:text-cyan">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/services/ai-automation" className="link-arrow">
              Learn more about AI automation <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
