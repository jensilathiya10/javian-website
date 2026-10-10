import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AdminError, checkSession, fetchInquiries, login, logout, type AdminInquiry, type InquiryPage } from "../lib/adminApi";

const PAGE_SIZE = 20;

const SERVICE_LABEL: Record<string, string> = {
  web: "Web development",
  mobile: "Mobile app",
  "business-software": "Business software",
  "ai-automation": "AI & automation",
  saas: "SaaS",
  design: "UI/UX design",
  other: "Something else",
};
const BUDGET_LABEL: Record<string, string> = {
  "under-5k": "Under $5k",
  "5k-15k": "$5k–15k",
  "15k-50k": "$15k–50k",
  "50k-plus": "$50k+",
  "not-sure": "Not sure",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

/** Keep this page out of search results and the browser tab title descriptive. */
function useNoIndex() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Admin — Javian Technologies";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");
    try {
      await login(password);
      setPassword("");
      onDone();
    } catch (err) {
      setError(err instanceof AdminError ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel mx-auto mt-10 max-w-md p-6 md:p-8" aria-label="Admin sign in">
      <h1 className="display text-3xl">Admin</h1>
      <p className="mt-2 text-sm text-muted">Sign in to view project inquiries.</p>
      <label htmlFor="admin-pw" className="eyebrow mb-2 mt-6 block">Password</label>
      <input
        id="admin-pw"
        type="password"
        className="field"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "admin-pw-err" : undefined}
        autoFocus
      />
      {error && (
        <p id="admin-pw-err" role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary mt-6 w-full justify-center" disabled={busy || !password}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Row({ item, open, onToggle }: { item: AdminInquiry; open: boolean; onToggle: () => void }) {
  const panelId = `inq-${item.id}`;
  return (
    <li className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-4 text-left transition-colors hover:bg-indigo/30 focus-visible:bg-indigo/30 md:grid-cols-[110px_1.2fr_1.4fr_1fr_170px] md:px-5"
      >
        <span className="eyebrow !text-cyan">{item.reference}</span>
        <span className="col-start-1 font-bold md:col-start-auto">{item.name}</span>
        <span className="col-start-1 truncate text-sm text-muted md:col-start-auto">{item.email}</span>
        <span className="col-start-1 text-sm text-lav md:col-start-auto">{SERVICE_LABEL[item.service] ?? item.service}</span>
        <time dateTime={item.created_at} className="col-start-2 row-start-1 text-xs text-muted md:col-start-auto md:row-start-auto md:text-right md:text-sm">
          {fmt(item.created_at)}
        </time>
      </button>
      {open && (
        <div id={panelId} className="grid gap-4 bg-indigo/20 px-4 pb-6 pt-2 md:px-5">
          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Company</dt>
              <dd>{item.company || "—"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Budget</dt>
              <dd>{item.budget ? BUDGET_LABEL[item.budget] ?? item.budget : "—"}</dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd>
                <a className="text-cyan underline-offset-4 hover:underline" href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: your inquiry ${item.reference}`)}`}>
                  {item.email}
                </a>
              </dd>
            </div>
          </dl>
          <div>
            <p className="eyebrow mb-2">Message</p>
            {/* Rendered as text, never as HTML: visitors control this content. */}
            <p className="max-w-3xl whitespace-pre-wrap break-words text-base leading-relaxed">{item.message}</p>
          </div>
        </div>
      )}
    </li>
  );
}

function Inquiries({ onSignedOut }: { onSignedOut: () => void }) {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<InquiryPage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const seq = useRef(0);

  // Debounce typing into the search box; a new search returns to the first page.
  useEffect(() => {
    const t = setTimeout(() => {
      setApplied(query);
      setOffset(0);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    const mine = ++seq.current; // ignore out-of-order responses
    setLoading(true);
    setError("");
    try {
      const page = await fetchInquiries(applied, PAGE_SIZE, offset);
      if (mine === seq.current) {
        setData(page);
        setOpenId(null);
      }
    } catch (err) {
      if (mine !== seq.current) return;
      if (err instanceof AdminError && err.status === 401) return onSignedOut();
      setError(err instanceof AdminError ? err.message : "Could not load inquiries.");
    } finally {
      if (mine === seq.current) setLoading(false);
    }
  }, [applied, offset, onSignedOut]);

  useEffect(() => {
    void load();
  }, [load]);

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl md:text-4xl">Inquiries</h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {data ? `${total} ${total === 1 ? "inquiry" : "inquiries"}${applied ? ` matching “${applied}”` : ""}` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => void load()} disabled={loading}>
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              await logout();
              onSignedOut();
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="admin-search" className="sr-only">Search inquiries</label>
        <input
          id="admin-search"
          type="search"
          className="field max-w-md"
          placeholder="Search name, email, company, message…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={100}
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 text-danger">
          {error}
        </p>
      )}

      <div className="panel mt-6 overflow-hidden" aria-busy={loading}>
        <div className="hidden grid-cols-[110px_1.2fr_1.4fr_1fr_170px] gap-x-4 border-b border-line px-5 py-3 md:grid">
          {["Reference", "Name", "Email", "Service", "Received"].map((h, i) => (
            <span key={h} className={`eyebrow ${i === 4 ? "text-right" : ""}`}>{h}</span>
          ))}
        </div>
        {data && data.items.length === 0 && !loading ? (
          <p className="p-8 text-center text-muted">{applied ? "No inquiries match your search." : "No inquiries yet."}</p>
        ) : (
          <ul>
            {data?.items.map((it) => (
              <Row key={it.id} item={it} open={openId === it.id} onToggle={() => setOpenId(openId === it.id ? null : it.id)} />
            ))}
          </ul>
        )}
      </div>

      {total > PAGE_SIZE && (
        <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
          <button type="button" className="btn btn-ghost" disabled={offset === 0 || loading} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
            ← Newer
          </button>
          <span className="text-sm text-muted tabular-nums">
            {from}–{to} of {total}
          </span>
          <button type="button" className="btn btn-ghost" disabled={to >= total || loading} onClick={() => setOffset(offset + PAGE_SIZE)}>
            Older →
          </button>
        </nav>
      )}
    </div>
  );
}

export default function Admin() {
  useNoIndex();
  const [state, setState] = useState<"checking" | "out" | "in" | "unavailable">("checking");

  useEffect(() => {
    let alive = true;
    checkSession()
      .then((ok) => alive && setState(ok ? "in" : "out"))
      .catch(() => alive && setState("unavailable"));
    return () => {
      alive = false;
    };
  }, []);

  const signedOut = useCallback(() => setState("out"), []);

  return (
    <div className="container-x pb-24 pt-28 md:pt-32">
      {state === "checking" && <p className="text-muted">Checking session…</p>}
      {state === "unavailable" && (
        <div className="mx-auto mt-10 max-w-md">
          <h1 className="display text-3xl">Not available</h1>
          <p className="mt-2 text-muted">The admin area is not enabled on this server.</p>
        </div>
      )}
      {state === "out" && <LoginForm onDone={() => setState("in")} />}
      {state === "in" && <Inquiries onSignedOut={signedOut} />}
    </div>
  );
}
