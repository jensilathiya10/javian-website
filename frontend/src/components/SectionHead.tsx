import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({
  label,
  title,
  children,
  className = "",
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`mb-8 max-w-3xl md:mb-10 ${className}`}>
      <p className="eyebrow mb-5 flex items-center gap-3">
        <span className="draw h-px w-10" style={{ background: "linear-gradient(90deg,#8057ff,#35d9ff)" }} />
        {label}
      </p>
      <h2 className="display text-[clamp(2rem,4.8vw,3.8rem)]">{title}</h2>
      {children && <p className="muted mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{children}</p>}
    </Reveal>
  );
}
