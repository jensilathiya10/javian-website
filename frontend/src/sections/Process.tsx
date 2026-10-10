import { RingCarousel } from "../components/RingCarousel";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { STAGE_VISUALS } from "../components/StageVisuals";
import { PROCESS } from "../lib/content";

export function Process() {
  return (
    <section id="process" className="light relative overflow-hidden py-6 md:py-9">
      <div className="container-x">
        <SectionHead label="Development process" title={<>From vision to <span style={{ color: "#5b3fe0" }}>working software.</span></>}>
          Six stages, one at a time. Swipe, drag, use the arrows or pick a step.
        </SectionHead>
        <Reveal>
          <RingCarousel
            count={PROCESS.length}
            label="Development process"
            dotLabels={PROCESS.map(([n, t]) => `step ${n}: ${t}`)}
            className="[--cw:84%] sm:[--cw:68%] lg:[--cw:56%]"
            renderItem={(i) => {
              const [n, title, text] = PROCESS[i];
              const Visual = STAGE_VISUALS[i];
              return (
                <article className="stage-card flex flex-col overflow-hidden rounded-3xl border border-line-strong bg-gradient-to-br from-indigo to-[#0b0e26] text-ink">
                  <div className="h-44 border-b border-line bg-[radial-gradient(60%_90%_at_50%_100%,rgb(128_87_255/0.3),transparent)] p-5 md:h-56">
                    <Visual />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="eyebrow !text-cyan">Step {n} of 06</p>
                    <h3 className="display mt-3 text-3xl md:text-5xl">{title}</h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted md:text-lg">{text}</p>
                  </div>
                </article>
              );
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
