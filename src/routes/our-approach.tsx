import { createFileRoute } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";

export const Route = createFileRoute("/our-approach")({
  head: () => ({
    meta: [
      { title: "Our approach — STRIDE Physiotherapy" },
      { name: "description", content: "The four-beat method — assess, treat, rebuild, return — explained. Measured, loaded, honest rehabilitation." },
      { property: "og:title", content: "Our approach — STRIDE Physiotherapy" },
      { property: "og:description", content: "Assess. Treat. Rebuild. Return. The clinical method behind STRIDE." },
    ],
  }),
  component: OurApproachPage,
});

function OurApproachPage() {
  return (
    <div className="stride-section-light">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="eyebrow text-[color:var(--muted-on-light)]">Our approach</div>
          <h1 className="mt-4 font-display uppercase text-[clamp(3rem,10vw,8rem)] leading-[0.88]">
            Assess. Treat.<br />Rebuild. Return.
          </h1>
        </div>
      </section>

      <section className="border-t border-[color:var(--hairline-light)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          {clinic.method.map((m, i) => (
            <div
              key={m.n}
              className="grid md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-12 py-14 md:py-20 border-b border-[color:var(--hairline-light)] items-start"
            >
              <div className="font-mono-tech text-sm text-[color:var(--muted-on-light)]">
                {m.n} / 04
              </div>
              <h2 className="font-display uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95]">
                {m.label}
              </h2>
              <div className="text-[color:var(--muted-on-light)] leading-relaxed">
                <p>{m.body}</p>
                <p className="mt-3 text-sm">
                  {[
                    "You leave the first session knowing exactly what's happening in your body and what the next four weeks look like.",
                    "Hands-on work when it earns its place — never as a substitute for rebuilding capacity.",
                    "Progressive loading, tuned week-by-week to what your body is actually doing between sessions.",
                    "Discharge is a plan, not a goodbye — you leave with the training that keeps this from coming back.",
                  ][i]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
