import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RingCarousel } from "../components/RingCarousel";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { ServiceDialog } from "../components/ServiceDialog";
import { ServiceVisual } from "../components/ServiceVisuals";
import { SERVICES, type Service } from "../lib/content";
import { hasFinePointer } from "../lib/scroll";

const cardInner = (s: Service, _active: boolean) => (
  <>
    <div className="relative h-48 w-full shrink-0 border-b border-line md:h-52">
      <div className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(60% 80% at 50% 100%, rgb(128 87 255 / 0.28), transparent)" }} />
      <ServiceVisual kind={s.visual} />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <p className="eyebrow !text-cyan">{s.num}</p>
      <h3 className="display mt-3 text-2xl">{s.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted md:text-base">{s.blurb}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
        Learn More <span className="arrow text-cyan" aria-hidden>→</span>
      </span>
    </div>
  </>
);

function Card({ s, active, onOpen }: { s: Service; active: boolean; onOpen: (s: Service) => void }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !hasFinePointer()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(2));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(2));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  const className = "panel group flex h-full w-full cursor-pointer flex-col overflow-hidden text-left";

  if (s.path) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={s.path}
        data-active={active}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={className}
      >
        {cardInner(s, active)}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={() => onOpen(s)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-haspopup="dialog"
      data-active={active}
      className={className}
    >
      {cardInner(s, active)}
    </button>
  );
}

export function Services() {
  const [open, setOpen] = useState<Service | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="services" className="overflow-hidden py-6 md:py-9">
      <div className="container-x">
        <SectionHead label="Services" title={<>Software, web <span className="grad-text">and AI services.</span></>}>
          Technology without limits. Six disciplines, one team. Choose a service to explore.
        </SectionHead>
        <Reveal>
          <RingCarousel
            count={SERVICES.length}
            label="Services"
            dotLabels={SERVICES.map((s) => `${s.num}: ${s.title}`)}
            className="[--cw:80%] sm:[--cw:54%] lg:[--cw:38%]"
            renderItem={(i, active) => <Card s={SERVICES[i]} active={active} onOpen={setOpen} />}
          />
        </Reveal>
      </div>
      <ServiceDialog service={open} onClose={close} />
    </section>
  );
}
