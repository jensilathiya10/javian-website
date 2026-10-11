import type { ContactPayload } from "../types";

/** Formspree endpoint, e.g. https://formspree.io/f/xxxxxxxx. Public by design; it is not a secret. */
const endpoint = (): string | undefined => import.meta.env.VITE_FORMSPREE_ENDPOINT || undefined;

const TIMEOUT_MS = 15000;

export class ContactError extends Error {
  constructor(message: string, public kind: "config" | "validation" | "network" | "server" = "server") {
    super(message);
  }
}

/** Resolves only when Formspree reports the submission as accepted (HTTP 2xx). */
export async function submitContact(payload: ContactPayload): Promise<void> {
  const url = endpoint();
  if (!url) {
    throw new ContactError("The contact form isn't configured yet. Please email us directly instead.", "config");
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company || "",
        service: payload.service || "",
        budget: payload.budget || "",
        message: payload.message,
        _subject: `New Javian inquiry from ${payload.name}`,
        _replyto: payload.email,
        _gotcha: payload._gotcha || "",
      }),
      signal: ctrl.signal,
    });
  } catch {
    throw new ContactError("We couldn't reach the server. Please check your connection and try again.", "network");
  } finally {
    clearTimeout(timer);
  }
  if (res.ok) return;
  let detail = "";
  try {
    const body = await res.json();
    detail = body?.errors?.map((e: { message?: string }) => e.message).filter(Boolean).join(" ") ?? "";
  } catch {
    /* non-JSON body */
  }
  if (res.status === 422) throw new ContactError(detail || "Please check the form and try again.", "validation");
  throw new ContactError(detail || "Something went wrong sending your message. Please try again shortly.", "server");
}
