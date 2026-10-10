import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function NotFound() {
  useDocumentMeta("Page not found — Javian Technologies");
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow !text-accent">Error 404</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,8vw,6rem)]">This page doesn't exist.</h1>
      <p className="mt-6 max-w-md text-muted">The link may be outdated or mistyped. Let's get you back on track.</p>
      <Link to="/" className="btn btn-primary mt-10">
        Back to home <span className="arrow" aria-hidden>→</span>
      </Link>
    </section>
  );
}
