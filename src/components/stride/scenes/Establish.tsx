import { useEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";

// Scene 2 — Zoom-out / brand establish. Immediately follows the hero hard cut.
export function Establish() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Pause offscreen for performance
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative stride-section-dark min-h-[85svh] overflow-hidden"
      aria-label="STRIDE, Ashfield Quay"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={stridemedia.establish.src}
        poster={stridemedia.establish.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/60 via-transparent to-[color:var(--ink)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-8 py-24 md:py-36 min-h-[85svh] flex flex-col justify-end">
        <div className="eyebrow text-[color:var(--text-on-dark)]/85">
          STRIDE Physiotherapy — Ashfield Quay · Movement, rebuilt.
        </div>
        <div className="mt-6 max-w-3xl">
          <p className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95]">
            A physiotherapy clinic for the body that has to keep going.
          </p>
        </div>
      </div>
    </section>
  );
}
