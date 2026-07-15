import { useEffect, useRef } from "react";
import { useBooking } from "./booking-context";
import { clinic } from "@/lib/stride-media";
import Cal, { getCalApi } from "@calcom/embed-react";

export function BookingModal() {
  const { open, closeModal } = useBooking();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
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

    // Initialize Cal UI configuration with STRIDE branding
    (async function () {
      const cal = await getCalApi({ namespace: "1h" });
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#FF5A36",
            "cal-text": "#14151A",
            "cal-bg": "#F5F3EF",
            "cal-border": "#D6D2C9",
            "cal-muted": "#6f6d67"
          },
          dark: {} // Required by TS
        },
        styles: { branding: { brandColor: "#FF5A36" } }
      });
    })();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
            className="eyebrow px-2 py-1 cursor-pointer"
          >
            Close ×
          </button>
        </div>

        <div className="relative flex-1 overflow-auto bg-[color:var(--bone)]">
          <div className="w-full h-[550px] relative overflow-hidden">
            {open && (
              <Cal
                namespace="1h"
                calLink="endi-b3omc8/1h"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ 
                  layout: "month_view", 
                  useSlotsViewOnSmallScreen: "true",
                  theme: "light"
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
