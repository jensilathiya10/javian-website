export interface Project {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  problem: string;
  approach: string;
  tags: string[];
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  /** Spam honeypot; must stay empty. */
  _gotcha?: string;
}

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;
