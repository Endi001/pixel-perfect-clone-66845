# Horizontal Scroll Video Zoom & Page Number Visibility

## Issue Description
The user reported that during the horizontal scrolling section (`HorizontalRail.tsx`), the video appears "too zoomed in," which results in the top-left page numbers being obscured. 

**Root Cause**: 
The `HorizontalRail` component has a wrapper (`wrapRef`) that is set to `h-[100svh]` and pins at `"top top"` using GSAP ScrollTrigger. The site has a fixed header (`SiteNav`) that is `4rem` (64px) tall. When the horizontal scroll section pins at the very top of the viewport, the top `4rem` of the section is permanently hidden beneath the fixed header. Since the page numbers are absolutely positioned at `top-8` (32px), they are entirely covered by the header. Furthermore, this overlap chops off the top portion of the video, exacerbating the perception that it is "too zoomed in".

## Proposed Changes

### `src/components/stride/scenes/HorizontalRail.tsx`
We will adjust the ScrollTrigger pinning mechanism and container heights so the horizontal scrolling section aligns precisely below the header, preventing both video overlap and empty dark gaps.

- [x] Update the GSAP `scrollTrigger` to start at `"top 64px"` instead of `"top top"` so the section pins when it reaches the bottom of the 4rem header.
- [x] Adjust the `wrapRef` container height to `h-[calc(100svh-4rem)]` to perfectly match the available viewport space below the header.
- [x] Revert the `trackRef` container to `top-0` and `h-full` to seamlessly fill the wrapper, eliminating any dark gaps between sections when scrolling into view.

## Verification Plan

### Manual Verification
- Scroll down to the horizontal rail section.
- Verify that the horizontal scroll section pins cleanly and the fixed header does not hide the top portion of the active video.
- Verify that the page numbers ("01 / 06", etc.) on the top left are fully visible.
- Verify that the video aspect ratio feels correct and is no longer excessively cropped at the top.
