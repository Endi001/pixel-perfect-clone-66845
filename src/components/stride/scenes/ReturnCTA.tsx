import { useEffect, useLayoutEffect, useRef } from "react";
import { stridemedia, clinic } from "@/lib/stride-media";
import { useBooking } from "../booking-context";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scene 10 — Return to movement / booking CTA.
// Warm gold overlay scroll-linked (Flight-phase) atop the sunset clip.
export function ReturnCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openModal } = useBooking();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => { });
      else v.pause();
    }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

      const tw = gsap.fromTo(
        overlayRef.current,
        { backgroundColor: "rgba(16, 17, 19, 0.55)" },
        {
          backgroundColor: "rgba(255, 158, 66, 0.28)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );

    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Book" className="stride-section-dark relative overflow-hidden">
      <div className="relative min-h-[90svh]">
        <video
          ref={videoRef}
          src={stridemedia.sunset.src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        <div ref={overlayRef} className="absolute inset-0 transition-none" />
        <div className="relative min-h-[90svh] flex flex-col justify-end px-5 md:px-8 py-16 md:py-24 mx-auto max-w-[1400px]">
          <div className="eyebrow text-[color:var(--text-on-dark)]/85 mb-6">Return to movement</div>
          <h2 className="font-display uppercase leading-[0.88] text-[color:var(--text-on-dark)] tracking-[-0.01em]"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
            Get your <br className="hidden md:inline" />momentum back.
          </h2>
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
              className="px-6 py-3 border border-[color:var(--hairline-dark-strong)] text-[color:var(--text-on-dark)] hover:border-[color:var(--ember)] hover:text-[color:var(--ember)] transition"
              style={{ borderRadius: 3 }}
            >
              or call {clinic.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
