import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import { NAV } from "../lib/content";
import { Wordmark } from "./Wordmark";

const IDS = NAV.map((n) => n.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const active = useActiveSection(IDS);
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: lock body scroll only while open, always restore on close/unmount/route change.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" onClick={close} className="py-2">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.id}>
                <Link
                  to={{ pathname: "/", hash: n.id }}
                  aria-current={onHome && active === n.id ? "location" : undefined}
                  className={`relative py-2 text-sm transition-colors hover:text-ink ${
                    onHome && active === n.id ? "text-ink" : "text-muted"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px bg-cyan transition-transform origin-left ${
                      onHome && active === n.id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to={{ pathname: "/", hash: "contact" }} className="btn btn-primary hidden !min-h-10 !px-5 text-sm sm:inline-flex">
            Start a Project <span className="arrow" aria-hidden>→</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-bg/95 lg:hidden">
          <nav aria-label="Mobile" className="container-x py-8">
            <ul className="flex flex-col">
              {NAV.map((n) => (
                <li key={n.id} className="border-b border-line">
                  <Link
                    to={{ pathname: "/", hash: n.id }}
                    onClick={close}
                    className="display flex min-h-16 items-center justify-between text-3xl"
                  >
                    {n.label}
                    <span className="text-accent" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={{ pathname: "/", hash: "contact" }} onClick={close} className="btn btn-primary mt-8 w-full justify-center">
              Start a Project <span className="arrow" aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
