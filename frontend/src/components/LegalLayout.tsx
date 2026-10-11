import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import { LEGAL_LAST_UPDATED, isPlaceholder } from "../lib/legal";

export interface LegalSection {
  id: string;
  title: string;
}

/** Highlights a value the company still has to supply. Plain text if it is real. */
export function Ph({ children }: { children: string }) {
  if (!isPlaceholder(children)) return <>{children}</>;
  return (
    <mark className="rounded bg-amber-300/15 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-200 [overflow-wrap:anywhere]">
      {children}
    </mark>
  );
}

const TAGS = {
  current: { label: "Current practice", cls: "border-cyan/50 text-cyan" },
  legal: { label: "Legal position", cls: "border-lav/50 text-lav" },
  todo: { label: "To implement", cls: "border-amber-300/50 text-amber-200" },
} as const;

/** Marks whether a statement is something we do now, a legal fact, or something still to do. */
export function Tag({ kind }: { kind: keyof typeof TAGS }) {
  const t = TAGS[kind];
  return (
    <span className={`mr-2 inline-block rounded-full border px-2 py-0.5 align-middle font-mono text-[0.65rem] uppercase tracking-[0.1em] ${t.cls}`}>
      {t.label}
    </span>
  );
}

export function LegalSectionBlock({ id, title, n, children }: { id: string; title: string; n: number; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-8 first:border-0 first:pt-0">
      <h2 className="display text-2xl md:text-3xl">
        <span className="eyebrow mr-3 !text-cyan">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted [&_a]:text-ink [&_a]:underline [&_a]:decoration-cyan [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export function LegalLayout({
  eyebrow,
  title,
  intro,
  notice,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  notice: ReactNode;
  sections: readonly LegalSection[];
  children: ReactNode;
}) {
  const active = useActiveSection(sections.map((s) => s.id));
  const toc = (
    <ol className="space-y-0.5 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={`flex min-h-9 items-center gap-3 rounded-lg px-2 transition-colors hover:text-ink ${
              active === s.id ? "bg-violet/20 text-ink" : "text-muted"
            }`}
          >
            <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="container-x pt-28 pb-20 md:pt-36 md:pb-28">
      <nav aria-label="Breadcrumb" className="eyebrow mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{eyebrow}</span>
      </nav>
      <header className="max-w-3xl">
        <p className="eyebrow !text-accent">{eyebrow}</p>
        <h1 className="display mt-4 text-5xl md:text-6xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted">
          Last updated: <time dateTime="2026-10-11">{LEGAL_LAST_UPDATED}</time>
        </p>
      </header>

      <aside role="note" className="mt-8 max-w-3xl rounded-2xl border border-amber-300/40 bg-amber-300/5 p-5 text-sm leading-relaxed text-amber-100/90">
        {notice}
      </aside>

      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <div>
          <details className="panel p-4 lg:hidden">
            <summary className="eyebrow cursor-pointer !text-ink">On this page</summary>
            <div className="mt-3">{toc}</div>
          </details>
          <div className="sticky top-24 hidden lg:block">
            <p className="eyebrow mb-3">On this page</p>
            {toc}
          </div>
        </div>
        <article className="max-w-3xl space-y-10">{children}</article>
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-6 max-w-3xl lg:ml-[324px]">
        <Link to="/" className="link-arrow">← Back to home</Link>
        <Link to={{ pathname: "/", hash: "contact" }} className="link-arrow">
          Contact us <span className="arrow" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
