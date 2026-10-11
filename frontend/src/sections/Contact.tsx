import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { GeoStructure } from "../components/GeoStructure";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { ContactError, submitContact } from "../lib/contact";
import { BUDGETS, CONTACT_EMAIL, SERVICES } from "../lib/content";
import { validateContact } from "../lib/validate";
import type { ContactPayload, FieldErrors } from "../types";

const EMPTY: ContactPayload = { name: "", email: "", company: "", phone: "", service: "", budget: "", message: "", _gotcha: "" };

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success" } | { kind: "error"; message: string };

export function Contact() {
  const [v, setV] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const h = (e: Event) => setV((p) => ({ ...p, service: (e as CustomEvent<string>).detail }));
    window.addEventListener("prefill-service", h);
    return () => window.removeEventListener("prefill-service", h);
  }, []);

  const set = (k: keyof ContactPayload) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "loading") return;
    const errs = validateContact(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus({ kind: "loading" });
    try {
      await submitContact({
        name: v.name.trim(),
        email: v.email.trim(),
        company: v.company?.trim() || undefined,
        phone: v.phone?.trim() || undefined,
        service: v.service,
        budget: v.budget,
        message: v.message.trim(),
        _gotcha: v._gotcha,
      });
      setStatus({ kind: "success" });
      setV(EMPTY);
    } catch (err) {
      if (err instanceof ContactError) {
        setStatus({ kind: "error", message: err.message });
      } else setStatus({ kind: "error", message: "Unexpected error. Please try again." });
    }
  }

  const err = (k: keyof ContactPayload) =>
    errors[k] ? (
      <p id={`e-${k}`} className="mt-1.5 text-sm text-danger">{errors[k]}</p>
    ) : null;
  const aria = (k: keyof ContactPayload) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `e-${k}` : undefined,
  });

  return (
    <section id="contact" className="relative overflow-hidden py-6 pb-24 md:py-9 md:pb-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHead label="Contact" title={<>Have an idea <span className="grad-text">worth building?</span></>}>
            Tell us about your challenge. Let's explore what technology can make possible.
          </SectionHead>
          <div className="hidden lg:block"><GeoStructure /></div>
          {CONTACT_EMAIL && (
            <p className="text-sm text-muted">
              Prefer email?{" "}
              <a className="text-ink underline decoration-cyan underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          )}
        </div>

        <Reveal>
          {status.kind === "success" ? (
            <div className="panel p-8 md:p-10" role="status" data-active="true">
              <p className="eyebrow !text-cyan">Inquiry sent</p>
              <h3 className="display mt-4 text-4xl">Thank you.</h3>
              <p className="mt-4 text-muted">Your message was delivered to our team. We'll reply to the email you provided.</p>
              <button type="button" className="link-arrow mt-6" onClick={() => setStatus({ kind: "idle" })}>
                Send another message <span className="arrow" aria-hidden>→</span>
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="panel grid gap-5 p-6 sm:grid-cols-2 md:p-9" aria-label="Project inquiry">
              <div>
                <label htmlFor="f-name" className="eyebrow mb-2 block">Name *</label>
                <input id="f-name" className="field" autoComplete="name" value={v.name} onChange={set("name")} maxLength={120} {...aria("name")} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="f-email" className="eyebrow mb-2 block">Email *</label>
                <input id="f-email" type="email" className="field" autoComplete="email" value={v.email} onChange={set("email")} maxLength={254} {...aria("email")} />
                {err("email")}
              </div>
              <div>
                <label htmlFor="f-company" className="eyebrow mb-2 block">Company</label>
                <input id="f-company" className="field" autoComplete="organization" value={v.company} onChange={set("company")} maxLength={160} />
              </div>
              <div>
                <label htmlFor="f-phone" className="eyebrow mb-2 block">Phone</label>
                <input id="f-phone" type="tel" className="field" autoComplete="tel" value={v.phone} onChange={set("phone")} maxLength={30} {...aria("phone")} />
                {err("phone")}
              </div>
              <div>
                <label htmlFor="f-service" className="eyebrow mb-2 block">Service type</label>
                <select id="f-service" className="field" value={v.service} onChange={set("service")} {...aria("service")}>
                  <option value="">Select…</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.formValue}>{s.title}</option>
                  ))}
                  <option value="other">Something else</option>
                </select>
                {err("service")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="f-budget" className="eyebrow mb-2 block">Project budget</label>
                <select id="f-budget" className="field" value={v.budget} onChange={set("budget")}>
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="f-message" className="eyebrow mb-2 block">Project details *</label>
                <textarea id="f-message" rows={6} className="field resize-y" value={v.message} onChange={set("message")} maxLength={4000} {...aria("message")} />
                {err("message")}
              </div>
              {/* Honeypot: hidden from people and assistive tech */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="f-gotcha">Leave this field empty</label>
                <input id="f-gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" value={v._gotcha} onChange={set("_gotcha")} />
              </div>

              <div className="sm:col-span-2">
                {status.kind === "error" && (
                  <p role="alert" className="mb-4 rounded-xl border border-danger/60 p-4 text-sm text-danger">
                    {status.message}
                    {CONTACT_EMAIL && (
                      <>
                        {" "}You can also email us at{" "}
                        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                      </>
                    )}
                  </p>
                )}
                <button type="submit" className="btn btn-primary w-full justify-center sm:w-auto" disabled={status.kind === "loading"}>
                  {status.kind === "loading" ? "Sending…" : (
                    <>Start a Conversation <span className="arrow" aria-hidden>→</span></>
                  )}
                </button>
                <p className="mt-4 text-xs text-muted">
                  We use your details only to respond to this inquiry. See the{" "}
                  <Link className="underline" to="/privacy">privacy policy</Link>.
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
