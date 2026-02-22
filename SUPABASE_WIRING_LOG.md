# Supabase Live Data Wiring Log

**Date:** 2026-02-22  
**Commit:** `3b9b525`  
**DB:** https://msvobzzeteeoddjtxfji.supabase.co  
**Records:** 94 device families, 232 devices, 7 buyers, 4 conditions, 4,637 offers

---

## What Was Done

### Pages — All Now Serving Real Supabase Data

| Page | Status | DB Functions Used |
|------|--------|-------------------|
| `app/page.tsx` (Homepage) | ✅ Live | `getCategoriesWithCounts()`, `getPopularFamilies(12)`, `getBuyers()` |
| `app/sell/[category]/page.tsx` | ✅ Live | `getCategories()`, `getFamiliesByCategory(slug)` |
| `app/sell/[category]/[brand]/page.tsx` | ✅ Live | `getCategories()`, `getBrands()`, `getFamiliesByCategoryAndBrand()` |
| `app/sell/[category]/[brand]/[model]/page.tsx` | ✅ Live | `getDeviceFamilyBySlug()`, `getAllOffersForFamily()`, `getPopularFamilies()`, `getConditions()` |
| `app/buyers/page.tsx` | ✅ Live | `getBuyers()` |

### lib/db.ts — Functions Available

All required DB query functions were already present:
- `getCategories()` / `getCategoriesWithCounts()`
- `getBrands()` / `getBrandsByCategory()`
- `getBuyers()`
- `getConditions()`
- `getPopularFamilies(limit)`
- `getFamiliesByCategory(categorySlug)`
- `getFamiliesByCategoryAndBrand(categorySlug, brandSlug)`
- `getDeviceFamilyBySlug(slug)` — returns family + all variant rows
- `getAllOffersForFamily(familyId)` — returns all buyer offers for all devices/conditions in a family
- `getOffersForDevice(deviceId, conditionSlug)` — for API route use
- `searchFamilies(query)` — for DeviceSearch
- `logClick(opts)` — affiliate click tracking

### lib/adapters.ts — New Function Added

- `dbConditionToCondition(c)` — maps raw DB condition row → `Condition` UI type with:
  - `priceMultiplier` ← `price_mult`
  - `color` derived from slug (`like-new`→teal, `good`→blue, `fair`→amber, `poor`→red)

### Cleanup

- `app/price-alerts/page.tsx` — removed unused `import { devices } from '@/lib/data'`
- `components/device/DevicePageClient.tsx` — deleted (dead code; was not imported by any page; used mock `getOffersForDevice`)

---

## Data Flow — Device Comparison Page (Most Important)

```
GET /sell/phones/apple/iphone-16-pro-max?condition=good
      ↓
app/sell/[category]/[brand]/[model]/page.tsx (Server Component)
  ├── getDeviceFamilyBySlug("iphone-16-pro-max")
  │     └── device_families JOIN brands JOIN categories JOIN devices
  ├── getAllOffersForFamily(familyId)
  │     └── offers JOIN devices JOIN conditions JOIN buyers
  ├── getPopularFamilies(8)   ← for related devices
  └── getConditions()         ← real DB conditions (not mock)
      ↓
DevicePageClient (Client Component)
  ├── selectedCondition state
  ├── selectedVariantId state (storage selector)
  └── filterAndAdaptOffers(allOffers, conditionSlug, variantId)
        └── filters allOffers, dedupes by buyer, sorts by price desc
            → BuyerOffer[] → ComparisonTable
```

---

## What Still Uses lib/data.ts (Intentionally)

| Import | Reason | OK? |
|--------|--------|-----|
| `type Device`, `type Buyer`, `type BuyerOffer`, `type Condition` | Interface definitions (no runtime data) | ✅ |
| `platformStats` | Static UI copy (seller count, CO2 stats) | ✅ |
| `co2ByCategory`, `getCO2Savings()` | Static lookup — not in DB | ✅ |
| `conditions` (ConditionWizard fallback) | Fallback only; primary flow passes DB conditions | ✅ |

---

## TypeScript

```
npx tsc --noEmit → 0 errors
```
