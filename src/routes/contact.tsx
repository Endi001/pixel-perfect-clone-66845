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
                className="bg-[color:var(--ember)] px-6 py-3 text-[color:var(--ember-foreground)] font-medium cursor-pointer"
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
            <iframe
              title="Clinic Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) opacity(0.9) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
