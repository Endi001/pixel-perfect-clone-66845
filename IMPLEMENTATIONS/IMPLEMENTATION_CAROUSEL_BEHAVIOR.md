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

## PART 2: Fixing Layout Thrashing and Section Overlap

### Root Causes Identified
The issue where subsequent sections (like Biomechanics) "pop up suddenly" and overlap with the horizontal scroll section is caused by **GSAP ScrollTrigger Layout Thrashing due to Asynchronous Initialization**.
- When `pin: true` is used, GSAP adds a massive `.pin-spacer` to the DOM, increasing the page height.
- Because `HorizontalRail` and `Biomechanics` dynamically import GSAP (`await import("gsap")`) inside `useEffect`, their ScrollTriggers are created in a non-deterministic order.
- If a section lower down the page (Biomechanics) initializes its trigger before a section higher up (HorizontalRail) adds its pin spacer, the lower section's start/end coordinates will be completely wrong. When you scroll down, it will trigger way too early.

### Proposed Changes

1. [x] **Synchronous GSAP Imports:**
   - Move GSAP imports to the top level of the files (`import gsap from "gsap"`, `import { ScrollTrigger } from "gsap/ScrollTrigger"`) in both `HorizontalRail.tsx` and `Biomechanics.tsx`.
   - Ensure `gsap.registerPlugin(ScrollTrigger)` is called appropriately.
2. [x] **Coordinate ScrollTrigger Refresh:**
   - Since standard React `useEffect` hooks run bottom-up, we need to assign `refreshPriority` to the ScrollTriggers so GSAP calculates layouts top-to-bottom (e.g., `refreshPriority: 1` for HorizontalRail, `refreshPriority: 0` for Biomechanics).
3. [x] **Remove dynamic async import blocks:**
   - Replace the `(async () => { ... })()` pattern inside `useEffect` with standard synchronous initialization for both components.

## PART 3: Forcing Global Refresh & Lifecycle Sync

### Root Causes Identified
Even with `refreshPriority` set, `Biomechanics` is still overlapping `HorizontalRail` and causing a massive white gap below `Interrupted.tsx`. 
This happens because **React's `useEffect` runs bottom-up, but GSAP does not automatically recalculate all existing triggers when a new one is created.**
1. `Biomechanics` runs its `useEffect` and creates a trigger, measuring its `top` position.
2. `HorizontalRail` runs its `useEffect` (after Biomechanics) and adds a `700vw` pin spacer.
3. Although `HorizontalRail` refreshes *itself*, it does **not** force `Biomechanics` to refresh its already-recorded `top` position. Thus, `Biomechanics` still thinks it should trigger at its original, un-spacered position!
4. The user scrolls down. `Biomechanics` triggers early (while the user is looking at "NECK." in `HorizontalRail`), pins itself on top of the screen, finishes its scrub animation, and then unpins.
5. When the user finally reaches where `Biomechanics` *should* be (below `Interrupted`), the animation is completely finished and the pin-spacer is just an empty white gap.

### Proposed Changes

1. [x] **Change `useEffect` to `useLayoutEffect`:**
   - In both `HorizontalRail.tsx` and `Biomechanics.tsx`, switch from `useEffect` to `useLayoutEffect`. This ensures the DOM mutations and ScrollTrigger creations happen synchronously before the browser paints.
2. [x] **Force a Global `ScrollTrigger.refresh()` in Parent:**
   - Open `src/routes/index.tsx` (the parent container for these scenes).
   - Add a `useEffect` that calls `ScrollTrigger.refresh()` after a short timeout or immediately. Because parent `useEffect`s fire *after* all child `useEffect`s, this guarantees that all `ScrollTrigger`s have been created and registered. When this global refresh fires, GSAP will use the `refreshPriority` we set in Part 2 to sort them, apply `HorizontalRail`'s pin spacer first, and then correctly calculate `Biomechanics`'s start point!
