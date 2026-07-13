import { Link } from "@tanstack/react-router";
import { clinic } from "@/lib/stride-media";

export function Footer() {
  return (
    <footer className="stride-section-dark border-t border-[color:var(--hairline-dark)]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl leading-none">STRIDE</div>
          <div className="eyebrow mt-2 text-[color:var(--muted-on-dark)]">Physiotherapy — Ashfield Quay</div>
          <p className="mt-6 max-w-sm text-[color:var(--muted-on-dark)]">
            Movement, rebuilt. We treat pain, restore mobility, and return people to what they were doing before.
          </p>
        </div>

        <div>
          <div className="eyebrow text-[color:var(--muted-on-dark)] mb-3">Visit</div>
          <address className="not-italic text-sm leading-6">
            {clinic.address}
            <br />
            <a href={clinic.phoneLink} className="hover:text-[color:var(--ember)]">{clinic.phone}</a>
            <br />
            <a href={`mailto:${clinic.email}`} className="hover:text-[color:var(--ember)]">{clinic.email}</a>
          </address>
          <div className="mt-4 eyebrow text-[color:var(--muted-on-dark)] mb-2">Hours</div>
          <ul className="text-sm leading-6">
            {clinic.hours.map((h) => (
              <li key={h.d} className="flex justify-between max-w-[180px]">
                <span>{h.d}</span>
                <span className="text-[color:var(--muted-on-dark)]">{h.h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-[color:var(--muted-on-dark)] mb-3">Site</div>
          <ul className="text-sm space-y-1">
            {[
              { to: "/treatments", label: "Treatments" },
              { to: "/our-approach", label: "Our approach" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-[color:var(--ember)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--hairline-dark)]">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-5 flex flex-wrap gap-2 justify-between eyebrow text-[color:var(--muted-on-dark)]">
          <span>© {new Date().getFullYear()} STRIDE Physiotherapy (fictional demo)</span>
          <span>Movement, rebuilt.</span>
        </div>
      </div>
    </footer>
  );
}
