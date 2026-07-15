# IMPLEMENTATION: About Page Media Updates

## Goal
Update the images and team member names on the About page to match the user's requested visual assets and gender specifications.

## Proposed Changes

### 1. `src/lib/stride-media.ts`
Update the names in the `clinic.team` array to match the requested genders (first two male, third female):
- Change `Elena Marsh` to  `James Carter`
- Keep `Tom Okafor` (male)
- Change `Priya Anand` to `Sarah Jenkins`

**Target block:**
```ts
  team: [
    { name: "James Carter", role: "Lead Physiotherapist", cred: "MSc Sports Rehabilitation" },
    { name: "Tom Okafor", role: "Physiotherapist", cred: "Manual Therapy Lead" },
    { name: "Sarah Jenkins", role: "Physiotherapist", cred: "Post-Operative Rehabilitation" },
  ],
```

### 2. `src/routes/about.tsx`
Update the hardcoded array of Pexels image IDs that map to the team members.

**Current:**
`["5327585","3762800","4269698"]`

**New:**
`["30423030", "27684610", "13831341"]`

**Target block:**
```tsx
                    style={{
                      backgroundImage: `url(https://images.pexels.com/photos/${["30423030","27684610","13831341"][i]}/pexels-photo-${["30423030","27684610","13831341"][i]}.jpeg?auto=compress&cs=tinysrgb&w=1200)`,
                      transitionDuration: "700ms",
                      transitionTimingFunction: "var(--ease-drive)",
                    }}
```

## Verification
- Load the `/about` route and visually verify the photos have updated to the new Pexels IDs.
- Verify the team member names correspond correctly (Male, Male, Female).
