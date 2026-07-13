# Implementation Plan: Fix Scrolling Behavior

## Issue Description
When scrolling from the `Manifesto` section ("The body isn't fragile...") to the `HorizontalRail` section, the horizontal section sometimes instantly pops into view instead of smoothly scrolling until the section is fully visible. 

## Root Cause Analysis
The issue is a classic race condition between GSAP `ScrollTrigger` calculating scroll positions and the browser completing its layout. Because the issue happens "sometimes, not always", it is directly tied to loading states:

1. **Font Loading Reflows:** The website uses custom fonts (`Big Shoulders Display`, `General Sans`) and fluid typography (`clamp(...)`). If `ScrollTrigger` calculates its start/end markers *before* the custom fonts have fully loaded, the calculated document height will be wrong. When the fonts finish loading, the `Manifesto` section's height changes. `ScrollTrigger` doesn't automatically know this, so its cached `top top` trigger point for `HorizontalRail` is now at the wrong scroll position, causing it to "pop" or pin prematurely.
2. **Asynchronous GSAP Imports:** Currently, GSAP and `ScrollTrigger` are imported dynamically (`await import("gsap")`) inside `useEffect` in almost every component (`Hero`, `Manifesto`, `HorizontalRail`, `useLenis`). This means `ScrollTrigger` initializes at slightly different times for different sections, leading to inconsistent calculation of trigger markers.
3. **Lenis & ScrollTrigger Pinning:** When `pin: true` is triggered, GSAP adds a `.pin-spacer` wrapper. If the scroll position is miscalculated, the injection of this spacer forces an immediate scroll jump (the "pop").

## Proposed Fixes

### [x] 1. Trigger `ScrollTrigger.refresh()` on Font Load
We need to ensure `ScrollTrigger` recalculates all its markers once the custom fonts are fully loaded and the layout has settled.
- Add an effect to listen for `document.fonts.ready`.
- Once resolved, call `ScrollTrigger.refresh()`.
- *Location:* `src/hooks/use-lenis.ts` (or a new global hook).

### [x] 2. Implement a ResizeObserver for the Document Body
To safeguard against any other dynamic height changes (like images/videos loading late or window resizing affecting clamp text), we should observe the document body for height changes and force a refresh.
- Add a `ResizeObserver` that calls `ScrollTrigger.refresh()`.
- *Location:* `src/hooks/use-lenis.ts`.

### [x] 3. Review `HorizontalRail.tsx` Pinning Configuration
Ensure the `pin` behavior plays nicely with Lenis.
- Add `anticipatePin: 1` to the `HorizontalRail` timeline (this helps GSAP prepare the pin-spacer ahead of time, reducing layout jumps).
- Keep `start: "top top"` as this correctly waits until the vertical scroll brings the section to the very top of the viewport before switching to horizontal.

### [x] 4. (Optional) Preload Critical Fonts
To further minimize the layout shift window, ensure the font stylesheets in `src/routes/__root.tsx` are optimized (they currently use `preconnect`, which is good, but waiting for `document.fonts.ready` is the bulletproof fix).

## Verification Plan
- Load the site with network throttling to delay font/image loading.
- Scroll quickly towards the `HorizontalRail` section.
- Verify that normal vertical scrolling occurs until the top of the horizontal rail touches the top of the viewport.
- Verify that there are no layout jumps or sudden popping of the pinned section.
