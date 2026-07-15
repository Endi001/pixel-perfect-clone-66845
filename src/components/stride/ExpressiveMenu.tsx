import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useBooking } from "./booking-context";

const items = [
  { to: "/", label: "Home" },
  { to: "/treatments", label: "Treatments" },
  { to: "/our-approach", label: "Our approach" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function ExpressiveMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { openModal } = useBooking();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          "a,button,[tabindex]:not([tabindex='-1'])"
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-50 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      // Strike-phase open (<250ms)
      style={{ transitionDuration: "220ms", transitionTimingFunction: "var(--ease-strike)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        ref={panelRef}
        className="absolute inset-0 bg-[color:var(--ink)] text-[color:var(--text-on-dark)] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 md:px-8 h-16 border-b border-[color:var(--hairline-dark)]">
          <span className="font-display text-[1.35rem]">STRIDE</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close menu"
            className="eyebrow flex items-center gap-2 hover:text-[color:var(--ember)] transition-colors"
          >
            Close
            <span aria-hidden className="inline-block w-4 h-[1.5px] bg-current relative">
              <span className="absolute inset-0 rotate-90 bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-5 md:px-16">
          <ul className="space-y-1 md:space-y-3">
            {items.map((it, i) => {
              const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
              return (
                <li
                  key={it.to}
                  style={{
                    // Drive-phase stagger
                    transition: "transform 700ms var(--ease-drive), opacity 700ms var(--ease-drive)",
                    transitionDelay: `${open ? 80 + i * 60 : 0}ms`,
                    transform: open ? "translateY(0)" : "translateY(24px)",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <Link
                    to={it.to}
                    onClick={onClose}
                    className="group inline-flex items-baseline gap-6"
                  >
                    <span className="font-mono-tech text-xs text-[color:var(--muted-on-dark)] w-6">
                      0{i + 1}
                    </span>
                    <span className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight relative">
                      {it.label}
                      <span
                        className={[
                          "absolute left-0 right-0 -bottom-1 h-[3px] bg-[color:var(--ember)] origin-left transition-transform",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        ].join(" ")}
                        style={{
                          transitionDuration: "400ms",
                          transitionTimingFunction: "var(--ease-drive)",
                        }}
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            <button
              onClick={() => { onClose(); }}
              data-cal-namespace="1h"
              data-cal-link="endi-b3omc8/1h"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              className="bg-[color:var(--ember)] px-6 py-3 text-[color:var(--ember-foreground)] font-medium cursor-pointer"
              style={{ borderRadius: 3 }}
            >
              Book an assessment
            </button>
            <a href="tel:+15550182044" className="eyebrow underline-offset-4 hover:underline">
              or call (555) 018-2044
            </a>
          </div>
        </nav>

        <div className="border-t border-[color:var(--hairline-dark)] px-5 md:px-8 py-4 eyebrow text-[color:var(--muted-on-dark)] flex justify-between">
          <span>Ashfield Quay</span>
          <span>Mon–Fri 07–19 · Sat 09–13</span>
        </div>
      </div>
    </div>
  );
}
