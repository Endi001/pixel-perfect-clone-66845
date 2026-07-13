import { useEffect, useRef, useState } from "react";
import { useBooking } from "./booking-context";
import { clinic } from "@/lib/stride-media";

export function BookingModal() {
  const { open, closeModal } = useBooking();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEmbedFailed(false);
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>(
          "a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])"
        );
        if (!f || f.length === 0) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);

    // Calendly embed placeholder — mark failed after 6s so user can see the fallback.
    const t = window.setTimeout(() => setEmbedFailed(true), 6000);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open, closeModal]);

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-[60] transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      style={{ transitionDuration: "220ms", transitionTimingFunction: "var(--ease-strike)" }}
    >
      {/* Backdrop */}
      <button
        aria-label="Close booking dialog"
        onClick={closeModal}
        className="absolute inset-0 bg-[color:var(--ink)]/70 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className={[
          "absolute bg-[color:var(--bone)] text-[color:var(--text-on-light)]",
          "left-0 right-0 bottom-0 top-16 md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2",
          "md:w-[480px] md:max-h-[85vh] w-full",
          "flex flex-col",
        ].join(" ")}
        style={{
          borderRadius: 4,
          transform: open ? undefined : "scale(0.98)",
          transition: "transform 220ms var(--ease-strike)",
        }}
      >
        <span id="booking-title" className="sr-only">Book an assessment</span>

        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--hairline-light)]">
          <div>
            <div className="eyebrow text-[color:var(--muted-on-light)]">Book</div>
            <div className="font-display text-2xl leading-none mt-1">An assessment</div>
          </div>
          <button
            ref={closeRef}
            onClick={closeModal}
            aria-label="Close"
            className="eyebrow px-2 py-1"
          >
            Close ×
          </button>
        </div>

        <div className="relative flex-1 overflow-auto">
          <div
            data-calendly-embed
            className="aspect-[4/5] md:aspect-[3/4] w-full bg-[color:var(--muted)] relative overflow-hidden"
          >
            {/* Skeleton shimmer while a real Calendly embed would load */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)",
                backgroundSize: "200% 100%",
                animation: "stride-shimmer 1.6s linear infinite",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="eyebrow text-[color:var(--muted-on-light)]">
                {embedFailed ? "Scheduler unavailable" : "Loading scheduler…"}
              </div>
            </div>
          </div>

          {embedFailed && (
            <div className="p-5 border-t border-[color:var(--hairline-light)]">
              <p className="text-sm text-[color:var(--muted-on-light)] mb-3">
                Our booking system didn't load. You can reach us directly:
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <a className="hover:text-[color:var(--ember)]" href={clinic.phoneLink}>
                  Call {clinic.phone}
                </a>
                <a className="hover:text-[color:var(--ember)]" href={`mailto:${clinic.email}`}>
                  Email {clinic.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes stride-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </div>
  );
}
