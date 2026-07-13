# Visuals Update Implementation Plan

## Description
This document outlines the recent changes made to the project to resolve local display issues with the header hero video. The original setup used `.asset.json` files which pointed to Lovable-hosted assets. These assets were failing to resolve locally via `npm run dev`. To fix this, we updated the source references to directly use raw MP4 URLs from Pexels, bypassing the asset proxy and ensuring the videos render perfectly in the local development environment.

## Recent Changes Checklist
- [x] Identify that local asset JSON files (`hero-run.mp4.asset.json` and `hero-poster.jpg.asset.json`) were causing display issues in the local dev environment.
- [x] Verify direct raw Pexels MP4 URLs for the requested "Hero open" and fallback variant videos.
- [x] Update `src/lib/stride-media.ts` to replace local asset imports for the hero video and poster.
- [x] Hardcode the new `src` to `https://videos.pexels.com/video-files/8533442/8533442-hd_1920_1080_25fps.mp4` (Hero open).
- [x] Hardcode the `poster` to the generated Pexels preview image `https://images.pexels.com/videos/8533442/pictures/preview-0.jpg`.
- [x] Verify that the UI renders the new hero video without 404 errors locally.

## Alternate Variants (Reference)
If we decide to swap to the fallback variant, we can use the following URL in `stride-media.ts`:
- **Fallback variant**: `https://videos.pexels.com/video-files/8533914/8533914-hd_1920_1080_25fps.mp4`
