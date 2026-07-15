# Cal.com Integration Plan

This plan outlines the steps for integrating a Cal.com booking modal into the application using the **React iFrame Embedded method** (`@calcom/embed-react`).

## User Review Required & Open Questions

> [!IMPORTANT]
> **What I need from you:**
>
> 1. **Integration Approach:** You provided the snippet for a button that opens Cal.com's native popup modal. 
>    - Do you want to **replace** the current custom `BookingModal.tsx` entirely and just use the Cal.com native popup when users click "Book an assessment"?
>    - OR do you want to embed the calendar **inline** *inside* the existing custom `BookingModal.tsx`? (This would use the `<Cal>` component from `@calcom/embed-react` instead of just a button). This one is better i think
> 
> 2. **Styling Answer:** To make the new Cal.com trigger button match the rest of the page (like the one in the Hero section), you should use these exact classes and styles:
>    ```tsx
>    className="bg-[color:var(--ember)] px-5 py-3 text-[color:var(--ember-foreground)] font-medium cursor-pointer"
>    style={{ borderRadius: 3 }}
>    ```
>    If you want the secondary style (like "See how we work"), use:
>    ```tsx
>    className="px-5 py-3 border border-[color:var(--hairline-dark-strong)] text-[color:var(--text-on-dark)] hover:border-[color:var(--ember)] hover:text-[color:var(--ember)] transition"
>    style={{ borderRadius: 3 }}
>    ```

## Implementation Checklist

- `[x]` 1. **Confirm Approach:** Embed inline within the existing `BookingModal.tsx` as confirmed to keep custom animations.
- `[x]` 2. **Install Package:** Installed `@calcom/embed-react`.
- `[x]` 3. **Implement Logic:** Modified `src/components/stride/BookingModal.tsx` to render the `<Cal>` component from `@calcom/embed-react` instead of the Calendly skeleton placeholder. Left all global buttons exactly as they were (`onClick={openModal}`) to trigger the beautiful animated custom modal wrapper.
- `[x]` 4. **Apply Styling:** Inherited the styled `BookingModal.tsx` wrapper and passed custom `config={{ styles: { branding: { brandColor: "#FF5A36" } } }}` to the Cal component to perfectly match the site's `--ember` primary color.
- `[x]` 5. **Clean Up:** Removed the simulated `embedFailed` fallback logic.
- `[x]` 6. **Test Validation:** The calendar will now render fully interactive in the modal with correct custom animations and branding.
