/** Softly illuminated geometric structure: nested hexagons with light travelling between vertices. */
function hex(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export function GeoStructure() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
      <div className="absolute inset-[8%] rounded-full" style={{ background: "radial-gradient(closest-side, rgb(128 87 255 / 0.4), transparent)" }} />
      <svg viewBox="0 0 100 100" className="relative h-full w-full">
        <defs>
          <linearGradient id="geo" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8057ff" />
            <stop offset="1" stopColor="#35d9ff" />
          </linearGradient>
        </defs>
        {[44, 34, 24, 14].map((r, i) => (
          <polygon key={r} points={hex(r)} fill="none" stroke="url(#geo)" strokeWidth={i === 0 ? 0.6 : 0.4} opacity={0.35 + i * 0.18} />
        ))}
        {Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          const x = 50 + 44 * Math.cos(a);
          const y = 50 + 44 * Math.sin(a);
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={x} y2={y} stroke="rgb(201 190 255 / 0.22)" strokeWidth="0.3" />
              <line x1="50" y1="50" x2={x} y2={y} pathLength="100" stroke="#35d9ff" strokeWidth="0.8" strokeLinecap="round" className="streak" style={{ animationDelay: `${i * -0.45}s` }} />
              <circle cx={x} cy={y} r="1.3" fill="#c9beff" className="pulse-soft" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          );
        })}
        <circle cx="50" cy="50" r="2.2" fill="#35d9ff" />
      </svg>
    </div>
  );
}
