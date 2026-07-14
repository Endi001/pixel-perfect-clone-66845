import { useLayoutEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stop = {
  label: string;
  // Focal point on the image (0-100). The pan centers this point.
  fx: number; fy: number; scale: number;
  // Motion trail arc coords (relative to marker), in the un-scaled image space.
  trail: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number };
};

const stops: Stop[] = [
  { label: "GROUND CONTACT", fx: 55, fy: 86, scale: 1.9,
    trail: { x1: 8, y1: -30, cx: 30, cy: -60, x2: 60, y2: -20 } },
  { label: "HIP EXTENSION", fx: 52, fy: 58, scale: 2.0,
    trail: { x1: -40, y1: 10, cx: -20, cy: -30, x2: 20, y2: -10 } },
  { label: "SHOULDER DRIVE", fx: 48, fy: 32, scale: 1.85,
    trail: { x1: 30, y1: -10, cx: 0, cy: -40, x2: -50, y2: -20 } },
];

// Convert focal-point + scale into a translate that centers that point.
// The stage is scaled from its own center (transform-origin 50% 50%),
// so a focal point at (fx, fy)% in the un-scaled image ends up at
// (50 + (fx-50)*scale, 50 + (fy-50)*scale)% after scaling.
// We want it at (50, 50)%, so translate by the delta / scale (because
// translate is applied before scale in `translate() scale()` order? No —
// with `scale(s) translate(tx%, ty%)` the translate is in the scaled
// coordinate system. Simpler: use xPercent/yPercent which GSAP applies
// in element-local %, before scale — so tx% = -(fx-50), ty% = -(fy-50).
function panFor(s: Stop) {
  return {
    scale: s.scale,
    xPercent: -(s.fx - 50),
    yPercent: -(s.fy - 50),
  };
}

// Scene 6 — Biomechanics / clinical fusion. Pan/zoom + slate annotations.
export function Biomechanics() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches;

    if (prefersReduced || isMobile) {
      markerRefs.current.forEach((m) => m && (m.style.opacity = "1"));
      labelRefs.current.forEach((l) => l && (l.style.opacity = "1"));
      return;
    }

    let cleanup: (() => void) | undefined;

    // Set initial state to the first stop so there's no jump on enter.
    gsap.set(stageRef.current, panFor(stops[0]));

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.8,
        refreshPriority: 0,
      },
    });

    stops.forEach((s, i) => {
      // Reveal the current marker/label first
      tl.to(markerRefs.current[i], { opacity: 1, scale: 1, duration: 0.3 }, ">");
      tl.to(labelRefs.current[i], { opacity: 1, x: 0, duration: 0.3 }, "<");
      // Hold at this focal point
      tl.to({}, { duration: 0.6 });
      // Glide to the next stop (except after the last one)
      if (i < stops.length - 1) {
        tl.to(stageRef.current, { ...panFor(stops[i + 1]), duration: 1.2 });
      } else {
        tl.to({}, { duration: 0.6 });
      }
    });

    cleanup = () => { tl.scrollTrigger?.kill(); tl.kill(); };

    return () => { cleanup?.(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Biomechanics freeze-frame"
      className="stride-section-dark relative h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Stage — image + markers share this transform so markers track anatomy */}
        <div
          ref={stageRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          <img
            src={stridemedia.biomechanics.src}
            alt="Marathon runner mid-stride on a city street"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />

          {stops.map((s, i) => (
            <div
              key={s.label}
              className="absolute pointer-events-none"
              style={{ left: `${s.fx}%`, top: `${s.fy}%` }}
            >
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

        <div className="absolute inset-0 bg-[color:var(--ink)]/35 pointer-events-none" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10 pointer-events-none">
        <div className="eyebrow text-[color:var(--muted-on-dark)]">Under the surface</div>
        <p className="mt-3 font-display text-[clamp(1.5rem,3.5vw,3rem)] leading-[1] max-w-2xl">
          Every stride is a chain of decisions your body already knows how to make.
        </p>
      </div>
    </section>
  );
}
