import { useLayoutEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stop = {
  label: string;
  // Focal point on the image (0-100). The pan centers this point.
  fx: number; fy: number; scale: number;
  // Optional custom pan target (if you want the marker offset from the center of the screen)
  px?: number; py?: number;
  // Motion trail arc coords (relative to marker), in the un-scaled image space.
  trail: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number };
};

const stops: Stop[] = [
  {
    label: "GROUND CONTACT", fx: 51, fy: 80, scale: 1.5, py: 72, // Zoomed out more and panned slightly up so ground and hip fit
    trail: { x1: 0, y1: 0, cx: 30, cy: -15, x2: 70, y2: -25 }
  },
  {
    label: "HIP EXTENSION", fx: 48, fy: 58, scale: 2.0, py: 52, // Pans to 52%, leaving the hip at 58% lower on the screen
    trail: { x1: 0, y1: 0, cx: 30, cy: -15, x2: 70, y2: -25 }
  },
  {
    label: "SHOULDER DRIVE", fx: 48, fy: 44, scale: 2.2,
    // Mirrored to the left side
    trail: { x1: 0, y1: 0, cx: -30, cy: -15, x2: -70, y2: -25 }
  },
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
    xPercent: -((s.px ?? s.fx) - 50),
    yPercent: -((s.py ?? s.fy) - 50),
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

    // Set initial state zoomed out, centered.
    gsap.set(stageRef.current, { scale: 1, xPercent: 0, yPercent: 0 });

    // Initialize markers natively via GSAP to avoid transform string conflicts
    markerRefs.current.forEach(m => {
      if (m) gsap.set(m, { xPercent: -50, yPercent: -50, scale: 0.6 });
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.8,
      },
    });

    // Zoom into the first stop before showing its marker
    tl.to(stageRef.current, { ...panFor(stops[0]), duration: 1.2 });

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
      {/* We flex-center the stage so that as it overscales the window, it remains perfectly centered */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Stage — locks proportion to ensure markers never drift from the image content. */}
        {/* Assuming a 16:9 ratio where the coordinates were originally plotted. */}
        <div
          ref={stageRef}
          className="relative will-change-transform flex-shrink-0"
          style={{
            width: "max(100vw, 100vh * (16/9))",
            height: "max(100vh, 100vw / (16/9))",
            transformOrigin: "50% 50%"
          }}
        >
          <img
            src={stridemedia.biomechanics.src}
            alt="Marathon runner mid-stride on a city street"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
          {/* Dark overlay moved INSIDE the stage, BEFORE markers, so markers stay bright */}
          <div className="absolute inset-0 bg-[color:var(--ink)]/35 pointer-events-none" />

          {stops.map((s, i) => (
            <div
              key={s.label}
              className="absolute pointer-events-none"
              style={{ left: `${s.fx}%`, top: `${s.fy}%` }}
            >
              <div
                ref={(el) => { markerRefs.current[i] = el; }}
                className="relative"
                style={{ opacity: 0 }}
              >
                <div
                  className="w-8 h-8 rounded-full border-[1.5px]"
                  style={{ borderColor: "white" }}
                />
                <div
                  className="absolute inset-0 m-auto w-[3px] h-[3px] rounded-full"
                  style={{ background: "white" }}
                />
                <svg
                  className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 overflow-visible"
                  width="140" height="80"
                  viewBox="-70 -40 140 80"
                >
                  <path
                    d={`M ${s.trail.x1} ${s.trail.y1} Q ${s.trail.cx} ${s.trail.cy} ${s.trail.x2} ${s.trail.y2}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                </svg>
              </div>

              <div
                className="absolute"
                style={{
                  left: s.trail.x2 + (s.trail.x2 < 0 ? -8 : 8),
                  top: s.trail.y2,
                }}
              >
                <div style={{ transform: s.trail.x2 < 0 ? "translate(-100%, -50%)" : "translateY(-50%)" }}>
                  <div
                    ref={(el) => { labelRefs.current[i] = el; }}
                    className="font-mono-tech text-[0.7rem] uppercase tracking-[0.18em] whitespace-nowrap"
                    style={{
                      color: "white",
                      opacity: 0,
                      transform: `translateX(${s.trail.x2 < 0 ? '6px' : '-6px'})`,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
