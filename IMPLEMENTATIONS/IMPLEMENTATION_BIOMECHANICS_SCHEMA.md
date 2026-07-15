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

## Part 2: Addressing Positioning Across Screen Sizes

### Understanding the Problem
- [x] Identify that the container (`stageRef`) is set to the full screen size (`absolute inset-0`).
- [x] Identify that the image uses `object-cover`, which dynamically resizes and crops the image to fill the screen depending on the screen's aspect ratio.
- [x] Identify that the markers are positioned using fixed percentages relative to the screen container, not the image content.
- [x] Conclude that because `object-cover` shifts and crops the image differently on varying screen sizes, the marker positions will inherently misalign with the specific anatomical points on the image.

### Proposed Implementation
- [x] Create a "stage" container that maintains the exact intrinsic aspect ratio of the original image.
- [x] Implement CSS logic (e.g., using `max()` functions) to scale this stage container so it always covers the entire viewport, mimicking the `object-cover` behavior.
- [x] Center this stage within the viewport.
- [x] Apply the percentage-based positions for the markers relative to this new, proportion-locked stage. This ensures markers remain locked to the image content regardless of the browser window's aspect ratio.

## Part 3: Addressing Full Image Visibility (Safe Area & Quality)

### Understanding the Problem
- [x] Identify that making the image cover the viewport means aggressive cropping is mathematically inevitable on varying aspect ratios (e.g., sides are cropped on tall mobile screens; top/bottom are cropped on wide desktop monitors).
- [x] Realize that if critical parts of the image (like the runner's feet at `fy: 88`) are near the edges, they will be cut off before the animation even starts on some devices.

### Proposed Solution
- [x] Swap the background image to one with a better "Safe Area" (more empty space around the subject) so that the runner remains fully visible in the center even when the edges are cropped by the browser.
- [x] Request the new image in 4K resolution (`w=3840`) for maximum sharpness when zooming in.
- [x] Re-calibrate the `fx` and `fy` marker coordinates in `Biomechanics.tsx` to match the anatomical points (Ground Contact, Hip Extension, Shoulder Drive) on the new photograph.

## Part 4: Animation Polish and Fine-Tuning

### 1. Connecting Trails to Markers and Labels
- [x] Updated all SVG motion trails to originate precisely from the center of the anatomical markers (`x1: 0, y1: 0`).
- [x] Bound the text label position directly to the end coordinates of the motion trail (`x2`, `y2`), ensuring a seamless visual connection.
- [x] Designed uniform, elegant bezier curves for all three anatomical stops.

### 2. Resolving GSAP and Text Alignment Conflicts
- [x] Mirrored the "Shoulder Drive" trail to point to the left side (`cx: -30, x2: -70`).
- [x] Fixed GSAP conflicts that caused left-aligned text to overlap with the lines. Achieved this by nesting the labels inside a non-animated CSS wrapper using `translate(-100%, -50%)`.
- [x] Leveraged `translateY(-50%)` to guarantee mathematically perfect vertical centering of the text with the end of the line, avoiding hacky pixel-based top margins that break on different font metrics.

### 3. Custom Zoom Panning (Decoupling Center from Marker)
- [x] Expanded the `Stop` data structure to support optional `px` and `py` coordinate overrides.
- [x] Refactored the `panFor` GSAP logic to use these custom overrides, allowing the camera's zoom center to differ from the physical marker location.
- [x] **Hip Extension:** Adjusted the camera center to `py: 52` to push the hip marker (`fy: 58`) slightly lower on the screen for better framing.
- [x] **Ground Contact:** Reduced the zoom scale to `1.5` and adjusted the camera center to `py: 72`, ensuring the ground, ankle, knee, and hip all comfortably fit within the viewport without cutting off the bottom of the image.

## Next Steps
The Biomechanics scene is now fully responsive, correctly aligned, and highly polished. No further actions are required for this component at this time.
