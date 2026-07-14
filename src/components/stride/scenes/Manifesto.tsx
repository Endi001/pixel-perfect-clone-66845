import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scene 3 — Kinetic manifesto. Word-by-word scroll-linked reveal.
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const words = wordsRef.current?.querySelectorAll(".m-word");
    if (!words || words.length === 0) return;

    gsap.set(words, { opacity: 0.12, y: 20 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.6,
      },
    });
    // Drive-phase, roughly one word per 80px
    tl.to(words, { opacity: 1, y: 0, stagger: 0.04, ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const line = "The body isn't fragile. It's undertrained for what happened to it.";
  const words = line.split(" ");

  return (
    <section
      ref={sectionRef}
      className="stride-section-light py-32 md:py-44"
      aria-label="Manifesto"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="eyebrow text-[color:var(--muted-on-light)] mb-8">A working belief</div>
        <div ref={wordsRef} className="font-display leading-[0.9] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.25rem, 7.5vw, 7rem)" }}>
          {words.map((w, i) => (
            <span key={i} className="m-word inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </div>
        <p className="mt-10 measure-text text-[color:var(--muted-on-light)] leading-relaxed">
          We don't manage you back to careful. We rebuild capacity — so what hurt you once has less
          purchase the next time it tries.
        </p>
      </div>
    </section>
  );
}
