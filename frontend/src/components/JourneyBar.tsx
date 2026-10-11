import { useEffect, useState } from "react";
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

/** True while the contact form is on screen, so the bar never covers it. */
function useContactVisible(enabled: boolean) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = enabled ? document.getElementById("contact") : null;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting), { rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);
  return visible;
}

export function JourneyBar() {
  const { pathname } = useLocation();
  const active = useActiveSection(IDS);
  const onContact = useContactVisible(pathname === "/");
  if (pathname !== "/") return null;
  const cur = active === "about" || active === "founders" || active === "contact" ? "process" : active || "top";
  const idx = Math.max(0, STAGES.findIndex(([id]) => id === cur));
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-2 z-40 hidden justify-center transition-opacity duration-300 lg:flex ${onContact ? "opacity-0" : "opacity-100"}`}
      role="presentation"
    >
      <ol
        className="flex items-center gap-1 rounded-full border border-line bg-bg/60 px-2.5 py-1.5 backdrop-blur-sm"
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
