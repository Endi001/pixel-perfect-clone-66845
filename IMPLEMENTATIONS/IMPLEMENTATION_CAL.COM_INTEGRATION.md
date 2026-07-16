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
- `[x]` 4. **Apply Styling & Layout:** Inherited the styled `BookingModal.tsx` wrapper and passed custom `config` to the Cal component. We applied `--ember` primary color for branding and left `hideEventTypeDetails: false` to ensure the Cal.com Intro page is visible.
- `[x]` 5. **Clean Up:** Removed the simulated `embedFailed` fallback logic.
- `[x]` 6. **Test Validation:** The calendar will now render fully interactive in the modal, providing maximum vertical space for the hours list, with correct custom animations and branding.

## Part 2: Custom API Booking Flow

To achieve precise layout control (specifically, showing the Intro panel on the Calendar page but hiding it on the Form page), we replaced the native Cal.com embedded widget with a fully custom React state machine powered by the Cal.com v2 REST API.

### Architecture Overview:
1. **Server Proxy (`src/lib/cal-api.ts`):**
   - Implemented `getCalEventDetails` to dynamically fetch the Intro content (Title, Description, Duration, Location) from Cal.com, ensuring the text is never out of sync.
   - Implemented `getCalSlots` and `createCalBooking` to safely proxy scheduling requests without exposing the API key to the client.
2. **State Machine (`src/components/stride/BookingModal.tsx`):**
   - **Step 1 (Split-Screen):** Fetches and displays the Intro dynamically on the left. Renders a custom calendar (`react-day-picker`) and available time slots on the right.
   - **Step 2 (Focused Form):** Hides the Intro panel completely. Displays only the booking intake form (Name, Email, Notes).
   - **Step 3 (Confirmation):** Success screen displaying the confirmed time.

## Part 3: Booking Form Field Styling & Phone Prefix

### Goals
- Unify all dynamic booking field styles with the standard STRIDE input pattern
- Show visible country dial-code prefix (e.g. +355 for Albania, +31 default for Netherlands)

### Changes
1. Shared `BOOKING_INPUT_CLASS` and `BOOKING_COMPOSITE_INPUT_CLASS` constants in `BookingModal.tsx`
2. PhoneInput: `international`, `defaultCountry="NL"`, `countryCallingCodeEditable={false}`
3. CSS overrides for `react-phone-number-input` in `styles.css` (ember focus, height parity)
4. Extended react-select theming (`BOOKING_SELECT_CLASSNAMES` / `BOOKING_SELECT_STYLES`) for select/multiselect/radio fields

### Test Checklist
- [ ] Open booking modal → pick date/time → step 2 form
- [ ] All fields share consistent border, padding, background, focus ring
- [ ] Phone defaults to Netherlands (+31); changing to Albania shows +355
- [ ] User types only national digits after prefix
- [ ] Select/multiselect dropdowns match input styling
- [ ] Submit still succeeds with E.164 phone in Cal.com booking
