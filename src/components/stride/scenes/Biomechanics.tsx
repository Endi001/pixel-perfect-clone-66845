import { useEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";

type Stop = {
  label: string;
  // Where to pan the image (transform-origin percentages) and scale
  ox: number; oy: number; scale: number;
  // Marker position as % of container
  mx: number; my: number;
  // Motion trail arc coords (relative to marker)
  trail: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number };
};

const stops: Stop[] = [
  { label: "GROUND CONTACT", ox: 55, oy: 88, scale: 1.9, mx: 55, my: 87,
    trail: { x1: 8, y1: -30, cx: 30, cy: -60, x2: 60, y2: -20 } },
  { label: "HIP EXTENSION", ox: 52, oy: 55, scale: 2.0, mx: 52, my: 60,
    trail: { x1: -40, y1: 10, cx: -20, cy: -30, x2: 20, y2: -10 } },
  { label: "SHOULDER DRIVE", ox: 48, oy: 30, scale: 1.85, mx: 48, my: 33,
    trail: { x1: 30, y1: -10, cx: 0, cy: -40, x2: -50, y2: -20 } },
];

// Scene 6 — Biomechanics / clinical fusion. Ken Burns pan/zoom + slate annotations.
export function Biomechanics() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches;

    if (prefersReduced || isMobile) {
      // All annotations visible on scroll-into-view
      markerRefs.current.forEach((m) => m && (m.style.opacity = "1"));
      labelRefs.current.forEach((l) => l && (l.style.opacity = "1"));
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.8,
        },
      });

      stops.forEach((s, i) => {
        tl.to(imgRef.current, {
          scale: s.scale,
          transformOrigin: `${s.ox}% ${s.oy}%`,
          ease: "none",
          duration: 1,
        }, i);
        tl.to(markerRefs.current[i], { opacity: 1, scale: 1, duration: 0.3 }, i + 0.4);
        tl.to(labelRefs.current[i], { opacity: 1, x: 0, duration: 0.3 }, i + 0.5);
      });

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
        <img
          ref={imgRef}
          src={stridemedia.biomechanics.src}
          alt="Marathon runner mid-stride on a city street"
          className="w-full h-full object-cover will-change-transform"
          style={{ transformOrigin: "55% 88%", transform: "scale(1.9)" }}
        />
        <div className="absolute inset-0 bg-[color:var(--ink)]/35" />

        {stops.map((s, i) => (
          <div
            key={s.label}
            className="absolute pointer-events-none"
            style={{ left: `${s.mx}%`, top: `${s.my}%` }}
          >
            {/* Open-ring marker (never filled), slate */}
            <div
              ref={(el) => { markerRefs.current[i] = el; }}
              className="relative -translate-x-1/2 -translate-y-1/2"
              style={{ opacity: 0, transform: "translate(-50%,-50%) scale(0.6)" }}
            >
              <div
                className="w-8 h-8 rounded-full border-[1.5px]"
                style={{ borderColor: "var(--slate)" }}
              />
              <div
                className="absolute inset-0 m-auto w-[3px] h-[3px] rounded-full"
                style={{ background: "var(--slate)" }}
              />
              {/* Motion-trail arc, slate */}
              <svg
                className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 overflow-visible"
                width="140" height="80"
                viewBox="-70 -40 140 80"
              >
                <path
                  d={`M ${s.trail.x1} ${s.trail.y1} Q ${s.trail.cx} ${s.trail.cy} ${s.trail.x2} ${s.trail.y2}`}
                  fill="none"
                  stroke="var(--slate)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              </svg>
            </div>

            <div
              ref={(el) => { labelRefs.current[i] = el; }}
              className="absolute font-mono-tech text-[0.7rem] uppercase tracking-[0.18em] whitespace-nowrap"
              style={{
                color: "var(--slate)",
                left: 24, top: -6, opacity: 0, transform: "translateX(-6px)",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
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
