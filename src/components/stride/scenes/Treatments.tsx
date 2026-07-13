import { Link } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";

// Scene 7 — Editorial numbered list. Restrained motion (fade/stagger only).
export function Treatments() {
  return (
    <section aria-label="Treatments" className="stride-section-light py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <div className="eyebrow text-[color:var(--muted-on-light)]">What we treat</div>
            <h2 className="mt-2 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
              Nine areas.<br />One clinical system.
            </h2>
          </div>
          <Link
            to="/treatments"
            className="eyebrow underline-offset-4 hover:text-[color:var(--ember)]"
          >
            → View all treatments
          </Link>
        </div>

        <ol className="border-t border-[color:var(--hairline-light)]">
          {clinic.services.map((s) => (
            <li
              key={s.n}
              className="group grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr_1fr] items-baseline gap-4 md:gap-8 py-6 md:py-8 border-b border-[color:var(--hairline-light)] transition-colors hover:bg-[color:var(--muted)]"
            >
              <span className="font-mono-tech text-sm text-[color:var(--muted-on-light)] pt-2">
                {s.n}
              </span>
              <span className="font-display uppercase text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.95] tracking-tight">
                {s.name}
              </span>
              <span className="col-span-2 md:col-span-1 text-sm md:text-[0.95rem] leading-relaxed text-[color:var(--muted-on-light)] max-w-md">
                {s.desc}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
