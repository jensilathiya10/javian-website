export interface AdminInquiry {
  id: number;
  reference: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  budget: string | null;
  message: string;
  created_at: string;
}

export interface InquiryPage {
  total: number;
  limit: number;
  offset: number;
  items: AdminInquiry[];
}

export class AdminError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`/api/admin${path}`, { credentials: "same-origin", ...init });
  } catch {
    throw new AdminError("Could not reach the server.", 0);
  }
}

async function failure(res: Response): Promise<AdminError> {
  let detail = "Something went wrong.";
  try {
    detail = (await res.json()).detail ?? detail;
  } catch {
    /* non-JSON body */
  }
  return new AdminError(typeof detail === "string" ? detail : "Something went wrong.", res.status);
}

/** True when a valid session exists; false when signed out. Throws when the admin area is unavailable (404). */
export async function checkSession(): Promise<boolean> {
  const res = await call("/me");
  if (res.ok) return true;
  if (res.status === 401) return false;
  throw await failure(res);
}

export async function login(password: string): Promise<void> {
  const res = await call("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw await failure(res);
}

export async function logout(): Promise<void> {
  await call("/logout", { method: "POST" });
}

export async function fetchInquiries(q: string, limit: number, offset: number): Promise<InquiryPage> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (q.trim()) params.set("q", q.trim());
  const res = await call(`/inquiries?${params}`);
  if (!res.ok) throw await failure(res);
  return res.json();
}
