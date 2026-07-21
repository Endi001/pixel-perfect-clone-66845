# Implementation Plan: Website Snapshot & Comprehensive Metadata

This plan details the full metadata setup for **STRIDE Physiotherapy**, including generating a high-quality Open Graph (OG) social snapshot preview of the website, fixing social preview tag bugs, implementing structured data (Schema.org JSON-LD), and ensuring comprehensive Open Graph and Twitter Card coverage across all routes.

---

## 1. Overview & Current Gaps

### Current Status
* **Bug in `__root.tsx`**: `og:image` is currently declared in the `links: [...]` array instead of the `meta: [...]` array, preventing social platforms (LinkedIn, Twitter/X, iMessage, WhatsApp, Facebook, Slack) from recognizing the website preview card.
* **Missing Website Snapshot Image**: The preview currently references a generic logo PNG rather than a visual snapshot of the website.
* **Incomplete Social Metadata**: Missing `og:url`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, `twitter:image`, `twitter:card`, `theme-color`, and canonical link tags.
* **Route Metadata Inconsistency**: Pages like `index.tsx`, `treatments.tsx`, and `our-approach.tsx` lack dedicated `head` exports with canonical URLs and tailored social preview properties.
* **Missing Search Engine Rich Snippets**: No JSON-LD Structured Data (`MedicalClinic` / `Physiotherapy` / `LocalBusiness`) for SEO & Google Maps rich results.

---

## 2. Technical Scope & Strategy

### Phase 1: Website Snapshot & Visual Preview Asset Generation
* **High-Res Snapshot Creation**: Use automated browser subagent rendering at social standard 1200×630 resolution (1.91:1 aspect ratio) of the live home page (`http://localhost:61710/`).
* **Asset Optimization**:
  * `public/og-image.png` (1200×630px, optimized PNG/WebP for social cards).
  * `public/twitter-card.png` (1200×600px / 1200×630px summary_large_image).
  * `public/apple-touch-icon.png` (180×180px branded app icon).

### Phase 2: Root Metadata & Head Engine Architecture (`src/routes/__root.tsx`)
* Correct the `meta` array structure in TanStack Router's `createRootRouteWithContext`.
* Add complete default Open Graph metadata:
  * `og:site_name`: `"STRIDE Physiotherapy"`
  * `og:title`: `"STRIDE Physiotherapy — Momentum is built, not born."`
  * `og:description`: `"Physiotherapy in Ashfield Quay. We treat pain, rebuild movement, and get you back to full speed."`
  * `og:type`: `"website"`
  * `og:url`: Site URL base
  * `og:image`: `"/og-image.png"` (and absolute URL format)
  * `og:image:secure_url`: `"/og-image.png"`
  * `og:image:type`: `"image/png"`
  * `og:image:width`: `"1200"`
  * `og:image:height`: `"630"`
  * `og:image:alt`: `"STRIDE Physiotherapy Clinic website snapshot showing high-performance physical therapy in Ashfield Quay"`
  * `og:locale`: `"en_IE"`
* Add Twitter/X card tags:
  * `twitter:card`: `"summary_large_image"`
  * `twitter:title`: `"STRIDE Physiotherapy — Momentum is built, not born."`
  * `twitter:description`: `"Physiotherapy clinic in Ashfield Quay treating pain, movement limitations, and athletic rehabilitation."`
  * `twitter:image`: `"/og-image.png"`
  * `twitter:image:alt`: `"STRIDE Physiotherapy preview"`
* Add Mobile & Browser metadata:
  * `theme-color`: `"#0c0c0d"` (dark ember branding theme background)
  * `apple-mobile-web-app-capable`: `"yes"`
  * `apple-mobile-web-app-status-bar-style`: `"black-translucent"`
  * `apple-mobile-web-app-title`: `"STRIDE"`

### Phase 3: Structured Data (Schema.org JSON-LD)
* Inject rich snippet JSON-LD metadata for Google search and local clinic discovery:
  * `@context`: `"https://schema.org"`
  * `@type`: `["MedicalClinic", "Physiotherapy"]`
  * `name`: `"STRIDE Physiotherapy"`
  * `description`: `"Physiotherapy clinic treating pain, mobility problems, and athletic recovery in Ashfield Quay."`
  * `address`: Ashfield Quay location details
  * `telephone`: Clinic phone contact
  * `openingHours`: Clinic working hours
  * `priceRange`: `"$$"`
  * `hasOfferCatalog`: Assessment & Treatment services catalog

### Phase 4: Per-Route Meta Tags & Canonical URLs
* Update all route files to export route-specific metadata and canonical link tags:
  * `src/routes/index.tsx`
  * `src/routes/about.tsx`
  * `src/routes/treatments.tsx`
  * `src/routes/our-approach.tsx`
  * `src/routes/contact.tsx`

---

## 3. Verification & Testing Plan

1. **Snapshot Verification**:
   * Confirm snapshot file exists at `public/og-image.png` with exact 1200×630 dimensions and high visual clarity.
2. **HTML Head Inspection**:
   * Inspect rendered `<head>` in browser DOM to ensure `<meta property="og:image" content="/og-image.png">` and Twitter tags are properly emitted by TanStack Router `HeadContent`.
3. **Structured Data Validation**:
   * Verify Schema.org JSON-LD syntax validity.
4. **Social Card Simulator Check**:
   * Verify preview rendering against Open Graph standards (iMessage, WhatsApp, LinkedIn, Twitter/X summary cards).

---

## 4. Next Steps
Upon approval of this plan, snapshot capture and metadata implementation will be executed step-by-step.
