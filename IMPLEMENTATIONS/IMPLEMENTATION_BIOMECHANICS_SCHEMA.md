# Biomechanics Section Schema Implementation

## Issue Diagnosis
The user reported two main issues with the `Biomechanics` section:
1. **Highlights not visible enough**: The markers and labels are obscured or lack contrast. 
2. **Highlights not aligned**: The markers do not correctly align with the runner's anatomy (Ground Contact, Hip Extension, Shoulder Drive).

### Root Causes
**1. Visibility**
- The dark overlay `<div className="absolute inset-0 bg-[color:var(--ink)]/35 pointer-events-none" />` is currently rendered *after* the `stageRef` which contains both the image and the markers. This means the dark overlay is covering the markers, significantly reducing their brightness and visibility.
- The markers currently use `var(--slate)` which is a grayish color. Changing them to a brighter color like `var(--text-on-dark)` (white) or `var(--ember)` might improve visibility.

**2. Alignment**
- **GSAP Transform Conflict**: The markers have `style={{ transform: "translate(-50%,-50%) scale(0.6)" }}`. When GSAP animates the `scale` to `1` in the timeline, it can overwrite or misinterpret the inline string `transform`, causing the `-50%` translation to be lost and throwing off the alignment.
- **Aspect Ratio & Object Cover**: The `img` is set to `object-cover` inside a container that fills the screen. Because `object-cover` dynamically crops the image based on the window's aspect ratio, placing markers at fixed percentages (e.g., `left: 55%, top: 86%`) relative to the viewport container means the markers will float around and decouple from the image content when the window is resized. 

## Proposed Solution

### Fix 1: Improve Visibility
- Move the dark overlay (`bg-[color:var(--ink)]/35`) *inside* the `stageRef`, placing it immediately after the `img` and *before* the markers. This will darken the background image while keeping the markers fully bright and unaffected by the wash.
- Optionally, change the marker and label color from `var(--slate)` to `white` or `var(--text-on-dark)` for sharper contrast.

### Fix 2: Correct Alignment
- **Fix GSAP Transforms**: Remove the inline string transforms and rely entirely on GSAP to set and animate the transforms using `xPercent: -50, yPercent: -50` for proper centering.
- **Fix Coordinate System**: To ensure markers stay perfectly glued to the image's anatomy regardless of the viewport aspect ratio, we must change how `stageRef` is sized. 
  - We can make `stageRef` exactly match the intrinsic aspect ratio of the image (e.g., assuming a 16:9 or similar ratio).
  - We can apply custom logic to scale the `stageRef` to cover the screen (simulating `object-cover`), ensuring the coordinate system inside `stageRef` perfectly matches the image.
  - *Alternatively*, we can just adjust the `fx` and `fy` coordinates if they are simply placed wrong, but if they drift on window resize, we must use the aspect-ratio wrapping approach.

## Next Steps
Once the user reviews and approves this schema, we will proceed with code modifications in `Biomechanics.tsx`.
