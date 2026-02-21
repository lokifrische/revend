# Revend — End-to-End Production Audit Report
**Audit Date:** 2026-02-21  
**Site:** https://revend-lokis-projects-b31d1aab.vercel.app  
**Local Repo:** /home/openclaw/.openclaw/workspace/revend/  
**Auditor:** Senior QA (subagent)

---

## Executive Summary

Revend is a well-designed "Kayak for phones" concept with a polished UI and coherent user flow. The frontend visuals are VC-pitch quality — the device pages, comparison engine, and trust signals are aesthetically strong. **However, the product is a paper shell underneath.** Every single core engine is either broken, mocked, or completely non-functional.

### What Works
- Visual design and layout: excellent (homepage, device pages, comparison table)
- Navigation and information architecture: logical and clear
- Device database: 87 devices across 6 categories with real images
- Device search: fast, functional, keyboard-navigable
- Route structure: all major sell routes work correctly
- SEO metadata: good per-page metadata, device page has JSON-LD structured data
- Mobile layout: functional (with minor truncation issues)
- `lib/db.ts` and `lib/supabase.ts`: well-written, schema-complete, ready to power real data

### What's Completely Broken
1. **Attribution Engine: DEAD** — `/go/` never redirects, never logs a click, never calls Supabase
2. **Supabase: CONNECTED but UNUSED** — real credentials, real schema, but ALL pages use mock data from `lib/data.ts`
3. **Buyer redirect URLs: DON'T EXIST** — Buyer objects have no `url` field. There's literally no destination to send users to.
4. **`/sell` is 404** — top-level nav link broken
5. **Blog articles are all 404** — no `app/blog/[slug]/page.tsx`
6. **Buyer profile pages are 404** — no `app/buyers/[slug]/page.tsx`
7. **All forms: fake submits** — contact, price alerts, partner apply all do nothing on submit
8. **OG image is missing** — `/public/og-image.png` doesn't exist
9. **Entire site blocked by Vercel preview auth** — HTTP 401 to all unauthenticated requests (SEO is dead)
10. **Three devices have duplicate IDs** in mock data (data integrity bug)

---

## Route-by-Route Results

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ PASS | Loads beautifully. Hero, search, trending devices, trust strip all render. |
| `/sell` | ❌ FAIL | **404** — No `app/sell/page.tsx`. Nav links here will die. |
| `/sell/phones` | ✅ PASS | Category page loads with grid of brands. |
| `/sell/phones/apple` | ✅ PASS | Brand page loads with 24 Apple models, image grid. |
| `/sell/phones/apple/iphone-16-pro` | ✅ PASS | Device page loads with offers, condition picker, comparison table. |
| `/buyers` | ✅ PASS | 5 verified buyer cards. Looks professional. |
| `/buyers/[slug]` (e.g. /buyers/buybacktree) | ❌ FAIL | **404** — "View profile" links on buyers page are dead. No route exists. |
| `/how-it-works` | ✅ PASS | Step-by-step guide renders correctly. |
| `/sustainability` | ✅ PASS | Renders with CO₂ stats, looks good. |
| `/about` | ✅ PASS | Story page renders. Minor: no main nav (Header has no `alwaysOpaque`). |
| `/blog` | ✅ PASS | Blog list with 6 articles renders. |
| `/blog/[slug]` (e.g. /blog/decluttr-alternative) | ❌ FAIL | **404** — No `app/blog/[slug]/page.tsx`. All article links dead. |
| `/business` | ✅ PASS | B2B landing page, good conversion layout. |
| `/careers` | ✅ PASS | 4 job listings render. |
| `/contact` | ✅ PASS | Form renders. **Fake submit** — no backend. |
| `/privacy` | ✅ PASS | Legal page renders. |
| `/terms` | ✅ PASS | Legal page renders. |
| `/disclosure` | ✅ PASS | FTC disclosure page renders correctly. |
| `/price-check` | ✅ PASS | Device value page with depreciation table. |
| `/price-alerts` | ✅ PASS | Form renders. **Fake submit** — no backend. |
| `/sell-broken` | ✅ PASS | Broken device page renders. |
| `/partners/apply` | ✅ PASS | Partner application form renders. **Fake submit** — no backend. |
| `/go/[buyer]/[device]/[condition]` | ⚠️ RENDERS | Shows interstitial UI. **Countdown reaches 0, nothing happens. No redirect. No tracking.** |
| `/admin/clicks` | ⚠️ EXISTS | Supabase attribution dashboard. No auth protection. Will show empty table (no clicks are ever logged). |

---

## User Journey Test Results

### Full Journey: Search → iPhone 16 Pro → Good Condition → Compare → Sell

**Step 1: Homepage search**
- Type "iPhone 16" → dropdown appears immediately ✅
- Shows "iPhone 16 Pro", "iPhone 16", etc. with prices ✅
- Keyboard navigation works (arrow keys, enter) ✅
- Clicking "iPhone 16 Pro" routes to `/sell/phones/apple/iphone-16-pro` ✅

**Step 2: Device page loads**
- iPhone 16 Pro image loads cleanly ✅
- "Up to $680" displayed ✅
- Storage selector (128GB, 256GB, 512GB, 1TB) works ✅
- Breadcrumb trail: Home → Phones → Apple → iPhone 16 Pro ✅

**Step 3: Condition selection**
- Condition wizard shows Flawless/Good/Fair/Broken with prices ✅
- Click "Good" → page updates to show 5 offers ✅
- URL updates to `?condition=good` ✅
- Impact strip appears (CO₂ savings) ✅

**Step 4: Comparison table**
- 5 offers display correctly (BuyBackTree $558, GadgetGone $541, Gazelle $519, Swappa $502, ItsWorthMore $473) ✅
- "Best Offer" badge on BuyBackTree ✅
- Star ratings, payment methods, payment speed shown ✅
- "Prices updated at [time]" shows current local time — **THIS IS FABRICATED. Prices are static mock data.** ⚠️
- "Sell Now" button and promo code copy button work ✅

**Step 5: Click "Sell Now" → /go/ route**
- Opens `/go/buybacktree/iphone-16-pro/good` in a new tab ✅
- Shows "Taking you to BuyBackTree" interstitial ✅
- Promo code "REVEND10" displays with copy button ✅
- Countdown timer: "Auto-redirecting in 3s..." → 2s → 1s → 0 ❌
- **At 0: NOTHING HAPPENS. No redirect occurs.** ❌
- "Continue to BuyBackTree" button: fires `alert("[Demo] Would redirect to...")` ❌
- **No click is logged to Supabase** ❌
- **No actual buyer URL exists in the codebase** ❌
- `logClick()` exists in `lib/db.ts` but is NEVER called from this page ❌

**Revenue impact of this bug:** Every single user who clicks "Sell Now" gets stuck on a dead interstitial. Zero conversions. Zero affiliate revenue. The entire business model is non-functional.

---

## Mock vs. Real Data Assessment

### lib/data.ts (MOCK — used by ALL pages)
- **File:** `/home/openclaw/.openclaw/workspace/revend/lib/data.ts`
- All device data is hardcoded TypeScript arrays
- 87 devices across 6 categories
- 5 buyers with hardcoded ratings, review counts, and promo codes
- `getOffersForDevice()` computes prices algorithmically using `maxOffer × conditionMultiplier × buyerPct`
- Prices are **deterministic formulas**, not real buyer quotes
- No `url` field on `Buyer` interface — there's no way to redirect users to real buyer sites
- `platformStats` is hardcoded: `{ totalSellers: 127400, totalBuyers: 23, totalDevices: 627, co2SavedTons: 7248 }`
  - The site claims "600+ devices" but only has 87 in data.ts — misleading display

### lib/db.ts (REAL — used by NO pages)
- **File:** `/home/openclaw/.openclaw/workspace/revend/lib/db.ts`
- Complete Supabase query layer: `getDeviceFamilies()`, `getOffersForDevice()`, `getDeviceFamily()`, `logClick()`, `getCategories()`, `getBrands()`, `getConditions()`
- **Real Supabase project exists** (URL: `https://msvobzzeteeoddjtxfji.supabase.co`)
- Real credentials in `.env.local` (**do not commit this file**)
- `logClick()` function fully implemented — inserts to `affiliate_clicks` table
- But: zero pages import from `db.ts`. It's production-ready but completely bypassed.
- Unknown if the Supabase database has any actual data populated (tables may be empty)

### Summary Table
| Component | Source | Status |
|-----------|--------|--------|
| Device catalog | `lib/data.ts` | Mock — 87 hardcoded devices |
| Buyer directory | `lib/data.ts` | Mock — 5 hardcoded buyers, no real URLs |
| Offer prices | `lib/data.ts` | Mock — formula-generated, not real quotes |
| Click tracking | `lib/db.ts` | Real schema, but NEVER called |
| Platform stats | `lib/data.ts` | Fabricated (127k users, 23 buyers, 7248 tons CO₂) |

---

## Trust Layer Gaps

### False/Misleading Claims

1. **"Prices updated at [time]"** (`components/comparison/ComparisonTable.tsx` line ~15)
   - Shows `new Date().toLocaleTimeString()` — the user's current time
   - Implies real-time price updates; data is actually completely static
   - **This is deceptive.** Remove this or only show it when data is actually fetched from real APIs.

2. **"20+ verified buyers"** (homepage, price-check, everywhere)
   - Only 5 buyers exist in mock data. 23 claimed in platformStats.
   - Neither number is real.

3. **"600+ devices"** (homepage, search dropdown)
   - Only 87 devices in `lib/data.ts`
   - The `categories` array shows `{ deviceCount: 312 }` for phones but only ~50 phone models exist

4. **"127,000+ active sellers"**
   - Hardcoded in `platformStats` in `lib/data.ts`
   - Zero real users have ever used this platform

5. **"Sellers save $47 more"** (device page, `app/sell/[category]/[brand]/[model]/page.tsx` line ~195)
   - Fabricated stat with no data backing

6. **"Free shipping label provided by buyer"** (device page)
   - Hardcoded on all offers regardless of buyer
   - Not verified with actual buyers

### Missing Trust Signals

1. **Buyer logo images missing** — all buyers display 3-letter text abbreviations (BBT, GZL, etc.) instead of real logos. No `logo_url` in buyer data.
2. **No Trustpilot or BBB embed** — ratings are fabricated numbers
3. **Buyer profile pages don't exist** — `/buyers/[slug]` is 404, making "View profile" links dead
4. **No real review data** — review counts (2,847 for BuyBackTree, 18,420 for Gazelle) are hardcoded
5. **"BBB accredited" claim for BuyBackTree** — in tagline but no link or badge

---

## SEO Gaps

### Critical (P0)
1. **Vercel Preview Auth blocks all crawlers**
   - Every URL returns HTTP 401 to unauthenticated requests (confirmed via curl)
   - Google Bot cannot access any page
   - All SEO work is wasted until the site is either made public or deployed to production domain

### High Priority (P1)
2. **Sitemap points to wrong domain**
   - `app/sitemap.ts` line 4: `const BASE = 'https://revend.com'`
   - Should use `process.env.NEXT_PUBLIC_SITE_URL`
   - Vercel deployment uses different URL; sitemap entries won't match crawled URLs
   
3. **robots.ts has hardcoded domain**
   - `app/robots.ts`: `sitemap: 'https://revend.com/sitemap.xml'`
   - Same issue as above

4. **No og-image.png**
   - `/public/og-image.png` does NOT exist
   - All pages reference `og-image.png` for OG + Twitter cards in `app/layout.tsx`
   - Social sharing produces broken image previews for every page

5. **Blog article pages are 404**
   - `/blog/[slug]` has no route handler
   - 6 articles with strong SEO-targeted titles (e.g., "Decluttr Alternative") return 404
   - Major lost opportunity for long-tail keyword traffic

### Medium Priority (P2)
6. **Category and brand pages have no structured data**
   - `/sell/phones` and `/sell/phones/apple` have no JSON-LD
   - Device model pages DO have JSON-LD (2 schemas — verified by grep)
   - Add `BreadcrumbList` + `ItemList` schema to category/brand pages

7. **No canonical tags beyond default metadata**
   - Duplicate devices with same slug (see data bugs below) could create duplicate content issues

8. **Category `deviceCount` in data.ts is wrong**
   - `categories` shows phones=312, but only ~50 phone models exist
   - This number is displayed nowhere currently, but could cause issues if surfaced

---

## Attribution / Click Tracking Gaps

### The Core Problem
The entire revenue model is broken. Here's the exact call chain and where it fails:

```
User clicks "Sell Now" (BuyerCard.tsx:44)
  → window.open('/go/buybacktree/iphone-16-pro/good', '_blank')
  
/go/ page loads (app/go/[buyer]/[device]/[condition]/page.tsx)
  → Countdown timer reaches 0
  → setRedirected(true) ← ONLY THIS HAPPENS
  → No window.location redirect
  → No fetch to /api/go
  → No logClick() call
  → No Supabase insert
  
"Continue to [Buyer]" button (page.tsx:72-79)
  → alert("[Demo] Would redirect...") ← DEMO ALERT IN PRODUCTION
  → Nothing else
```

### What's Missing

1. **Buyer `url` field** — `lib/data.ts` `Buyer` interface has no `url` or `affiliateUrl` field. There is literally no destination URL. Fix needs both the data model AND the redirect logic.

2. **`logClick()` never called** — `lib/db.ts` has a complete `logClick()` function ready to insert to `affiliate_clicks`. It's never imported or called anywhere in the live codebase.

3. **No API route for attribution** — No `/api/go` server-side route exists. The comment in `BuyerCard.tsx` line 43 says "In production: POST /api/go → get tracking URL" but this endpoint doesn't exist.

4. **Auto-redirect logic incomplete** — `app/go/[buyer]/[device]/[condition]/page.tsx` line 22-31: countdown reaches 0, sets `redirected(true)`, but never calls `window.location.href = buyer.url`

5. **Session ID never generated** — `logClick()` accepts a `sessionId` but no session ID generation exists anywhere

6. **Admin dashboard has no data** — `/admin/clicks` will always show empty table since zero clicks are ever logged

### Fix Required (Exact Files)

```
Priority 1: Add buyer URLs to data model
  File: lib/data.ts — Add `url: string` to Buyer interface and all buyer objects

Priority 2: Fix /go/ page redirect + tracking  
  File: app/go/[buyer]/[device]/[condition]/page.tsx
  - Import logClick from lib/db.ts (or create API route)
  - Call logClick() on page load (useEffect)
  - Set window.location.href = buyer.url at countdown completion
  - Remove the alert() call

Priority 3: Create /api/go route (optional, cleaner)
  File: app/api/go/route.ts (create new)
  - POST handler: receive buyerSlug, deviceSlug, conditionSlug
  - Call logClick() server-side
  - Return redirect URL
```

---

## Data Integrity Bugs

### Duplicate Device IDs in lib/data.ts
These will cause `devices.find(d => d.id === deviceId)` to silently return wrong device.

| Duplicate ID | Device 1 (first in array) | Device 2 (second in array) |
|---|---|---|
| `d-iphone17pro` | iPhone 17 Pro Max (slug: iphone-17-pro-max, $820) | iPhone 17 Pro (slug: iphone-17-pro, $760) |
| `d-iphone15pro` | iPhone 15 Pro Max (slug: iphone-15-pro-max, $580) | iPhone 15 Pro Max (slug: iphone-15-pro-max, $560) — **also duplicate slug** |
| `d-iphone14pro` | iPhone 14 Pro Max (slug: iphone-14-pro-max, $440) | iPhone 14 Pro Max (slug: iphone-14-pro-max, $410) — **also duplicate slug** |
| `d-switch` | Nintendo Switch OLED (slug: nintendo-switch-oled) | Nintendo Switch (slug: nintendo-switch) |

**File:** `lib/data.ts` — affects `getOffersForDevice()` function.

### Duplicate Slugs (will cause wrong device to load)
- `iphone-15-pro-max` appears twice in devices array (different IDs, same slug)
- `iphone-14-pro-max` appears twice (different IDs, same slug)
- The device page at `/sell/phones/apple/iphone-15-pro-max` will always load the first match

### Missing Brand: Bose
- **File:** `lib/data.ts` — `brands[]` array
- Bose devices exist: `bose-quietcomfort-ultra`, `bose-quietcomfort-45`
- But `brands[]` only includes: Apple, Samsung, Google, OnePlus, Microsoft, Sony, Nintendo
- `Bose` is missing — the brand page `/sell/headphones/bose` will 404
- Also: `Meta` and `Valve` are missing (Meta Quest, Steam Deck exist in devices)

### Device Count Mismatch
- Category `id: 'cat-phones'` claims `deviceCount: 312` but ~55 phones exist
- Tablets claims 87, but ~14 exist
- These numbers appear to be aspirational/wrong

---

## Priority Fix List

### P0 — Site is Broken (Fix Today)

| # | Issue | File(s) | What to Do |
|---|-------|---------|-----------|
| P0-1 | Attribution engine completely broken — zero revenue possible | `app/go/[buyer]/[device]/[condition]/page.tsx`, `lib/data.ts`, `lib/db.ts` | Add buyer URLs to Buyer interface; call logClick() on /go/ load; implement actual redirect |
| P0-2 | Vercel preview auth blocks all search engines + unauthenticated users | Vercel project settings | Disable preview protection OR deploy to production domain (revend.com) |
| P0-3 | `/sell` returns 404 — linked from main nav | Create `app/sell/page.tsx` | Redirect to `/sell/phones` or render a sell hub page |
| P0-4 | Duplicate device IDs in data.ts cause wrong offers to appear | `lib/data.ts` | Fix IDs: `d-iphone17promax`, `d-iphone17pro`, `d-iphone15promax`, `d-iphone15pro`, `d-iphone14promax`, `d-switch-oled`, `d-switch` |
| P0-5 | `alert("[Demo]...")` in production code | `app/go/[buyer]/[device]/[condition]/page.tsx:72-79` | Remove alert, implement real redirect |

### P1 — Core UX Broken (Fix This Week)

| # | Issue | File(s) | What to Do |
|---|-------|---------|-----------|
| P1-1 | Blog articles all 404 | Create `app/blog/[slug]/page.tsx` | Build dynamic blog article renderer |
| P1-2 | Buyer profile pages all 404 | Create `app/buyers/[slug]/page.tsx` | Build buyer profile page with reviews/stats |
| P1-3 | All forms (contact, alerts, partner apply) fake-submit | `app/contact/page.tsx`, `app/price-alerts/page.tsx`, `app/partners/apply/page.tsx` | Wire up to API routes (Supabase or email service) |
| P1-4 | OG image missing | Create `/public/og-image.png` | Design and add 1200×630 OG image |
| P1-5 | Sitemap points to wrong domain | `app/sitemap.ts:4`, `app/robots.ts` | Use `process.env.NEXT_PUBLIC_SITE_URL` |
| P1-6 | "Prices updated at [time]" is fabricated | `components/comparison/ComparisonTable.tsx:14-18` | Remove timestamp OR show last real fetch time from real data |
| P1-7 | Admin dashboard has no authentication | `app/admin/clicks/page.tsx` | Add basic auth or Supabase auth check |
| P1-8 | Missing Bose/Meta/Valve brands in brands[] | `lib/data.ts` | Add missing brands to `brands[]` array |

### P2 — Polish and Growth (Fix Next Sprint)

| # | Issue | File(s) | What to Do |
|---|-------|---------|-----------|
| P2-1 | Buyer logos are text abbreviations only | `lib/data.ts` Buyer objects | Add real buyer logo images to `/public/buyer-logos/` |
| P2-2 | Category/brand pages have no JSON-LD structured data | `app/sell/[category]/page.tsx`, `app/sell/[category]/[brand]/page.tsx` | Add BreadcrumbList + ItemList schema |
| P2-3 | Mobile hero text truncated at 390px | `app/page.tsx` — hero section | Fix line-clamp or font size for mobile |
| P2-4 | `deviceCount` in categories array is wrong | `lib/data.ts` categories[] | Update to reflect actual device counts |
| P2-5 | Platform stats are fabricated | `lib/data.ts:platformStats` | Either remove or make clear they're projections |
| P2-6 | Supabase not being used anywhere | All page.tsx files | Migrate from data.ts to db.ts for real data |
| P2-7 | Popular search chip buttons have no onClick | `app/page.tsx` — popular searches section | Wire chip buttons to DeviceSearch navigation |
| P2-8 | Brand logos on brand pages may 404 | `/brands/` directory | Verify all SVG logos exist for all brands |

---

## Additional Observations

### What's Actually Good
- The design system is consistent and high-quality (teal/navy/slate palette)
- The device image library is comprehensive (108 PNG images in /public/images/)
- The search component (DeviceSearch) is excellent — fuzzy, fast, keyboard-friendly
- The condition wizard UX is well-designed and informative
- The comparison table layout is clear and trustworthy-looking
- Breadcrumb navigation works correctly throughout sell flow
- Footer is comprehensive with proper legal links
- The Affiliate Disclosure page is FTC-compliant and well-written
- `lib/db.ts` Supabase schema is production-quality and well-structured
- The `/business` page (B2B) is well-conceived

### Security Notes
- **`.env.local` contains real Supabase service role key** — ensure this is in `.gitignore` and never committed
- `/admin/clicks` is publicly accessible with no authentication
- Preview site appears accessible with browser cookies but blocks unauthenticated HTTP — unclear if this is intentional

### Things That Look Real But Are Fake
- Star ratings (BuyBackTree 4.8★ with 2,847 reviews) — hardcoded
- "All buyers are manually vetted before listing" — no vetting process exists yet
- "Free shipping label provided by buyer" — hardcoded on every offer
- "Price locked for 30 days" — hardcoded, not tied to any real buyer lock
- Payment method icons — PayPal, Venmo etc. — real payment methods but not verified with buyers
- CO₂ impact stats ("57kg CO₂ saved") — these are industry estimates from third-party data

---

*Report generated by automated QA audit. All file paths are relative to `/home/openclaw/.openclaw/workspace/revend/`. Line numbers are approximate and may shift with edits.*
