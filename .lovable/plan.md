## Fixes for Scenes 4, 5, and 6

Only touch the three scene files reported as broken. Everything else stays as-is.

### 1. Scene 4 — HorizontalRail (snap-in issue)

Problem: the pinned horizontal track starts scrubbing the instant the section's top hits the viewport top, so on the transition from Scene 3 → Scene 4 the first video appears to "snap" into place instead of scrolling in normally.

Fix in `src/components/stride/scenes/HorizontalRail.tsx`:
- Add a full-height intro panel as the first child of the horizontal track (before the condition panels) that just shows the first video full-bleed. During the first 1.0 "viewport width" of horizontal travel the track x stays at 0 while the user scroll-settles into the pin — effectively a "held" first frame.
- Simpler and cleaner alternative (preferred): keep the same track, but change the ScrollTrigger to `start: "top top"` unchanged AND extend `end` by `+window.innerHeight` so the first `100vh` of scroll happens with x still at 0 (via a leading `gsap.to` with `x: 0` for 1 unit, then the pan). Concretely, build the tween as a timeline: `tl.to(track, { x: 0, duration: 1 })` then `tl.to(track, { x: -distance, duration: N })`, and set `end: () => \`+=${distance + window.innerHeight}\``. This produces: full vertical settle-in on the first video → then horizontal pan across conditions → then release.
- Keep the mobile fallback untouched.

### 2. Scene 5 — Interrupted (should fill viewport)

Problem: the section is `55svh`/`65svh` so it doesn't cover the full viewport between the horizontal rail and biomechanics.

Fix in `src/components/stride/scenes/Interrupted.tsx`:
- Change wrapper height to `h-[100svh]` on all breakpoints. Video stays `object-cover`, overlay and centered copy layout unchanged.

### 3. Scene 6 — Biomechanics (snapping + misaligned markers)

Two related problems:

**a. Snapping pan/zoom.** The current timeline places three `tl.to(img, ...)` calls all at position `i` (0, 1, 2) with `duration: 1`, so they overlap each other and the image jumps between transform-origins instead of easing between stops. Also each stop uses a different `transformOrigin`, which GSAP cannot interpolate smoothly — changing origin mid-tween causes the visible "snap to top" the user described.

Fix in `src/components/stride/scenes/Biomechanics.tsx`:
- Replace transform-origin animation with a single fixed origin (`50% 50%`) and animate `scale`, `xPercent`, `yPercent` on the image instead. Compute per-stop `xPercent`/`yPercent` from the current `ox/oy` so the same focal point ends up centered — this is what Ken Burns pans actually do and it interpolates smoothly.
- Sequence stops sequentially on the timeline (`">"` position, not integer positions) with an ease (`power2.inOut`) so each transition is a continuous glide instead of overlapping tweens.
- Extend the pin `end` slightly (e.g. `+=260%`) so there's room for the eased transitions plus a hold at each stop.

**b. Marker + label misalignment.** Markers are positioned by `mx/my` percentages on the *container*, but the image is scaled with `transform-origin` at different points, so the markers never track the anatomical features. After switching to a centered-scale pan (above), the fix is:
- Wrap the image AND the markers in a single inner `<div>` that receives the pan/zoom transform. Markers get positioned by `mx/my` percentages relative to that inner div (which is the same coordinate space as the image), so they scale and translate with the image and stay locked to the anatomy.
- Re-check the `mx/my` values against the actual biomechanics photo and adjust to the visible landmarks: foot contact, hip, shoulder. Label offset stays the same (`left: 24, top: -6`).
- Reveal each marker/label at the timeline position where its stop becomes the focal point (using labels like `"stop0"`, `"stop1"`, `"stop2"` on the timeline).

Mobile / reduced-motion fallback stays: no pinning, all markers visible.

### Verification

- Read the three edited files after write.
- Run a Playwright pass at `1280×1800`, scroll from Scene 3 into Scene 6, take screenshots at four checkpoints (rail entry, rail mid, interrupted, biomechanics mid) and confirm: no snap on rail entry, Interrupted fills the viewport, and Biomechanics markers stay on top of the anatomy through the pan.

### Out of scope

Hero, Establish, Manifesto, Treatments, Method, Testimonials, ReturnCTA, nav, footer, booking modal, tokens — untouched.
