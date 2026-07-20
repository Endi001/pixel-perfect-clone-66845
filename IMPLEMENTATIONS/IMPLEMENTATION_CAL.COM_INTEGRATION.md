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

## Part 3: Form Rendering, Data Mapping & Frontend Validation

### Goals
- Unify all dynamic booking field styles with the standard STRIDE input pattern and Cal.com standard placeholders.
- Fix API payload mismatches so that bookings successfully hit the Cal.com v2 API with complex custom questions.

### Implementation Details
1. **Field Styling & Placeholders:**
   - Unified text inputs, standard `<select>`, `react-select` multiselects, and phone inputs using `BOOKING_INPUT_CLASS`.
   - Stripped hardcoded placeholders from the UI so that fields exactly inherit the empty or custom strings defined in the Cal.com dashboard.
   - Enforced visible country dial codes using `react-phone-number-input` (defaulting to Netherlands +31).

2. **Cal.com v2 API Parsing & Sorting (`src/lib/cal-api.ts`):**
   - **Unwrapping System Fields:** The v2 API wraps standard user inputs (Name, Email, Phone) inside a JSON string property (`bookingField`), disguising them as `slug: "unknown"` and `type: "unknown"`. We wrote a parser to extract the inner JSON string and dynamically restore their true `slug` and `type`.
   - **Explicit Sorting:** Cal.com simply appends the `unknown` fields to the end of the array. We implemented an explicit sorting layer right before returning the `bookingFields` list to force `name`, `email`, and `attendeePhoneNumber` to always render perfectly at the top of the form, matching Cal.com's native UX.

3. **Data Mapping & Submission (`BookingModal.tsx`):**
   - **Hidden Fields:** Explicitly omitted internal Cal.com system fields like `slug: "location"`.
   - **Payload Shape:** The Cal.com v2 API strictly requires the standard `phoneNumber` to be passed inside the top-level `attendee` object, *not* inside the custom `responses` array. The code intercepts `attendeePhoneNumber` from the form data, removes it from the custom question payload, and explicitly merges it into the `attendee` block. All other custom questions are sent inside the `bookingFieldsResponses` object.
   - **Frontend Blocking:** Added a custom frontend validation loop to manually intercept empty required dynamic fields (like `react-select` dropdowns, which bypass HTML5 native validation). This blocks form submission and outputs a clean UI error message, preventing opaque `BadRequestException` errors from the server.

### Final Verification Status
- `[x]` Form inputs flawlessly match the provided pixel-perfect design specifications.
- `[x]` Radio buttons, Multiselects, and inputs render with exactly the questions pulled from the user's dashboard.
- `[x]` Validation safely guards the API from empty payloads.
- `[x]` Booking POST request succeeds with `201 Created` status.

---

## Part 4: Calendar Layout Expansion (Step 1 – Right Panel)

### Problem
In the booking modal's Step 1, the `<Calendar>` component is constrained inside a small white-bordered box that sits centred in the right panel with significant padding around it. It should expand to fill the available horizontal and vertical space of that panel section, making the calendar feel larger and more integrated with the layout.

### Goal
- Remove the fixed-size wrapper box (white shadow box with `border`, `p-4`, `rounded-xl`, `bg-white`, `shadow-sm`) that constrains the calendar.
- Allow the `<Calendar>` component to stretch naturally to fill the right panel's full width.
- Ensure the calendar day cells scale up proportionally (width & height) so that they fill the expanded space.
- Maintain visual separation between the calendar and the time-slot list below it.

### Implementation Checklist (`src/components/stride/BookingModal.tsx`)

- `[x]` 1. **Remove the constraining wrapper `<div>`** — deleted the `<div>` that had `flex justify-center mb-8 border border-[…] p-4 rounded-xl bg-white shadow-sm`.
- `[x]` 2. **Make the calendar full-width** — added `className="w-full mb-8"` directly on the `<Calendar>` component.
- `[x]` 3. **Scale the calendar cells** — passed `classNames={{ root: "w-full", day: "flex-1" }}` so cells distribute evenly across the grid.
- `[x]` 4. **Verify spacing** — the `mb-8` on the calendar provides adequate separation from the time-slot section below.
- `[x]` 5. **Test responsiveness** — confirmed the expanded calendar does not overflow on mobile column layout.
- `[x]` 6. **Visual QA** — calendar now covers the full width of the right panel with no large blank white borders.

---

## Part 5: Calendar Sizing, Scroll Containment & Modal Animation

### 5A: Calendar Proportion Refinement

#### Problem
After expanding the calendar to full-width (Part 4), the grid felt oversized relative to the rest of the modal content.

#### Solution
- Reduced `--cell-size` from `2.5rem` to `2rem` so navigation buttons and caption scale down proportionally.
- Wrapped both the `<Calendar>` and the time-slots section in `max-w-[90%] mx-auto` to give breathing room from the panel edges while keeping them visually aligned.

#### Checklist
- `[x]` 1. Set `[--cell-size:2rem]` on the Calendar className.
- `[x]` 2. Add `max-w-[90%] mx-auto` to the Calendar.
- `[x]` 3. Add `max-w-[90%] mx-auto` to the time-slots container so both sections align.

---

### 5B: Modal Scroll Containment

#### Problem
When the modal was open, scrolling (mouse wheel / touch) leaked through to the page behind it, scrolling the main content instead of the modal body. This happened because **Lenis** (smooth scroll library) intercepts all wheel/touch events at the document level, bypassing the browser's native `overflow: hidden`.

#### Solution
- Added `data-booking-overlay` attribute to the modal's outer overlay `<div>`.
- On modal open, attached `wheel` and `touchmove` event listeners to the overlay with `stopPropagation()`. This prevents events from reaching Lenis's document-level listener.
- Added `overscroll-contain` (CSS `overscroll-behavior: contain`) on the modal's scrollable content `<div>` to prevent scroll chaining at the CSS level.
- Kept `overflow: hidden` on both `<body>` and `<html>` as a fallback for non-Lenis scroll.
- Exposed the Lenis instance on `window.__lenis` in `use-lenis.ts` for potential future use.

#### Checklist
- `[x]` 1. Add `data-booking-overlay` to the outer overlay div.
- `[x]` 2. Attach `wheel`/`touchmove` `stopPropagation` listeners on modal open.
- `[x]` 3. Remove event listeners on modal close (cleanup).
- `[x]` 4. Add `overscroll-contain` to the scrollable content div.
- `[x]` 5. Set `overflow: hidden` on both `document.body` and `document.documentElement`.
- `[x]` 6. Expose Lenis instance globally in `use-lenis.ts`.

---

### 5C: Modal Close Animation Fix

#### Problem
When the modal closed, it appeared to fade/drift towards the upper-left instead of fading in place. This was caused by a conflict between **Tailwind v4's individual transform properties** and the inline `transform` style:
- Tailwind v4 sets `translate: -50% -50%` via the `md:-translate-x-1/2 md:-translate-y-1/2` classes (using the individual CSS `translate` property).
- The close state used an inline `transform: scale(0.98) translate(-50%, -50%)` — the combined `transform` property.
- Both applied simultaneously, effectively doubling the translation offset.

#### Solution
- Replaced the inline `transform` with the individual CSS `scale` property: `scale: open ? undefined : "0.98"`.
- This no longer conflicts with Tailwind's separate `translate` property, so the modal scales down in place, perfectly centred.

#### Checklist
- `[x]` 1. Remove inline `transform` and `transformOrigin` from the dialog style.
- `[x]` 2. Use individual `scale` CSS property instead.
- `[x]` 3. Verify modal fades/scales in place without drifting.
