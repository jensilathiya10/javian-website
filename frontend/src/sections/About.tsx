import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { PRINCIPLES, TECH } from "../lib/content";

export function About() {
  return (
    <section id="about" className="relative py-6 md:py-9">
      <div className="container-x">
        <SectionHead label="About Javian Technologies" title={<>Engineering the <span className="grad-text">next possibility.</span></>} />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <p className="text-xl font-semibold leading-snug md:text-2xl">
              Javian Technologies is a technology company focused on software engineering, business systems, digital
              products and practical AI.
            </p>
            <p className="mt-6 leading-relaxed text-muted">
              We combine thoughtful design, sound engineering and a clear view of the business behind every feature, so
              the software we build stays useful as it grows.
            </p>
            <p className="eyebrow mb-4 mt-12">Technology we work with</p>
            <ul className="flex flex-wrap gap-2">
              {TECH.map((t) => (
                <li key={t} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-muted">{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <ul className="divide-y divide-line border-y border-line">
              {PRINCIPLES.map(([t, d], i) => (
                <li key={t} className="group relative grid grid-cols-[40px_1fr] gap-4 py-5 transition-colors duration-200 hover:bg-indigo/40 md:grid-cols-[48px_240px_1fr] md:px-3">
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 origin-left scale-y-0 bg-cyan transition-transform duration-300 group-hover:scale-y-100" aria-hidden />
                  <span className="eyebrow !text-cyan pt-1">0{i + 1}</span>
                  <h3 className="font-bold transition-colors duration-200 group-hover:text-ink">{t}</h3>
                  <p className="col-start-2 text-sm text-muted md:col-start-auto">{d}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
