# Fix Horizontal Carousel Behavior

This plan addresses two issues with the horizontal-scroll carousel section (`HorizontalRail.tsx`): dead scroll/skipped cards (Issue 1) and abrupt entry/pops (Issue 2).

## Root Causes Identified

1. **Issue 1 (Dead scroll / skipped cards):** 
   - **Double Smoothing:** The app uses Lenis for smooth scrolling, but `ScrollTrigger` is configured with `scrub: 0.7`. This double-smoothing creates a significant lag between the user's scroll position and the animation state, leading to a "dead" feeling.
   - **Snap Conflict:** The `snap` configuration (`snapTo: "labels"`) conflicts with both Lenis and the `scrub` delay. When the user stops scrolling, GSAP attempts to jump the vertical scrollbar to a label while the animation is still catching up, causing massive skips and jumps.
   - **Stale Closure Variables:** The `distance` and `hold` variables were evaluated statically on mount. While `ScrollTrigger.refresh()` is correctly wired up in `use-lenis.ts`, the `end` property (`() => \`+=${distance + hold}\``) uses the stale, hardcoded closure values instead of recalculating dynamically upon resize.

2. **Issue 2 (Abrupt entry/pop):**
   - **AnticipatePin & Snap:** The sudden "pop" straight into horizontal mode is caused by `anticipatePin: 1` coupled with the aggressive `snap` config, which forces the scroll position to align with the `start` label immediately upon crossing the threshold, removing a smooth natural handoff.

## Proposed Changes

### `src/components/stride/scenes/HorizontalRail.tsx`

#### [MODIFY] [HorizontalRail.tsx](file:///d:/Applications/AntigravityFiles/pixel-perfect-clone-66845/src/components/stride/scenes/HorizontalRail.tsx)

1. [x] **Make distance calculations dynamic**:
   - Wrap `distance` and `hold` in getter functions (`getDistance()`, `getHold()`) so they are properly re-evaluated when `ScrollTrigger.refresh()` fires.
   - Update the `end` function to use these getters.

2. [x] **Update ScrollTrigger config**:
   - Remove the `snap` configuration entirely to prevent it from hijacking Lenis and causing jumps.
   - Remove `anticipatePin: 1` to ensure a native, smooth transition into the pinned state.
   - Change `scrub: 0.7` to `scrub: true`. Since Lenis already smooths the scroll natively, GSAP should map 1:1 to prevent double-smoothing delays.

3. [x] **Simplify the timeline**:
   - Since we no longer need `snap` labels, replace the `for` loop of sequential tweens with a single, continuous horizontal pan.
   - Step 1 (Hold): `.to(track, { x: 0, duration: () => getHold(), ease: "none" })`
   - Step 2 (Pan): `.to(track, { x: () => -getDistance(), duration: () => getDistance(), ease: "none" })`
   - Using functional values (`() => ...`) alongside `invalidateOnRefresh: true` ensures GSAP recalculates the layout correctly on resize.

## Verification Plan

### Manual Verification
- Scroll down the page naturally; verify that the transition into the "What we treat" section is smooth and seamless, with no "pop" or sudden jump in position.
- Scroll through the carousel; verify that each card (BACK, SHOULDER, etc.) moves 1:1 with the scroll wheel/trackpad.
- Ensure there are no "dead zones" where scrolling does nothing, and no sudden skips/jumps over cards.
- Resize the browser window and verify that the scroll distances recalculate correctly without breaking the layout.
