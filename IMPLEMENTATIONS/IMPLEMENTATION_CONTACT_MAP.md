# Add Amsterdam Map to Contact Page

This implementation plan outlines the steps to replace the current CSS-placeholder map on the Contact page with a map of Amsterdam.

## Open Questions

> [!IMPORTANT]
> To proceed with this implementation, I need the following information from you:
> 
> 1. **Map Provider**: Do you prefer a simple Google Maps `<iframe>` embed (easiest, no API key required), or an interactive library like Mapbox, Leaflet, or the Google Maps JS API?
> 2. **Location/Address**: What is the exact address or coordinate in Amsterdam that the map should focus on?
> 3. **API Keys**: If you prefer a provider that requires an API key (like Mapbox or Google Maps JS API), please provide it or let me know how you'd like to handle it.
> 4. **Styling**: Do you want the map to have a specific color scheme (e.g., grayscale, styled to match the site's light/muted aesthetic), or the default map styling?

## Proposed Changes

### `src/routes/contact.tsx`
- **[MODIFY]** `src/routes/contact.tsx`
  - Remove the current placeholder `div` (which uses a CSS `linear-gradient` background to simulate a grid).
  - Insert the map component/iframe based on your preferred provider.
  - Update or adapt the map pin (currently an Ember-colored animated dot) to work with the map.
  - Update the text referencing "Ashfield Quay" to match the new Amsterdam location, if applicable.

## Verification Plan

### Manual Verification
- Navigate to the `/contact` route in the local development server.
- Verify that the Amsterdam map loads correctly without any console errors.
- Ensure the map marker points to the correct location.
- Verify that the map section is fully responsive across different screen sizes.
