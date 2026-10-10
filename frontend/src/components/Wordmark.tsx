export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-reveal inline-flex flex-col leading-none select-none ${className}`}>
      <span className="sr-only">Javian Technologies</span>
      <span className="text-[18px] font-extrabold tracking-[0.22em] text-ink" aria-hidden>
        JAVIAN
      </span>
      <span className="mt-1.5 flex items-center gap-2 font-mono text-[8px] tracking-[0.34em] text-muted" aria-hidden>
        <span className="inline-block h-[2px] w-4" style={{ background: "linear-gradient(90deg,#8057ff,#35d9ff)" }} />
        TECHNOLOGIES
      </span>
    </span>
  );
}
