import { clinic } from "@/lib/stride-media";

// Scene 8 — Method cycle: Assess → Treat → Rebuild → Return.
export function Method() {
  return (
    <section id="method" aria-label="Method" className="stride-section-light py-24 md:py-36 border-t border-[color:var(--hairline-light)]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 mb-12">
          <div>
            <div className="eyebrow text-[color:var(--muted-on-light)]">Our method</div>
            <h2 className="mt-2 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
              Assess. Treat.<br />Rebuild. Return.
            </h2>
          </div>
          <p className="text-[color:var(--muted-on-light)] leading-relaxed max-w-lg self-end">
            A four-beat clinical cycle we use for every patient — from the first assessment through
            to the day you don't need us anymore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-[color:var(--hairline-light)]">
          {clinic.method.map((m, i) => (
            <div
              key={m.n}
              className="border-b md:border-b-0 md:border-r last:md:border-r-0 border-[color:var(--hairline-light)] py-8 md:py-10 md:px-8 md:first:pl-0"
              style={{ paddingLeft: i === 0 ? 0 : undefined }}
            >
              <div className="font-mono-tech text-xs text-[color:var(--muted-on-light)]">
                {m.n} / 04
              </div>
              <div className="mt-3 font-display uppercase text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[0.95]">
                {m.label}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-on-light)] max-w-xs">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
