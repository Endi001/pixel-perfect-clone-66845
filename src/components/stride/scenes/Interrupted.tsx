import { useEffect, useRef } from "react";
import { stridemedia } from "@/lib/stride-media";

// Scene 5 — Movement interrupted. Short freeze-frame, greyscale, held-breath beat.
export function Interrupted() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 1.4; // freeze frame at approx impact
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        v.pause();
        v.currentTime = 1.4;
      }
    }, { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Something stops working"
      className="stride-section-dark relative overflow-hidden"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={stridemedia.boxing.src}
          poster={stridemedia.boxing.poster}
          muted
          playsInline
          preload="metadata"
          aria-hidden
          style={{ filter: "grayscale(0.9) contrast(1.05) brightness(0.9)" }}
        />
        <div className="absolute inset-0 bg-[color:var(--ink)]/40" />
        <div className="relative h-full flex items-center justify-center px-6 text-center">
          <div>
            <div className="eyebrow text-[color:var(--muted-on-dark)] mb-4">— beat —</div>
            <p className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] leading-tight max-w-3xl">
              Then something stops working.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
