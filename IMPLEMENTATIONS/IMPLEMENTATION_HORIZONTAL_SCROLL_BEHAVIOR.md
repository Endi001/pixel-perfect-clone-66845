# Implementation Plan: Horizontal Scroll Snapping Behavior

## Goal
Modify the `HorizontalRail.tsx` section so that instead of a continuous 1:1 scrub that requires the user to manually scroll through the entire distance, the view snaps to the next "image" (condition screen) automatically once they scroll a little bit.

## Approach: GSAP ScrollTrigger `snap`
Since you are already using GSAP's `ScrollTrigger` to map vertical scroll progress to horizontal movement, the cleanest and most compatible approach is to utilize GSAP's built-in `snap` property on the existing trigger.

- **How it works:** As the user scrolls vertically, the timeline scrubs as it does now. However, the moment they stop scrolling, GSAP will calculate the closest "slide" and automatically animate the timeline to snap precisely onto that slide. 
- **Modifications required in `HorizontalRail.tsx`:**
  - Update the `scrollTrigger` configuration inside the timeline setup to include a `snap` object.
  - Calculate the exact snap increments based on `1 / clinic.conditions.length` (since there are `clinic.conditions.length + 1` total screens).
  - Fine-tune `delay`, `duration`, and `ease` within the snap config to make the snap feel smooth and responsive.

## Implementation Details

**Target File:** `src/components/stride/scenes/HorizontalRail.tsx`

1. Inside the `scrollTrigger` config, add the `snap` property:
   ```javascript
   const totalSlides = clinic.conditions.length;
   const tl = gsap.timeline({
     scrollTrigger: {
       trigger: wrap,
       start: "top top",
       end: () => `+=${distance + hold}`,
       pin: true,
       scrub: 0.7,
       anticipatePin: 1,
       invalidateOnRefresh: true,
       snap: {
         snapTo: 1 / totalSlides, // Snaps to exactly the next slide index
         duration: { min: 0.2, max: 0.6 },
         delay: 0.1, // Wait 100ms after scroll stop before snapping
         ease: "power1.inOut"
       }
     },
   });
   ```

2. We will also adjust the `scrub` and `duration` values to ensure the manual scrub part feels tight enough that a user doesn't have to scroll enormously far just to trigger the next snap.
