import { createFileRoute } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — STRIDE Physiotherapy Clinic Ashfield Quay" },
      { name: "description", content: "Meet the specialist team behind STRIDE Physiotherapy in Ashfield Quay. We believe the body isn't fragile — it's undertrained for what happened to it." },
      { property: "og:title", content: "About STRIDE Physiotherapy — The Clinic & Team" },
      { property: "og:description", content: "Meet our physiotherapists and learn our evidence-based treatment methodology in Ashfield Quay." },
      { property: "og:url", content: "https://stridephysio.ie/about" },
      { name: "twitter:title", content: "About Us — STRIDE Physiotherapy" },
      { name: "twitter:description", content: "Meet our physiotherapists and learn our evidence-based treatment methodology in Ashfield Quay." },
    ],
    links: [{ rel: "canonical", href: "https://stridephysio.ie/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="stride-section-light">
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="eyebrow text-[color:var(--muted-on-light)]">About</div>
          <h1 className="mt-4 font-display uppercase text-[clamp(3rem,10vw,8rem)] leading-[0.88]">
            The body isn't fragile.
          </h1>
          <p className="mt-8 measure-text text-[color:var(--muted-on-light)] leading-relaxed text-lg">
            STRIDE opened in Ashfield Quay to do one thing well: return people to full capacity — however
            that capacity is measured in their life. That means older patients rebuilding after surgery,
            desk workers coming back from six months of low-back flare, and Sunday-league runners a
            month out from an event. Same clinic, same method.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-[color:var(--hairline-light)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="eyebrow text-[color:var(--muted-on-light)] mb-8">The team</div>
          <div className="grid gap-8 md:grid-cols-3">
            {clinic.team.map((p, i) => (
              <article
                key={p.name}
                className="group border-t border-[color:var(--hairline-light)] pt-6 transition-transform"
                style={{ transitionDuration: "600ms", transitionTimingFunction: "var(--ease-drive)" }}
              >
                <div className="aspect-[4/5] bg-[color:var(--muted)] overflow-hidden mb-5 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition"
                    style={{
                      backgroundImage: `url(https://images.pexels.com/photos/${["30423030","27684610","13831341"][i]}/pexels-photo-${["30423030","27684610","13831341"][i]}.jpeg?auto=compress&cs=tinysrgb&w=1200)`,
                      transitionDuration: "700ms",
                      transitionTimingFunction: "var(--ease-drive)",
                    }}
                  />
                </div>
                <div className="font-mono-tech text-xs text-[color:var(--muted-on-light)]">0{i + 1}</div>
                <h3 className="mt-2 font-display text-2xl uppercase leading-none">{p.name}</h3>
                <div className="mt-2 text-sm">{p.role}</div>
                <div className="text-sm text-[color:var(--muted-on-light)]">{p.cred}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
