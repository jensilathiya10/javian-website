import { useLocation } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";

// Each stage of the story maps to the section that tells it.
const STAGES = [
  ["top", "Idea"],
  ["services", "Design"],
  ["solutions", "Engineering"],
  ["ai", "Intelligence"],
  ["work", "Product"],
  ["process", "Growth"],
] as const;
const IDS = ["top", "services", "solutions", "ai", "work", "process", "about", "founders", "contact"];

export function JourneyBar() {
  const { pathname } = useLocation();
  const active = useActiveSection(IDS);
  if (pathname !== "/") return null;
  const cur = active === "about" || active === "founders" || active === "contact" ? "process" : active || "top";
  const idx = Math.max(0, STAGES.findIndex(([id]) => id === cur));
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 hidden justify-center lg:flex"
      role="presentation"
    >
      <ol
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-bg/70 px-3 py-2 backdrop-blur-md"
        aria-label="Journey: idea to growth"
      >
        {STAGES.map(([id, label], i) => (
          <li key={id} className="flex items-center">
            <span
              aria-current={i === idx ? "step" : undefined}
              className={`rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                i === idx ? "bg-violet/25 text-ink" : i < idx ? "text-lav" : "text-muted/70"
              }`}
            >
              {label}
            </span>
            {i < STAGES.length - 1 && (
              <span className={`mx-0.5 h-px w-4 transition-colors duration-500 ${i < idx ? "bg-cyan" : "bg-line-strong"}`} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
