import { Link } from "react-router-dom";
import { CONTACT_EMAIL, NAV } from "../lib/content";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-bg/60">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/">
              <Wordmark />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              Reliable, scalable software for businesses that want to operate smarter and grow.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.id}>
                  <Link to={{ pathname: "/", hash: n.id }} className="inline-flex min-h-9 items-center text-sm text-ink/90 hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4">Contact</p>
            <ul className="space-y-1 text-sm">
              {CONTACT_EMAIL && (
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-9 items-center hover:text-accent">
                    {CONTACT_EMAIL}
                  </a>
                </li>
              )}
              <li>
                <Link to={{ pathname: "/", hash: "contact" }} className="inline-flex min-h-9 items-center hover:text-accent">
                  Send a project inquiry
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="inline-flex min-h-9 items-center text-muted hover:text-accent">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">© {year} Javian Technologies. All rights reserved.</p>
          <button
            type="button"
            className="link-arrow !min-h-10 text-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top <span className="arrow arrow-up" aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
