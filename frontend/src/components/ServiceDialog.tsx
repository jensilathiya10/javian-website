import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { Service } from "../lib/content";

export function ServiceDialog({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  const unlock = useCallback(() => {
    document.body.classList.remove("menu-open");
    onClose();
  }, [onClose]);

  // Close and release scrolling in the same tick; don't wait for the async `close` event.
  const requestClose = useCallback(() => {
    const d = ref.current;
    if (d?.open) d.close();
    unlock();
  }, [unlock]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (service && !d.open) {
      d.showModal();
      document.body.classList.add("menu-open");
    }
    if (!service && d.open) d.close();
  }, [service]);

  // Esc (and any other native close) also releases scrolling; unmount always does.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // A late event from a previous close must not tear down a dialog that was reopened since.
    const onNativeClose = () => {
      if (!d.open) unlock();
    };
    const onCancel = (e: Event) => {
      e.preventDefault(); // Esc: close ourselves so the unlock is synchronous
      requestClose();
    };
    d.addEventListener("close", onNativeClose);
    d.addEventListener("cancel", onCancel);
    return () => {
      d.removeEventListener("close", onNativeClose);
      d.removeEventListener("cancel", onCancel);
      document.body.classList.remove("menu-open");
    };
  }, [unlock, requestClose]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="svc-dialog-title"
      onClick={(e) => e.target === ref.current && requestClose()}
    >
      {service && (
        <div className="p-7 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow !text-cyan">Service {service.num}</p>
              <h3 id="svc-dialog-title" className="display mt-3 text-3xl md:text-4xl">
                {service.title}
              </h3>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-colors hover:border-cyan hover:text-ink"
              onClick={requestClose}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
          <p className="mt-5 text-muted">{service.blurb}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.includes.map((x) => (
              <li key={x} className="flex gap-3 text-sm">
                <span className="mt-2 h-px w-4 shrink-0" style={{ background: "linear-gradient(90deg,#8057ff,#35d9ff)" }} />
                {x}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="btn btn-primary mt-10"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("prefill-service", { detail: service.formValue }));
              requestClose();
            }}
          >
            Start a conversation <span className="arrow" aria-hidden>→</span>
          </a>
        </div>
      )}
    </dialog>
  );
}
