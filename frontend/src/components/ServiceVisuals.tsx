import type { ServiceVisualKey } from "../lib/content";

// Each visual reads --mx/--my (pointer, -1..1) set by the tile, and reacts to group hover.
const move = (k: number) => `translate3d(calc(var(--mx,0) * ${k}px), calc(var(--my,0) * ${k}px), 0)`;
const bar = "h-1.5 rounded-full bg-lav/30";

function Web() {
  const layers = [
    { left: "8%", top: "6%", cls: "border-violet/50 bg-indigo/80 group-hover:-translate-x-3 group-hover:-translate-y-2" },
    { left: "16%", top: "16%", cls: "border-lav/50 bg-indigo/70" },
    { left: "24%", top: "26%", cls: "border-cyan/70 bg-[#101440]/90 group-hover:translate-x-3 group-hover:translate-y-2" },
  ];
  return (
    <div className="relative h-full w-full" style={{ transform: move(6) }}>
      {layers.map((l, i) => (
        <div
          key={i}
          className={`absolute h-[60%] w-[62%] rounded-xl border transition-transform duration-500 ease-out ${l.cls}`}
          style={{ left: l.left, top: l.top }}
        >
          <div className="flex gap-1 border-b border-line p-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lav/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-lav/40" />
            <span className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-cyan" : "bg-lav/40"}`} />
          </div>
          {i === 2 && (
            <div className="space-y-2 p-3">
              <div className={`${bar} w-2/3`} />
              <div className={`${bar} w-full`} />
              <div className="h-8 rounded-md bg-gradient-to-r from-violet/60 to-cyan/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Mobile() {
  return (
    <div className="relative h-full w-full" style={{ transform: move(8) }}>
      <div className="absolute left-[34%] top-[14%] h-[70%] w-[48%] rotate-[4deg] rounded-xl border border-violet/50 bg-indigo/70 transition-transform duration-500 group-hover:translate-x-4 group-hover:rotate-[8deg]" />
      <div className="absolute left-[16%] top-[6%] h-[84%] w-[24%] min-w-[84px] -rotate-3 rounded-[22px] border border-cyan/70 bg-[#0d1132] p-2 shadow-[0_0_40px_-12px_rgb(53_217_255/0.7)] transition-transform duration-500 group-hover:-translate-x-2 group-hover:-rotate-6">
        <div className="mx-auto mb-3 h-1 w-8 rounded-full bg-lav/30" />
        <div className="space-y-2">
          <div className="h-10 rounded-lg bg-gradient-to-br from-violet/70 to-cyan/50" />
          <div className={`${bar} w-4/5`} />
          <div className={`${bar} w-3/5`} />
          <div className="h-6 rounded-lg border border-line-strong" />
        </div>
      </div>
    </div>
  );
}

function Software() {
  const mods = ["ERP", "CRM", "HRM", "POS"];
  return (
    <div className="relative mx-auto grid h-full w-[80%] grid-cols-2 content-center gap-4" style={{ transform: move(4) }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M25 30 H75 M25 70 H75 M25 30 V70 M75 30 V70" stroke="rgb(201 190 255 / 0.25)" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M25 30 H75 V70 H25 Z" pathLength="100" stroke="#35d9ff" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" className="streak" />
      </svg>
      {mods.map((m, i) => (
        <div key={m} className="hl relative rounded-lg border border-line-strong bg-indigo/80 px-3 py-4 text-center font-mono text-[0.65rem] tracking-widest text-lav transition-colors group-hover:border-cyan/60" style={{ animationDelay: `${i * 1.5}s` }}>
          {m}
        </div>
      ))}
    </div>
  );
}

function AI() {
  const nodes = [
    [14, 50, 3], [38, 22, 6], [38, 50, 4], [38, 78, 8], [64, 34, 5], [64, 66, 7], [88, 50, 4],
  ];
  const edges = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 5], [4, 6], [5, 6]];
  return (
    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {edges.map(([a, b], i) => (
        <g key={i} style={{ transform: move(1) }}>
          <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgb(201 190 255 / 0.28)" strokeWidth="0.6" />
          <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} pathLength="100" stroke="#35d9ff" strokeWidth="1" strokeLinecap="round" className="streak" style={{ animationDelay: `${i * -0.45}s` }} />
        </g>
      ))}
      {nodes.map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 || i === 4 ? 3.4 : 2.4} fill={i % 3 === 0 ? "#35d9ff" : "#8057ff"} stroke="#c9beff" strokeWidth="0.6" style={{ transform: move(d), transition: "transform .2s" }} />
      ))}
    </svg>
  );
}

function SaaS() {
  const layers = [
    { l: "UI", k: 0 },
    { l: "API", k: 1 },
    { l: "AUTH", k: 2 },
    { l: "DATA", k: 3 },
  ];
  return (
    <div className="relative mx-auto h-full w-[70%] [perspective:700px]" style={{ transform: move(4) }}>
      <div className="absolute inset-0 [--gap:20px] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-30deg)] group-hover:[--gap:44px]">
        {layers.map(({ l, k }) => (
          <div
            key={l}
            className="absolute inset-x-[8%] top-[18%] h-[56%] rounded-lg border border-violet/60 bg-indigo/60 transition-transform duration-500 ease-out"
            style={{
              transform: `translateZ(calc(${k} * var(--gap)))`,
              borderColor: k === 3 ? "rgb(53 217 255 / .8)" : undefined,
              ["--k" as string]: k,
            }}
          >
            <span className="absolute -right-1 top-1 font-mono text-[0.55rem] tracking-widest text-lav">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Design() {
  return (
    <div className="relative mx-auto h-full w-[70%]" style={{ transform: move(5) }}>
      <div className="absolute inset-x-[6%] inset-y-[12%] border border-dashed border-lav/40" />
      <div className="absolute inset-x-[16%] inset-y-[22%] border border-cyan/80" style={{ animation: "morph 5s ease-in-out infinite alternate" }}>
        <div className="absolute left-1/2 top-1/2 h-px w-3/4 -translate-x-1/2 bg-line-strong" />
        <div className="absolute left-1/2 top-1/2 h-3/4 w-px -translate-y-1/2 bg-line-strong" />
      </div>
      {["left-[16%] top-[22%]", "right-[16%] top-[22%]", "left-[16%] bottom-[22%]", "right-[16%] bottom-[22%]"].map((p) => (
        <span key={p} className={`absolute ${p} h-2 w-2 -translate-x-1/2 border border-cyan bg-bg transition-transform duration-300 group-hover:scale-125`} />
      ))}
    </div>
  );
}

const MAP: Record<ServiceVisualKey, () => React.JSX.Element> = { web: Web, mobile: Mobile, software: Software, ai: AI, saas: SaaS, design: Design };

export function ServiceVisual({ kind }: { kind: ServiceVisualKey }) {
  const V = MAP[kind];
  return (
    <div className="pointer-events-none h-full w-full" aria-hidden>
      <V />
    </div>
  );
}
