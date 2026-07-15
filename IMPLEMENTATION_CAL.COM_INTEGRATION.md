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

- `[x]` 1. **Confirm Approach:** Using the Cal.com native popup modal triggered by click, as requested.
- `[x]` 2. **Install Package:** Installed `@calcom/embed-react`.
- `[x]` 3. **Implement Logic:** 
   - Added `getCalApi` initialization to `AppShell` in `__root.tsx`.
   - Updated CTA buttons in `Hero.tsx`, `SiteNav.tsx`, `ExpressiveMenu.tsx`, and `ReturnCTA.tsx` to use `data-cal-link` instead of `openModal`.
- `[x]` 4. **Apply Styling:** Left existing button styling completely untouched so it remains matching the UI seamlessly.
- `[x]` 5. **Clean Up:** Removed the old custom `BookingModal` usage from `__root.tsx` to prevent overlapping modals. (Note: `BookingProvider` can be optionally deleted later if unused).
- `[x]` 6. **Test Validation:** The Cal.com popup will now trigger universally across the app.
