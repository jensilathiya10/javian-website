const sk = "bg-lav/25";

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-line-strong bg-[#0b0e26] shadow-[0_40px_90px_-40px_rgb(128_87_255/0.7)]"
      role="img"
      aria-label={`Concept visualization: ${title}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-lav/30" />
        <span className="h-2 w-2 rounded-full bg-lav/30" />
        <span className="h-2 w-2 rounded-full bg-cyan" />
        <span className="ml-3 font-mono text-[0.6rem] tracking-wider text-muted">{title}</span>
      </div>
      <div className="aspect-[16/10] p-4 md:p-5">{children}</div>
    </div>
  );
}

const grad = "bg-gradient-to-r from-violet to-cyan";

function Hub() {
  return (
    <div className="grid h-full grid-cols-[22%_1fr] gap-3">
      <div className="space-y-2 border-r border-line pr-3">
        {[70, 90, 60, 80, 50].map((w, i) => (
          <div key={i} className={`h-2 rounded-full ${i === 1 ? grad : sk}`} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-line p-2">
              <div className={`h-1.5 w-1/2 rounded-full ${sk}`} />
              <div className={`mt-2 h-4 w-3/4 rounded ${i === 0 ? grad : "bg-indigo"}`} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-line p-2">
          {[40, 65, 50, 80, 60, 90, 70, 55].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t ${i === 5 ? "bg-cyan" : "bg-violet/50"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Knowledge() {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5">
      <div className="ml-auto w-3/5 rounded-xl border border-line-strong bg-indigo p-2.5">
        <div className={`h-1.5 w-full rounded-full ${sk}`} />
        <div className={`mt-1.5 h-1.5 w-2/3 rounded-full ${sk}`} />
      </div>
      <div className="w-4/5 rounded-xl border border-cyan/50 p-2.5">
        <div className={`h-1.5 w-full rounded-full ${grad}`} />
        <div className={`mt-1.5 h-1.5 w-full rounded-full ${sk}`} />
        <div className={`mt-1.5 h-1.5 w-3/5 rounded-full ${sk}`} />
        <div className="mt-3 flex gap-1.5">
          {["Policy", "Manual"].map((s) => (
            <span key={s} className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[0.55rem] text-muted">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex h-8 items-center rounded-full border border-line-strong px-3">
        <div className={`h-1.5 w-1/3 rounded-full ${sk}`} />
      </div>
    </div>
  );
}

function Pos() {
  return (
    <div className="grid h-full grid-cols-[1fr_32%] gap-3">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`rounded-lg border p-1.5 ${i === 4 ? "border-cyan/70" : "border-line"}`}>
            <div className={`aspect-square rounded ${i === 4 ? grad : "bg-indigo"}`} />
            <div className={`mt-1.5 h-1 w-3/4 rounded-full ${sk}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-line p-2">
        {[80, 60, 70].map((w, i) => (
          <div key={i} className={`h-1.5 rounded-full ${sk}`} style={{ width: `${w}%` }} />
        ))}
        <div className={`mt-auto h-7 rounded-md ${grad}`} />
      </div>
    </div>
  );
}

function Pulse() {
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {[2, 3, 1].map((n, c) => (
        <div key={c} className="flex flex-col gap-2 rounded-lg border border-line bg-bg/40 p-2">
          <div className={`h-1.5 w-1/2 rounded-full ${c === 2 ? grad : sk}`} />
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="rounded-md border border-line-strong bg-indigo p-1.5">
              <div className={`h-1.5 w-4/5 rounded-full ${sk}`} />
              <div className={`mt-1.5 h-1 w-1/2 rounded-full ${sk}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProjectVisual({ slug, title }: { slug: string; title: string }) {
  const body =
    slug === "operations-hub" ? <Hub /> : slug === "knowledge-desk" ? <Knowledge /> : slug === "counter-pos" ? <Pos /> : <Pulse />;
  return <Frame title={title.toLowerCase().replace(/\s+/g, "-")}>{body}</Frame>;
}
