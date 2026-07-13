import { useEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";

type Stop = {
  label: string;
  // Focus point as % of the image wrapper (also marker position)
  mx: number; my: number;
  // Scale at this stop
  scale: number;
};

// Wide establishing shot then three anatomical focus points.
const stops: Stop[] = [
  { label: "OVERVIEW",       mx: 50, my: 50, scale: 1.15 },
  { label: "GROUND CONTACT", mx: 55, my: 87, scale: 2.2 },
  { label: "HIP EXTENSION",  mx: 52, my: 60, scale: 2.4 },
  { label: "SHOULDER DRIVE", mx: 48, my: 33, scale: 2.2 },
];

// Convert a focus point (% of wrapper) + scale to translate percentages so
// the point lands at wrapper center. transform-origin is center center.
function offsetFor(s: Stop) {
  return {
    xPercent: -(s.mx - 50) * s.scale,
    yPercent: -(s.my - 50) * s.scale,
    scale: s.scale,
  };
}

// Scene 6 — Biomechanics / clinical fusion. One continuous ScrollTrigger
// timeline chains all pan/zoom stops; markers live inside the transformed
// image wrapper so they track the image exactly.
export function Biomechanics() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches;

    if (prefersReduced || isMobile) {
      markerRefs.current.forEach((m) => m && (m.style.opacity = "1"));
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Prime the initial transform to match the first stop exactly so there's
      // no jump when the timeline picks up.
      const first = offsetFor(stops[0]);
      gsap.set(wrapperRef.current, {
        transformOrigin: "50% 50%",
        xPercent: first.xPercent,
        yPercent: first.yPercent,
        scale: first.scale,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Chain sequential .to() tweens — each picks up from the previous state.
      for (let i = 1; i < stops.length; i++) {
        const o = offsetFor(stops[i]);
        tl.to(wrapperRef.current, {
          xPercent: o.xPercent,
          yPercent: o.yPercent,
          scale: o.scale,
          duration: 1,
        });
        // Reveal this stop's marker just as we arrive.
        tl.to(
          markerRefs.current[i],
          { opacity: 1, duration: 0.25 },
          "<0.6",
        );
      }

      cleanup = () => { tl.scrollTrigger?.kill(); tl.kill(); };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Biomechanics freeze-frame"
      className="stride-section-dark relative h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Transformed image wrapper — image + markers move together */}
        <div
          ref={wrapperRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          <img
            src={stridemedia.biomechanics.src}
            alt="Marathon runner mid-stride on a city street"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />

          {stops.map((s, i) =>
            i === 0 ? null : (
              <div
                key={s.label}
                ref={(el) => { markerRefs.current[i] = el; }}
                className="absolute pointer-events-none"
                style={{
                  left: `${s.mx}%`,
                  top: `${s.my}%`,
                  opacity: 0,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full border-[1.5px]"
                    style={{ borderColor: "var(--slate)" }}
                  />
                  <div
                    className="absolute inset-0 m-auto w-[3px] h-[3px] rounded-full"
                    style={{ background: "var(--slate)" }}
                  />
                  <div
                    className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 font-mono-tech uppercase whitespace-nowrap"
                    style={{
                      color: "var(--slate)",
                      fontSize: "0.5rem",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="absolute inset-0 bg-[color:var(--ink)]/35 pointer-events-none" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
        <div className="eyebrow text-[color:var(--muted-on-dark)]">Under the surface</div>
        <p className="mt-3 font-display text-[clamp(1.5rem,3.5vw,3rem)] leading-[1] max-w-2xl">
          Every stride is a chain of decisions your body already knows how to make.
        </p>
      </div>
    </section>
  );
}
