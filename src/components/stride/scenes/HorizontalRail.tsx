import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { stridemedia, clinic } from "@/lib/stride-media";

// Scene 4 — Horizontal acceleration sequence.
// Two persistent video layers (wide + close-up) stay mounted for the whole
// horizontal scroll; word panels are transparent text overlays only.
export function HorizontalRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wideVideoRef = useRef<HTMLVideoElement>(null);
  const closeVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches;
    if (prefersReduced || isMobile) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const wrap = wrapRef.current!;
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top+=50",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Both persistent videos begin playing once when the scene is in view.
      const startVideos = () => {
        wideVideoRef.current?.play().catch(() => {});
        closeVideoRef.current?.play().catch(() => {});
      };
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) startVideos();
          }
        },
        { threshold: 0.1 },
      );
      io.observe(wrap);

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        io.disconnect();
      };
    })();

    return () => { cancelled = true; cleanup?.(); };
  }, []);

  const panels = clinic.conditions;

  return (
    <section aria-label="What we treat" className="stride-section-dark relative">
      {/* Mobile fallback — vertical stack */}
      <div className="md:hidden relative">
        <video
          className="w-full h-[60svh] object-cover"
          src={stridemedia.railLayers.wide}
          poster={stridemedia.establish.poster}
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay
          aria-hidden
        />
        <div className="absolute inset-0 bg-[color:var(--ink)]/40" />
        <div className="relative -mt-[60svh] h-[60svh] flex flex-col items-center justify-center gap-3">
          {panels.map((c) => (
            <div key={c} className="font-display text-4xl">{c}</div>
          ))}
        </div>
        <div className="py-12 px-5 text-center">
          <Link to="/treatments" className="eyebrow underline-offset-4 underline hover:text-[color:var(--ember)]">
            → See every condition we treat
          </Link>
        </div>
      </div>

      {/* Desktop horizontal rail */}
      <div ref={wrapRef} className="hidden md:block relative h-[100svh] overflow-hidden">
        {/* Persistent video layers — never remount */}
        <div className="absolute inset-0 pointer-events-none">
          <video
            ref={wideVideoRef}
            className="absolute inset-0 w-1/2 h-full object-cover"
            src={stridemedia.railLayers.wide}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <video
            ref={closeVideoRef}
            className="absolute inset-y-0 right-0 w-1/2 h-full object-cover"
            src={stridemedia.railLayers.closeup}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[color:var(--ink)]/50" />
        </div>

        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex will-change-transform"
          style={{ width: `${(panels.length + 1) * 100}vw` }}
        >
          {panels.map((word, i) => (
            <div key={word} className="relative w-screen h-full shrink-0">
              <div className="relative h-full flex items-center justify-center px-10">
                <div className="font-display uppercase text-[color:var(--text-on-dark)] leading-[0.85]"
                  style={{ fontSize: "clamp(6rem, 22vw, 24rem)" }}>
                  {word}
                </div>
              </div>
              <div className="absolute top-8 left-10 eyebrow text-[color:var(--muted-on-dark)]">
                0{i + 1} / 0{panels.length}
              </div>
            </div>
          ))}
          {/* End card */}
          <div className="relative w-screen h-full shrink-0 flex items-center justify-center">
            <div className="text-center">
              <div className="eyebrow text-[color:var(--muted-on-dark)] mb-4">And a lot more</div>
              <Link
                to="/treatments"
                className="inline-block font-display text-[clamp(2.5rem,6vw,5rem)] uppercase hover:text-[color:var(--ember)] transition-colors"
              >
                → See every condition we treat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
