import { createFileRoute } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";
import { useBooking } from "@/components/stride/booking-context";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & book — STRIDE Physiotherapy" },
      { name: "description", content: "Book an assessment at STRIDE Physiotherapy, Ashfield Quay. Address, hours, phone and email." },
      { property: "og:title", content: "Contact — STRIDE Physiotherapy" },
      { property: "og:description", content: "Address, hours and booking for STRIDE Physiotherapy." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { openModal } = useBooking();
  return (
    <div className="stride-section-light">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="eyebrow text-[color:var(--muted-on-light)]">Contact</div>
          <h1 className="mt-4 font-display uppercase text-[clamp(3rem,10vw,8rem)] leading-[0.88]">
            Book an<br />assessment.
          </h1>
        </div>
      </section>

      <section className="border-t border-[color:var(--hairline-light)] py-16">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 grid md:grid-cols-2 gap-10">
          <div>
            <div className="eyebrow text-[color:var(--muted-on-light)] mb-3">Clinic</div>
            <address className="not-italic text-lg leading-8">
              {clinic.address}<br />
              <a className="hover:text-[color:var(--ember)]" href={clinic.phoneLink}>{clinic.phone}</a><br />
              <a className="hover:text-[color:var(--ember)]" href={`mailto:${clinic.email}`}>{clinic.email}</a>
            </address>

            <div className="eyebrow text-[color:var(--muted-on-light)] mt-8 mb-3">Hours</div>
            <ul className="text-lg leading-8">
              {clinic.hours.map((h) => (
                <li key={h.d} className="flex justify-between max-w-xs">
                  <span>{h.d}</span>
                  <span className="text-[color:var(--muted-on-light)]">{h.h}</span>
                </li>
              ))}
            </ul>

            <div className="eyebrow text-[color:var(--muted-on-light)] mt-8 mb-3">Insurance</div>
            <p className="max-w-md text-[color:var(--muted-on-light)]">
              We accept most major insurance plans — ask at booking and we'll confirm your cover.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={openModal}
                className="bg-[color:var(--ember)] px-6 py-3 text-[color:var(--ember-foreground)] font-medium"
                style={{ borderRadius: 3 }}
              >
                Book an assessment
              </button>
              <a
                href={clinic.phoneLink}
                className="px-6 py-3 border border-[color:var(--hairline-light)] hover:border-[color:var(--ember)] hover:text-[color:var(--ember)] transition"
                style={{ borderRadius: 3 }}
              >
                Call {clinic.phone}
              </a>
            </div>
          </div>

          <div className="aspect-[4/3] bg-[color:var(--muted)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(var(--hairline-light) 1px, transparent 1px), linear-gradient(90deg, var(--hairline-light) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="eyebrow text-[color:var(--muted-on-light)]">Map</div>
                <div className="mt-2 font-display text-3xl">Ashfield Quay</div>
                <div className="mt-1 text-sm text-[color:var(--muted-on-light)]">{clinic.address}</div>
              </div>
            </div>
            {/* Ember pin */}
            <div className="absolute" style={{ left: "56%", top: "48%" }}>
              <div className="w-3 h-3 bg-[color:var(--ember)]" style={{ borderRadius: 2 }} />
              <div className="absolute inset-0 animate-ping bg-[color:var(--ember)]/60" style={{ borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
