import { clinic } from "@/lib/stride-media";

// Scene 9 — Trust / testimonials. Quiet, text-forward proof beat.
export function Testimonials() {
  return (
    <section aria-label="Testimonials" className="stride-section-light py-24 md:py-32 border-t border-[color:var(--hairline-light)]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--ember)" aria-hidden>
                <path d="M12 2 15 9l7 .8-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.4L2 9.8 9 9z" />
              </svg>
            ))}
          </div>
          <div className="eyebrow text-[color:var(--muted-on-light)]">What patients say</div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {clinic.testimonials.map((t, i) => (
            <figure key={i} className="border-t border-[color:var(--hairline-light)] pt-6">
              <blockquote className="text-[1.05rem] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-mono-tech text-xs text-[color:var(--muted-on-light)]">
                {t.name} — {t.context}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
