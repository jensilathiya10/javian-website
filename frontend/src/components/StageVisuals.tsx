// Lightweight CSS/SVG visuals, one per stage. Animation pauses on inactive cards (see .stage-card).
const bar = "h-2 rounded-full bg-lav/30";

function Discover() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden>
      {[18, 34, 50].map((r, i) => (
        <circle key={r} cx="100" cy="60" r={r} fill="none" stroke="#8057ff" strokeOpacity={0.55 - i * 0.12} className="pulse-soft" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      <g style={{ transformOrigin: "100px 60px", animation: "spin-slow 6s linear infinite" }}>
        <path d="M100 60 L100 10" stroke="#35d9ff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M100 60 L100 10 A50 50 0 0 1 135 24 Z" fill="#35d9ff" fillOpacity="0.14" />
      </g>
      {[[132, 40], [70, 78], [118, 84], [84, 38]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#c9beff" className="pulse-soft" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      <circle cx="100" cy="60" r="3.5" fill="#35d9ff" />
    </svg>
  );
}

function Define() {
  const rows = ["w-4/5", "w-3/5", "w-2/3"];
  return (
    <div className="mx-auto flex h-full max-w-[260px] flex-col justify-center gap-3">
      {rows.map((w, i) => (
        <div key={i} className="hl flex items-center gap-3" style={{ animationDelay: `${i * 1.4}s` }}>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-cyan/70">
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
              <path d="M2 6.5 L5 9 L10 3" fill="none" stroke="#35d9ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tick" style={{ animationDelay: `${i * 0.6}s` }} />
            </svg>
          </span>
          <div className={`${bar} ${w}`} />
        </div>
      ))}
    </div>
  );
}

function Design() {
  return (
    <div className="mx-auto grid h-full max-w-[280px] grid-cols-3 grid-rows-3 gap-2 py-2">
      <div className="hl col-span-3 rounded-md border border-cyan/60 bg-gradient-to-r from-violet/50 to-cyan/30" />
      <div className="hl row-span-2 rounded-md border border-violet/50 bg-violet/20" style={{ animationDelay: "1s" }} />
      <div className="hl col-span-2 rounded-md border border-lav/40 bg-lav/10" style={{ animationDelay: "2s" }} />
      <div className="hl col-span-2 rounded-md border border-cyan/50 bg-cyan/10" style={{ animationDelay: "3s" }} />
    </div>
  );
}

function Build() {
  const lines = [["w-3/5", "from-violet to-cyan"], ["w-4/5", "from-violet/70 to-lav/60"], ["w-2/5", "from-cyan/80 to-violet/60"], ["w-3/4", "from-violet to-cyan"], ["w-1/2", "from-lav/60 to-violet/50"]];
  return (
    <div className="mx-auto flex h-full max-w-[280px] flex-col justify-center gap-2.5 rounded-lg border border-line bg-bg/50 p-4">
      {lines.map(([w, g], i) => (
        <div key={i} className={`${w}`}>
          <div className={`grow h-2 rounded-full bg-gradient-to-r ${g}`} style={{ animationDelay: `${i * 0.35}s` }} />
        </div>
      ))}
    </div>
  );
}

function Validate() {
  return (
    <div className="mx-auto flex h-full max-w-[260px] flex-col justify-center gap-3">
      {["Functionality", "Performance", "Security"].map((t, i) => (
        <div key={t} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
          <svg viewBox="0 0 12 12" className="h-4 w-4 shrink-0" aria-hidden>
            <circle cx="6" cy="6" r="5.4" fill="none" stroke="#8057ff" strokeOpacity="0.6" />
            <path d="M3 6.2 L5.2 8.2 L9 4" fill="none" stroke="#35d9ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="tick" style={{ animationDelay: `${i * 0.7}s` }} />
          </svg>
          <span className="font-mono text-[0.7rem] tracking-wide text-lav">{t}</span>
        </div>
      ))}
    </div>
  );
}

function Launch() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden>
      {[28, 62, 96, 130, 164].map((x, i) => (
        <rect key={x} x={x} y={95 - (i + 1) * 14} width="18" height={(i + 1) * 14} rx="3" fill="#8057ff" fillOpacity={0.25 + i * 0.1} className="rise" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      <path d="M20 90 C 60 84, 90 70, 120 50 S 160 22, 184 14" fill="none" stroke="rgb(201 190 255 / 0.3)" strokeWidth="1.5" />
      <path d="M20 90 C 60 84, 90 70, 120 50 S 160 22, 184 14" pathLength="100" fill="none" stroke="#35d9ff" strokeWidth="2.5" strokeLinecap="round" className="streak" style={{ strokeDasharray: "14 86", animationDuration: "3s" }} />
      <circle cx="184" cy="14" r="4" fill="#35d9ff" className="pulse-soft" />
    </svg>
  );
}

export const STAGE_VISUALS = [Discover, Define, Design, Build, Validate, Launch];
