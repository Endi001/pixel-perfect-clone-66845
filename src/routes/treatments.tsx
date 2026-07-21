import { createFileRoute } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";

export const Route = createFileRoute("/treatments")({
  head: () => ({
    meta: [
      { title: "Physiotherapy Treatments & Services — STRIDE Ashfield Quay" },
      { name: "description", content: "Comprehensive physiotherapy treatments: back pain, joint mobility, sports injuries, post-op rehab, chronic pain, and manual physical therapy in Ashfield Quay." },
      { property: "og:title", content: "Physiotherapy Treatments — STRIDE Ashfield Quay" },
      { property: "og:description", content: "Targeted physical therapy treatments for back pain, joint mobility, post-op recovery, and athletic injuries." },
      { property: "og:url", content: "https://stridephysio.ie/treatments" },
      { name: "twitter:title", content: "Physiotherapy Treatments — STRIDE Ashfield Quay" },
      { name: "twitter:description", content: "Targeted physical therapy treatments for back pain, joint mobility, post-op recovery, and athletic injuries." },
    ],
    links: [{ rel: "canonical", href: "https://stridephysio.ie/treatments" }],
  }),
  component: TreatmentsPage,
});

function TreatmentsPage() {
  return (
    <div className="stride-section-light">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[color:var(--hairline-light)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="eyebrow text-[color:var(--muted-on-light)]">What we treat</div>
          <h1 className="mt-4 font-display uppercase text-[clamp(3rem,10vw,8rem)] leading-[0.88] tracking-[-0.01em]">
            Nine areas.<br />One clinical system.
          </h1>
          <p className="mt-8 measure-text text-[color:var(--muted-on-light)] leading-relaxed">
            Every area below sits inside the same four-beat method: assess, treat, rebuild, return.
            No per-condition detail pages — the plan is built around you, not a template.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <ol className="border-t border-[color:var(--hairline-light)]">
            {clinic.services.map((s) => (
              <li key={s.n} className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] items-baseline gap-4 md:gap-10 py-8 md:py-10 border-b border-[color:var(--hairline-light)]">
                <span className="font-mono-tech text-sm text-[color:var(--muted-on-light)] pt-2">{s.n}</span>
                <span className="font-display uppercase text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.95]">{s.name}</span>
                <p className="col-span-2 md:col-span-1 text-[0.95rem] leading-relaxed text-[color:var(--muted-on-light)] max-w-lg">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
