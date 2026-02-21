# Attribution Engine — Build Log

**Date:** 2026-02-21  
**Commit:** `b7432e0` — feat: attribution engine — /go/ redirect + click tracking + Supabase logging

---

## What Was Built

### 1. `/app/go/[buyer]/[device]/route.ts` — Server-Side Redirect Handler
The primary attribution endpoint. When a user clicks "Sell Now":

- **URL:** `/go/buybacktree/iphone-16-pro?condition=good&offer=31200&device_id=xxx&buyer_id=xxx&condition_id=xxx&session_id=yyy`
- **Logs** click to `affiliate_clicks` in Supabase with a generated UUID as the `id`/click token
- **Redirects** (HTTP 302) to the buyer's website with tracking params appended:  
  `https://www.buybacktree.com/?ref=revend&click_id=TOKEN&device=iphone-16-pro&condition=good`
- **Buyer website resolution:** Tries Supabase `buyers.website` column first (real data path), falls back to hardcoded slug → URL map (mock data path)
- **Error resilience:** Logging failures never block the redirect — user always gets sent to the buyer

Hardcoded buyer website fallbacks (for mock/local data):
| Slug | Website |
|------|---------|
| buybacktree | https://www.buybacktree.com |
| gazelle | https://www.gazelle.com |
| gadgetgone | https://www.gadgetgone.com |
| itsworthmore | https://www.itsworthmore.com |
| swappa | https://swappa.com |

---

### 2. `/app/api/clicks/route.ts` — Client-Side Fallback API
POST endpoint for client components that need to log clicks:

- **Request:** `POST /api/clicks` with JSON body:
  ```json
  { "deviceId": "...", "buyerId": "...", "conditionId": "...", "offerCents": 31200, "sessionId": "...", "buyerSlug": "buybacktree", "deviceSlug": "iphone-16-pro", "conditionSlug": "good" }
  ```
- **Response:** `{ "clickId": "uuid", "redirectUrl": "https://www.buybacktree.com/?ref=revend&..." }`
- Same logging logic as the route handler

---

### 3. `lib/session.ts` — Browser Session ID Utility
Client-side utility for stable session ID generation:

- `getSessionId()` — Gets or creates a UUID stored in `localStorage` under `revend_session_id`
- `buildGoUrl(opts)` — Builds the complete `/go/[buyer]/[device]` URL with all tracking params + session ID auto-injected
- Safe to call during SSR (returns `null` server-side)

---

### 4. `components/comparison/BuyerCard.tsx` — Updated CTA
- "Sell Now" button now calls `buildGoUrl()` from `lib/session.ts`
- Builds URL with: buyerSlug, deviceSlug, conditionSlug, offerCents, buyer.id (buyerId), + optional deviceId/conditionId props
- Opens in new tab for proper attribution tracking
- Added optional props: `deviceId?: string`, `conditionId?: string` (passed from parent when real UUIDs available)

---

### 5. `/app/admin/clicks/page.tsx` — Real-Time Attribution Dashboard
No-auth admin view at `/admin/clicks`:

- Shows last 50 clicks from Supabase with full joins (buyer name, device name, condition, offer)
- Stats strip: total clicks, unique sessions, avg offer, unique buyers
- Color-coded condition badges
- Responsive table with click ID, session ID truncation
- `force-dynamic` / no caching — always fresh data

---

## Test Results

```bash
# Test 1: Route handler redirect
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" \
  "http://localhost:3000/go/buybacktree/iphone-16-pro?condition=good&offer=31200"
# → 302 https://www.buybacktree.com/?ref=revend&click_id=18a1494f-...&device=iphone-16-pro&condition=good ✅

# Test 2: API clicks endpoint
curl -s -X POST "http://localhost:3000/api/clicks" \
  -H "Content-Type: application/json" \
  -d '{"buyerSlug":"gazelle","deviceSlug":"iphone-16-pro","conditionSlug":"good","offerCents":30100,"sessionId":"test-session-abc123"}'
# → {"clickId":"d977c247-...","redirectUrl":"https://www.gazelle.com/?ref=revend&..."} ✅

# Test 3: Supabase verification
# 2 rows confirmed in affiliate_clicks with correct data ✅
```

---

## TypeScript
`npx tsc --noEmit` → **0 errors** ✅

---

## Architecture Notes for Production

1. **Real buyer websites** — Add `website` column values to Supabase `buyers` table; the route handler will pick them up automatically via the `buyerId` lookup.

2. **Real device/condition IDs** — When the comparison page is powered by Supabase (not mock data), pass `deviceId` and `conditionId` as props to `BuyerCard` for precise attribution. Currently the mock data IDs (e.g. `d-iphone16pro`, `cond-good`) are stored but Supabase rejects them as non-UUID FK values — which is fine since the foreign keys are nullable.

3. **Session deduplication** — `session_id` in `affiliate_clicks` allows detecting duplicate clicks from the same browser session within a time window. Add a DB rule or cron job to deduplicate before commission payouts.

4. **Admin auth** — `/admin/clicks` has no authentication. Add Next.js middleware or Supabase Auth before public launch.

5. **CPA tracking** — Each click gets a unique `click_id` (UUID) which should be stored by the buyer and returned in their CPA postback/webhook when a sale completes. Revend should listen for these webhooks to confirm conversions.
