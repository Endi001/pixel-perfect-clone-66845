# Vertical to Horizontal Transition Fix

## Issue Description
The user experienced an abrupt transition from the vertical scrolling `Manifesto` section to the `HorizontalRail` ("BACK.") section. Instead of the user naturally scrolling the "BACK." section fully into the viewport before horizontal scrolling begins, the "BACK." section "instantly popped up" or switched abruptly, taking up the whole screen prematurely.

## Root Cause Analysis
The abrupt switch was caused by a combination of asynchronous GSAP initializations and inverted ScrollTrigger calculation orders that resulted in downstream triggers measuring falsely high coordinates:

1. **Upstream Asynchronous Pinning (`Hero.tsx`)**: The `Hero` section at the top of the page pins its content, which adds `100vh` of invisible `.pin-spacer` padding to the document. Because `Hero.tsx` loaded GSAP asynchronously (`await import("gsap")`) inside a standard `useEffect`, it was inserting this `100vh` spacer *after* downstream components had already recorded their starting scroll offsets.
2. **Inverted `refreshPriority` Declarations**: `Manifesto`, `HorizontalRail`, and `Biomechanics` had manually assigned `refreshPriority` values (`2`, `1`, and `0` respectively). Because `refreshPriority` overrides natural DOM order, GSAP was forced to calculate their ScrollTrigger offsets *before* calculating `Hero` (which had no priority and defaulted to 0). As a result, `HorizontalRail` recorded a `start` coordinate that was `100vh` too high. 
3. **The Layout Snap**: When the user scrolled down past `Manifesto`, they hit this incorrectly low trigger coordinate early, causing the "BACK." section to instantly snap into its pinned state instead of natively scrolling into view.

## Implemented Steps

### 1. [x] Synchronize GSAP Initialization Across Components
- Converted `Manifesto.tsx`, `Hero.tsx`, `ReturnCTA.tsx`, and `use-lenis.ts` to use synchronous top-level GSAP imports.
- Removed asynchronous `await import(...)` patterns from within component hooks to ensure GSAP executes predictably on the first render pass.

### 2. [x] Convert to `useLayoutEffect`
- Upgraded `useEffect` to `useLayoutEffect` across all animated sections. This guarantees that DOM mutations and ScrollTrigger calculations occur synchronously after paint operations but before the browser yields to the screen, preventing intermediate unstyled layout flashes.

### 3. [x] Remove `refreshPriority` to Enable Natural DOM Sorting
- Deleted all `refreshPriority` assignments from `Manifesto.tsx`, `HorizontalRail.tsx`, and `Biomechanics.tsx`. 
- By removing these explicit overrides, GSAP falls back to its default behavior: sorting ScrollTriggers by their literal position in the DOM from top to bottom. This ensures the `Hero` pin-spacer is measured first, correctly cascading the `100vh` offset down to `HorizontalRail`.

## Verification Results
- Scroll transition from the "Manifesto" text to the "BACK." horizontal rail was tested.
- The "BACK." section now smoothly and naturally slides into the viewport from the bottom of the screen.
- Horizontal pinning and lateral panning only trigger exactly when the container perfectly hits the `"top top"` of the viewport.
- All layout jumping, popping, and skipping has been eliminated.
