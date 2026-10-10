import type { ContactPayload, FieldErrors, Project } from "../types";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const TIMEOUT_MS = 8000;

async function request(path: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${BASE}${path}`, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await request("/api/projects");
  if (!res.ok) throw new Error(`projects ${res.status}`);
  return res.json();
}

export class ContactError extends Error {
  constructor(
    message: string,
    public fields: FieldErrors = {},
    public kind: "validation" | "rate" | "server" | "network" = "server",
  ) {
    super(message);
  }
}

export async function submitContact(payload: ContactPayload): Promise<{ reference: string }> {
  let res: Response;
  try {
    res = await request("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactError("We couldn't reach the server. Please check your connection and try again.", {}, "network");
  }
  let body: { detail?: string; fields?: FieldErrors; reference?: string } = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON error body */
  }
  if (res.status === 201 && body.reference) return { reference: body.reference };
  if (res.status === 422) throw new ContactError(body.detail ?? "Please check the form.", body.fields, "validation");
  if (res.status === 429) throw new ContactError(body.detail ?? "Too many submissions. Please try later.", {}, "rate");
  throw new ContactError(body.detail ?? "Something went wrong on our side. Please try again shortly.", {}, "server");
}
