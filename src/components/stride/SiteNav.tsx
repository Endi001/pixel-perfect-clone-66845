import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExpressiveMenu } from "./ExpressiveMenu";
import { useBooking } from "./booking-context";

const links = [
  { to: "/", label: "Home" },
  { to: "/treatments", label: "Treatments" },
  { to: "/our-approach", label: "Our approach" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useBooking();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = pathname === "/";
  // On home, nav is transparent-over-dark until scrolled past hero.
  const solid = !onHome || scrolled;

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-colors duration-500",
          solid ? "bg-[color:var(--bone)] text-[color:var(--text-on-light)] border-b border-[color:var(--hairline-light)]"
                : "bg-transparent text-[color:var(--text-on-dark)]",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-drive)" }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-2 group" aria-label="STRIDE home">
            <span className="font-display text-[1.35rem] leading-none tracking-[0.02em]">
              STRIDE
            </span>
            <span
              className={[
                "eyebrow hidden md:inline transition-opacity",
                solid ? "opacity-70" : "opacity-70",
              ].join(" ")}
            >
              Physiotherapy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative text-sm tracking-wide group"
                >
                  {l.label}
                  <span
                    className={[
                      "absolute -bottom-1 left-0 h-[2px] w-full bg-[color:var(--ember)] transition-transform origin-left",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={openModal}
              className="hidden sm:inline-flex items-center gap-2 bg-[color:var(--ember)] px-4 py-2 text-sm text-[color:var(--ember-foreground)] font-medium hover:brightness-95 transition cursor-pointer"
              style={{ borderRadius: 3 }}
            >
              Book
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex flex-col justify-center items-end gap-[5px] p-2 cursor-pointer"
            >
              <span className="block h-[1.5px] w-6 bg-current" />
              <span className="block h-[1.5px] w-4 bg-current" />
            </button>
          </div>
        </div>
      </header>

      <ExpressiveMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
