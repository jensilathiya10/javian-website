import { Link, useParams } from "react-router-dom";
import { ProjectVisual } from "../components/ProjectVisual";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { FALLBACK_PROJECTS as projects } from "../lib/projects";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  useDocumentMeta(project ? `${project.title} — Javian Technologies` : "Project not found — Javian Technologies", project?.summary);
  if (!project) return <NotFound />;

  const idx = projects.indexOf(project);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="container-x pt-28 pb-20 md:pt-36 md:pb-32">
      <Link to={{ pathname: "/", hash: "work" }} className="link-arrow text-sm">
        <span className="arrow !transform-none" aria-hidden>←</span> All work
      </Link>
      <p className="eyebrow mt-8 flex items-center gap-3">
        <span className="rounded-full border border-cyan/50 px-2.5 py-0.5 text-cyan">{project.kind}</span>
        Not a client project
      </p>
      <h1 className="display mt-4 text-[clamp(2.5rem,7vw,5.5rem)]">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{project.summary}</p>

      <div className="mt-12 max-w-4xl">
        <ProjectVisual slug={project.slug} title={project.title} />
        <p className="mt-3 font-mono text-xs text-muted">Concept visualization, not a screenshot of a released product.</p>
      </div>

      <div className="mt-16 grid max-w-4xl gap-10 md:grid-cols-2">
        <section>
          <h2 className="eyebrow !text-accent mb-3">The problem</h2>
          <p className="leading-relaxed">{project.problem}</p>
        </section>
        <section>
          <h2 className="eyebrow !text-accent mb-3">The approach</h2>
          <p className="leading-relaxed">{project.approach}</p>
        </section>
      </div>

      <ul className="mt-10 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <li key={t} className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-muted">{t}</li>
        ))}
      </ul>

      <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link to={{ pathname: "/", hash: "contact" }} className="btn btn-primary justify-center sm:w-fit">
          Discuss a similar project <span className="arrow" aria-hidden>→</span>
        </Link>
        <Link to={`/work/${next.slug}`} className="link-arrow">
          Next: {next.title} <span className="arrow" aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
