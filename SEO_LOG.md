# Revend SEO Engine — Implementation Log

**Date:** 2026-02-21  
**Deployed to:** https://revend-lokis-projects-b31d1aab.vercel.app  
**Commit:** `0b300e2`

---

## What Was Built

### Architecture Change: Server + Client Split

The device page (`/sell/[category]/[brand]/[model]`) was originally a `'use client'` component, which blocks `generateMetadata` (Next.js requires server components for metadata). 

**Solution:**
- Created `components/device/DevicePageClient.tsx` — all interactive UI logic (condition wizard, comparison table, storage selector)
- Rewrote `app/sell/[category]/[brand]/[model]/page.tsx` as a **server component** that handles all SEO and passes device data to the client component

---

## Changes Made

### 1. Dynamic Metadata — Device Pages (`page.tsx`)
Every `/sell/phones/apple/iphone-16-pro` now generates:
```
title: "Sell iPhone 16 Pro — Compare Best Prices | Revend"
description: "Get up to $680 for your iPhone 16 Pro. Compare offers from 5+ verified buyers instantly. Free shipping, fast payment."
OG: title, description, image (per-device /og/[model].png with fallback to /og-image.png)
canonical: https://revend-lokis-projects-b31d1aab.vercel.app/sell/phones/apple/iphone-16-pro
keywords: [sell iPhone 16 Pro, iPhone 16 Pro trade in, iPhone 16 Pro buyback, ...]
```

### 2. JSON-LD Structured Data — Product Schema
Injected via `<Script type="application/ld+json">` on every device page:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 16 Pro",
  "brand": { "@type": "Brand", "name": "Apple" },
  "description": "Sell your iPhone 16 Pro and compare offers from 5+ verified buyback buyers...",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "190",
    "highPrice": "680",
    "priceCurrency": "USD",
    "offerCount": "5",
    "availability": "https://schema.org/InStock"
  }
}
```
- `lowPrice` = `maxOffer × 0.28` (broken condition approximation)
- `highPrice` = `maxOffer` (flawless condition)

### 3. JSON-LD Structured Data — BreadcrumbList
Injected alongside Product schema on every device page:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://..." },
    { "position": 2, "name": "Phones", "item": "https://.../sell/phones" },
    { "position": 3, "name": "Apple", "item": "https://.../sell/phones/apple" },
    { "position": 4, "name": "iPhone 16 Pro", "item": "https://.../sell/phones/apple/iphone-16-pro" }
  ]
}
```

### 4. Dynamic Sitemap (`app/sitemap.ts`)
- **Static pages:** /, /how-it-works, /buyers, /sustainability, /about, /blog, /price-check, /sell-broken, /business, /careers, /contact
- **Category pages:** /sell/phones, /sell/tablets, etc. (priority: 0.9)
- **Brand pages:** /sell/phones/apple, /sell/phones/samsung, etc. (priority: 0.85) — **NEW**
- **Device pages:** /sell/[cat]/[brand]/[model] — priority 1.0 for popular, 0.95 for others
- All pages include `changeFrequency` and `lastModified`
- BASE URL reads from `NEXT_PUBLIC_SITE_URL` env with live Vercel URL as fallback

### 5. robots.ts
```
Allow: /
Disallow: /go/, /admin/, /api/
Sitemap: https://revend-lokis-projects-b31d1aab.vercel.app/sitemap.xml
Host: https://revend-lokis-projects-b31d1aab.vercel.app
```

### 6. Homepage Metadata (`app/layout.tsx`)
```
title: "Revend — Sell Your Device for the Best Price"
description: "Compare buyback offers from 7+ verified buyers for iPhones, Samsung, MacBooks, and more. Get paid fast."
OG image: /og-image.png (1200×630)
```

### 7. Category Page Metadata (`/sell/[category]/page.tsx`)
- `/sell/phones` → "Sell Your Phone — Best Prices Guaranteed | Revend"
- `/sell/tablets` → "Sell Your Tablet — Best Prices Guaranteed | Revend"
- Includes canonical URLs, OG metadata, and relevant keywords

### 8. Brand Page Metadata (`/sell/[category]/[brand]/page.tsx`)
- `/sell/phones/apple` → "Sell Apple Phone — Compare Buyback Prices | Revend"
- Includes canonical URLs, OG metadata, and brand-specific keywords

### 9. Core Web Vitals Improvements
- `fetchPriority="high"` added to device hero images in DevicePageClient
- Improved `alt` text: `"iPhone 16 Pro — sell for up to $680"` (descriptive + price signal)
- `<link rel="preconnect">` for Supabase (reads from `NEXT_PUBLIC_SUPABASE_URL` env) in layout.tsx
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`

---

## Files Changed

| File | Change |
|------|--------|
| `app/layout.tsx` | Updated metadata, added preconnect links |
| `app/sitemap.ts` | Added brand pages, env-based BASE URL, popular device priority boost |
| `app/robots.ts` | Updated sitemap URL to live domain |
| `app/sell/[category]/page.tsx` | Better title format, canonical URL, keywords |
| `app/sell/[category]/[brand]/page.tsx` | Better title format, canonical URL, keywords |
| `app/sell/[category]/[brand]/[model]/page.tsx` | **Rewritten** as server component: generateMetadata, JSON-LD Product + BreadcrumbList |
| `components/device/DevicePageClient.tsx` | **New** — extracted client component with visual breadcrumb, interactive UI |

---

## Target Query Coverage

| Query | Page | Title |
|-------|------|-------|
| "sell iPhone 16 Pro" | `/sell/phones/apple/iphone-16-pro` | "Sell iPhone 16 Pro — Compare Best Prices \| Revend" |
| "best place to sell MacBook" | `/sell/laptops/apple/macbook-pro-16-m4` | "Sell MacBook Pro 16" M4 — Compare Best Prices \| Revend" |
| "how much is my phone worth" | `/sell/phones` | "Sell Your Phone — Best Prices Guaranteed \| Revend" |
| "sell Samsung Galaxy S25" | `/sell/phones/samsung/galaxy-s25` | "Sell Samsung Galaxy S25 — Compare Best Prices \| Revend" |

---

## Next SEO Steps (Recommended)

1. **Generate actual OG images** per device at `/public/og/[model].png` (1200×630) — currently falls back to generic
2. **Blog content** — target long-tail queries ("best time to sell iPhone 16 Pro", "iPhone vs Android resale value")
3. **Link building** — each brand page links to all device pages; device pages link to related devices
4. **Price freshness** — when Supabase is live, update sitemap `lastModified` to actual offer update timestamp
5. **Internationalization** — `hreflang` tags if expanding to UK/EU markets
6. **FAQ Schema** — add FAQPage JSON-LD to device pages answering "How much can I get for my iPhone?"
7. **Review Schema** — add buyer reviews to AggregateOffer once review data is available
