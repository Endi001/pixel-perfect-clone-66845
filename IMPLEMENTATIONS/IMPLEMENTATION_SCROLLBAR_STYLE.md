# Custom Scrollbar — "Frosted Glass" Style

Replace the browser-default scrollbar with a minimal, transparent custom scrollbar that works seamlessly across both dark and light sections of the STRIDE website. Uses white-based transparency so the thumb appears as a soft glow on dark sections and gracefully fades on light sections.

## Final Design Specification

| Property          | Value                                                        |
|-------------------|--------------------------------------------------------------|
| **Track**         | Fully transparent — page background shows through            |
| **Thumb (idle)**  | `rgba(255, 255, 255, 0.15)` — soft white whisper             |
| **Thumb (hover)** | `rgba(255, 255, 255, 0.35)` — gentle glow                   |
| **Width**         | 5px                                                          |
| **Thumb radius**  | `var(--radius)` (3px) — matches site border-radius           |
| **Transition**    | Smooth color fade on hover, using `--ease-drive`             |
| **Firefox**       | `scrollbar-width: thin; scrollbar-color: rgba(...) transparent` |

## Implementation History

### Part 1: Initial "Hairline Rail" (superseded)

Used fixed `--hairline-light` / `--slate` palette colors. Worked on light sections but had poor contrast on dark `--ink` sections.

### Part 2: Dynamic ScrollTrigger Swap (abandoned)

Attempted to dynamically swap scrollbar colors via GSAP ScrollTrigger + CSS custom properties. Failed because **WebKit scrollbar pseudo-elements do not react to runtime custom property changes** — they're composited separately and ignore cascade updates. The `use-scrollbar-theme.ts` hook and all related CSS (`--scrollbar-thumb`, `html.scrollbar-dark`) were removed.

### Part 3: "Frosted Glass" Transparent Thumb (current) ✅

Pure CSS solution using white-based `rgba()` transparency. Works on both dark and light backgrounds without any JavaScript.

#### Implementation Checklist

- `[x]` 1. **Remove dynamic JS hook** — Deleted `src/hooks/use-scrollbar-theme.ts`.
- `[x]` 2. **Remove hook integration** — Removed `useScrollbarTheme()` import and call from `src/routes/__root.tsx`.
- `[x]` 3. **Clean up CSS** — Removed `--scrollbar-thumb` / `--scrollbar-thumb-hover` from `:root` and deleted the `html.scrollbar-dark` rule.
- `[x]` 4. **Set frosted glass thumb** — `::-webkit-scrollbar-thumb` uses `rgba(255, 255, 255, 0.15)` idle / `rgba(255, 255, 255, 0.35)` hover.
- `[x]` 5. **Firefox fallback** — `scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.15) transparent;` on `body`.
- `[x]` 6. **Track & width** — `::-webkit-scrollbar { width: 5px; }`, track fully transparent.
- `[x]` 7. **Hover transition** — `transition: background 0.3s var(--ease-drive)` on the thumb.
- `[x]` 8. **CSS formatting cleanup** — Expanded all one-liner rules to multi-line for readability.

#### Verification

- `[x]` 9. **Light section QA** — Thumb should be nearly invisible against `--bone` backgrounds.
- `[x]` 10. **Dark section QA** — Thumb should appear as a soft white glow against `--ink` backgrounds.
- `[x]` 11. **Hover QA** — Thumb should brighten noticeably on hover.
- `[x]` 12. **Cross-browser** — Verify in Chrome, Edge, Firefox, Safari.
