# Buyer Integration Flow Diagram

Visual guide to how data flows through the Revend platform.

---

## 1. Partnership & Business Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUYER PARTNERSHIP LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────────┘

Step 1: OUTREACH
┌──────────────┐
│ Revend sends │──────> Email template with value prop
│ initial email│        "We drive qualified leads to you"
└──────────────┘

Step 2: DISCOVERY CALL (15-30 min)
┌──────────────┐
│  Learn about │──────> Understand their business model
│ buyer's tech │        Ask about API/feed availability
│   & pricing  │        Discuss commission structure
└──────────────┘

Step 3: NEGOTIATION
┌──────────────┐
│ Agree on CPA │──────> Typical: 4-6% of device sale price
│  & tracking  │        Define tracking parameter (e.g., ?ref=revend)
└──────────────┘        Payment terms: Net-30 or Net-60

Step 4: CONTRACT
┌──────────────┐
│  Partnership │──────> 12-month initial term
│   Agreement  │        Brand usage rights
│    signed    │        Data integration terms
└──────────────┘        Termination clause

Step 5: TECHNICAL ONBOARDING
┌──────────────┐
│  Gather API  │──────> API credentials OR CSV feed access
│   docs & 🔑  │        Logo & brand assets
│              │        Test environment (if available)
└──────────────┘
        │
        ▼
   INTEGRATION
```

---

## 2. Technical Integration Flow

### Scenario A: REST API Integration (Best Case)

```
┌────────────────────────────────────────────────────────────────────┐
│                       API INTEGRATION FLOW                          │
└────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Revend     │
│  Cron Job    │ ──────────────────────────────────┐
│ (every 6hrs) │                                    │
└──────────────┘                                    │
        │                                           │
        │ 1. Trigger sync                           │
        ▼                                           │
┌──────────────────────────────┐                   │
│  BuyerAdapter.fetchPrices()  │                   │
│  /lib/adapters/buyer-x.ts    │                   │
└──────────────────────────────┘                   │
        │                                           │
        │ 2. HTTP GET request                       │
        ▼                                           │
┌────────────────────────────────────────┐         │
│     Buyer's API                         │         │
│  https://api.buyer.com/v1/pricing      │         │
│  Header: Authorization: Bearer {key}   │         │
└────────────────────────────────────────┘         │
        │                                           │
        │ 3. Returns JSON                           │
        ▼                                           │
┌────────────────────────────────────────┐         │
│  [                                      │         │
│    {                                    │         │
│      "device": "iPhone 15 Pro 256GB",  │         │
│      "condition": "good",              │         │
│      "price_usd": 650.00               │         │
│    },                                   │         │
│    ...                                  │         │
│  ]                                      │         │
└────────────────────────────────────────┘         │
        │                                           │
        │ 4. Transform to standard format           │
        ▼                                           │
┌────────────────────────────────────────┐         │
│  StandardizedOffer[]                   │         │
│  {                                      │         │
│    deviceId: "uuid-123",               │         │
│    buyerId: "uuid-456",                │         │
│    conditionId: "uuid-789",            │         │
│    offerCents: 65000,                  │         │
│    fetchedAt: "2026-03-05T10:00:00Z"   │         │
│  }                                      │         │
└────────────────────────────────────────┘         │
        │                                           │
        │ 5. Upsert to database                     │
        ▼                                           │
┌──────────────────────────────┐                   │
│   Supabase "offers" table    │                   │
│   device_id | buyer_id |     │                   │
│   condition | offer_cents    │ <─────────────────┘
└──────────────────────────────┘
        │
        │ 6. Update complete
        ▼
┌──────────────────────────────┐
│  Log success to monitoring   │
│  (Sentry, Slack, etc.)       │
└──────────────────────────────┘
```

### Scenario B: CSV Feed Integration

```
┌────────────────────────────────────────────────────────────────────┐
│                       CSV FEED INTEGRATION                          │
└────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Buyer      │
│  Generates   │ ────> Daily CSV export at 8:00 AM
│  CSV daily   │       Uploads to FTP or public URL
└──────────────┘

┌──────────────┐
│   Revend     │
│  Cron Job    │ ────> 1. Downloads CSV from FTP/URL
│ (daily 9am)  │       2. Parses with Papa Parse
└──────────────┘       3. Matches device names to catalog
        │              4. Upserts to "offers" table
        ▼
┌──────────────────────────────────────────────────┐
│  CSV Format Example:                             │
│  brand,model,storage_gb,condition,price_usd      │
│  Apple,iPhone 15 Pro,256,good,650.00             │
│  Samsung,Galaxy S24 Ultra,512,good,580.00        │
└──────────────────────────────────────────────────┘
        │
        │ Fuzzy matching algorithm
        ▼
┌──────────────────────────────┐
│   Match to device catalog    │
│   "iPhone 15 Pro 256GB"      │
│   → device_id = uuid-123     │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│   Supabase "offers" table    │
└──────────────────────────────┘
```

### Scenario C: Manual/Partner Portal

```
┌────────────────────────────────────────────────────────────────────┐
│                    MANUAL PORTAL INTEGRATION                        │
└────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Buyer      │
│  Logs into   │ ────> https://revend.com/admin/buyers/[buyer-id]
│   Portal     │       (Email/password or magic link)
└──────────────┘

┌─────────────────────────────────────────────┐
│       Partner Portal UI                     │
│  ┌───────────────────────────────────────┐  │
│  │  Bulk CSV Upload                      │  │
│  │  [Choose File] [Upload Prices]        │  │
│  └───────────────────────────────────────┘  │
│                OR                            │
│  ┌───────────────────────────────────────┐  │
│  │  Manual Entry Form                    │  │
│  │  Device: [iPhone 15 Pro 256GB]  ▼    │  │
│  │  Condition: [Good]  ▼                │  │
│  │  Price: [$650.00]                    │  │
│  │  [Save Price]                         │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
        │
        │ Saves to database
        ▼
┌──────────────────────────────┐
│   Supabase "offers" table    │
└──────────────────────────────┘
```

---

## 3. User Flow: Search to Sale

```
┌────────────────────────────────────────────────────────────────────┐
│                     CONSUMER JOURNEY                                │
└────────────────────────────────────────────────────────────────────┘

Step 1: USER SEARCHES
┌──────────────────────────────────┐
│   https://revend.com             │
│   Search: "iPhone 15 Pro"        │
│   [Search Button]                │
└──────────────────────────────────┘
        │
        │ Query: GET /api/search?q=iPhone+15+Pro
        ▼
┌──────────────────────────────────┐
│   Supabase Query:                │
│   SELECT * FROM device_families  │
│   WHERE name ILIKE '%iPhone 15%' │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│   Search Results Page                                │
│   ┌────────────────────────────────────────────┐     │
│   │ [Image] iPhone 15 Pro                      │     │
│   │         128GB | 256GB | 512GB              │     │
│   │         From $550                          │     │
│   │         [Compare Prices →]                 │     │
│   └────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘

Step 2: USER SELECTS DEVICE & CONDITION
┌──────────────────────────────────────────────────────┐
│   /sell/phone/apple/iphone-15-pro                    │
│   Select Storage: ● 256GB  ○ 512GB  ○ 1TB           │
│   Select Condition: ● Good  ○ Fair  ○ Like New      │
└──────────────────────────────────────────────────────┘
        │
        │ Query: GET /api/offers?device=...&condition=good
        ▼
┌──────────────────────────────────┐
│   Supabase Query:                │
│   SELECT * FROM offers           │
│   WHERE device_id = 'uuid-123'   │
│     AND condition_id = 'uuid-456'│
│   ORDER BY offer_cents DESC      │
└──────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│   Comparison Table                                          │
│   ┌───────────────────────────────────────────────────┐     │
│   │ Buyer          Price    Payment    Rating  Action │     │
│   │ BuyBackTree    $650  💵  1-2 days  ⭐⭐⭐⭐⭐  [Sell]│     │
│   │ Gazelle        $630  💵  3 days    ⭐⭐⭐⭐⭐  [Sell]│     │
│   │ Decluttr       $625  💵  5 days    ⭐⭐⭐⭐   [Sell]│     │
│   └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘

Step 3: USER CLICKS "SELL NOW"
        │
        │ Click tracked via /go/[buyer]/[device]/[condition]
        ▼
┌──────────────────────────────────────────────────────┐
│   Revend Backend:                                    │
│   1. Log click to affiliate_clicks table             │
│   2. Generate unique click_id                        │
│   3. Build affiliate URL                             │
└──────────────────────────────────────────────────────┘
        │
        │ INSERT INTO affiliate_clicks
        │ (buyer_id, device_id, condition_id, offer_cents,
        │  session_id, clicked_at)
        ▼
┌──────────────────────────────────┐
│   Supabase "affiliate_clicks"    │
│   - Logged for analytics         │
└──────────────────────────────────┘
        │
        │ 302 Redirect
        ▼
┌──────────────────────────────────────────────────────────┐
│   https://buybacktree.com/sell                           │
│   ?ref=revend                                            │
│   &device=iphone-15-pro-256gb                            │
│   &click_id=abc123xyz                                    │
│   &condition=good                                        │
└──────────────────────────────────────────────────────────┘

Step 4: USER COMPLETES SALE ON BUYER'S SITE
┌──────────────────────────────────┐
│   BuyBackTree Website:           │
│   1. User enters device details  │
│   2. Confirms condition          │
│   3. Ships device                │
│   4. Gets paid $650              │
└──────────────────────────────────┘
        │
        │ Conversion tracking (buyer reports back to Revend)
        ▼
┌──────────────────────────────────┐
│   Revend earns commission:       │
│   $650 × 5% = $32.50             │
└──────────────────────────────────┘
```

---

## 4. Data Model Relationships

```
┌────────────────────────────────────────────────────────────────────┐
│                       DATABASE SCHEMA                               │
└────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   brands    │
│ ─────────── │        ┌──────────────────┐
│ id          │───────<│ device_families  │
│ name        │   1:M  │ ──────────────── │
│ slug        │        │ id               │
│ logo_url    │        │ brand_id         │────┐
└─────────────┘        │ category_id      │    │
                       │ name             │    │
┌─────────────┐        │ slug             │    │
│ categories  │        │ image_url        │    │
│ ─────────── │<───────│ is_popular       │    │
│ id          │   1:M  └──────────────────┘    │
│ name        │                                 │
│ slug        │                                 │ 1:M
└─────────────┘                                 │
                                                ▼
                       ┌──────────────────┐
                       │    devices       │
                       │ ──────────────── │
                       │ id               │────┐
                       │ family_id        │    │
                       │ storage_gb       │    │
                       │ carrier          │    │ 1:M
                       │ msrp_cents       │    │
                       └──────────────────┘    │
                                                │
┌─────────────┐                                │
│   buyers    │                                 │
│ ─────────── │                                 │
│ id          │────┐                            │
│ name        │    │                            │
│ slug        │    │ 1:M                        │
│ website     │    │                            │
│ logo_url    │    │                            │
│ tagline     │    │                            │
│ cpa_percent │    │                            │
└─────────────┘    │                            │
                   │                            │
┌─────────────┐    │                            │
│ conditions  │    │                            │
│ ─────────── │    │                            │
│ id          │────┼────────────────────────────┼────┐
│ name        │    │                            │    │
│ slug        │    │                            │    │
│ description │    │                            │    │ 1:1:1
│ price_mult  │    │                            │    │
└─────────────┘    │                            │    │
                   │                            │    │
                   ▼                            ▼    ▼
                   ┌────────────────────────────────────┐
                   │           offers                   │
                   │ ────────────────────────────────── │
                   │ id                                 │
                   │ device_id      (FK → devices.id)   │
                   │ buyer_id       (FK → buyers.id)    │
                   │ condition_id   (FK → conditions.id)│
                   │ offer_cents                        │
                   │ is_active                          │
                   │ fetched_at                         │
                   │ expires_at                         │
                   │                                    │
                   │ UNIQUE(device_id, buyer_id,        │
                   │        condition_id)               │
                   └────────────────────────────────────┘
                                    │
                                    │ Logs to
                                    ▼
                   ┌────────────────────────────────────┐
                   │      affiliate_clicks              │
                   │ ────────────────────────────────── │
                   │ id                                 │
                   │ device_id                          │
                   │ buyer_id                           │
                   │ condition_id                       │
                   │ offer_cents                        │
                   │ session_id                         │
                   │ clicked_at                         │
                   └────────────────────────────────────┘
```

---

## 5. Price Update Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│                   AUTOMATED PRICE SYNC CYCLE                        │
└────────────────────────────────────────────────────────────────────┘

                    ⏰ EVERY 6 HOURS
                          │
                          ▼
        ┌─────────────────────────────────┐
        │   Vercel Cron or GitHub Action  │
        │   Triggers: sync-all-buyers.ts  │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────────┐
        │   For each buyer adapter:                   │
        │   1. BuyBackTreeAdapter.fetchPrices()       │
        │   2. GazelleAdapter.fetchPrices()           │
        │   3. DecluttrAdapter.fetchPrices()          │
        │   ... (all configured buyers)               │
        └─────────────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
           ▼              ▼              ▼
      ┌────────┐     ┌────────┐    ┌────────┐
      │ Buyer1 │     │ Buyer2 │    │ Buyer3 │
      │  API   │     │  API   │    │  CSV   │
      └────────┘     └────────┘    └────────┘
           │              │              │
           └──────────────┼──────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │   Normalize to StandardizedOffer│
        │   - Map device names to IDs     │
        │   - Convert prices to cents     │
        │   - Validate data                │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │   UPSERT to "offers" table      │
        │   ON CONFLICT (device_id,       │
        │   buyer_id, condition_id)       │
        │   DO UPDATE SET:                │
        │   - offer_cents = new value     │
        │   - fetched_at = NOW()          │
        │   - is_active = true            │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │   Archive old price to          │
        │   "price_history" table         │
        │   (for trend analysis)          │
        └─────────────────────────────────┘
                          │
            Success?      │       Error?
           ┌──────────────┴──────────────┐
           ▼                             ▼
    ┌─────────────┐           ┌─────────────────┐
    │ Log success │           │ Log error to    │
    │ to Sentry   │           │ Sentry + Slack  │
    │ [200 OK]    │           │ Alert team      │
    └─────────────┘           └─────────────────┘
```

---

## 6. Revenue Attribution Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                  HOW REVEND TRACKS REVENUE                          │
└────────────────────────────────────────────────────────────────────┘

Step 1: USER CLICKS "SELL NOW"
        │
        │ Revend generates unique click_id
        ▼
┌──────────────────────────────────────────┐
│  affiliate_clicks table                  │
│  ────────────────────────────────────    │
│  click_id: "abc123xyz"                   │
│  buyer_id: "buybacktree-uuid"            │
│  device_id: "iphone15pro-256-uuid"       │
│  offer_cents: 65000 ($650)               │
│  clicked_at: 2026-03-05T14:30:00Z        │
└──────────────────────────────────────────┘
        │
        │ Redirect with click_id in URL
        ▼
┌──────────────────────────────────────────────┐
│  https://buybacktree.com/sell               │
│  ?ref=revend&click_id=abc123xyz             │
│  &device=iphone-15-pro-256gb                │
└──────────────────────────────────────────────┘

Step 2: USER COMPLETES SALE (30-90 days later)
        │
        │ Buyer tracks conversion on their end
        ▼
┌──────────────────────────────────────────┐
│  Buyer's System:                         │
│  - click_id: abc123xyz                   │
│  - Sale completed: $650                  │
│  - Commission owed: $650 × 5% = $32.50   │
└──────────────────────────────────────────┘
        │
        │ METHOD 1: Conversion Pixel (Real-Time)
        │ Buyer sends postback to Revend
        ▼
┌──────────────────────────────────────────────┐
│  POST https://revend.com/api/conversion      │
│  {                                           │
│    "click_id": "abc123xyz",                  │
│    "sale_amount": 650.00,                    │
│    "commission": 32.50,                      │
│    "timestamp": "2026-03-10T09:00:00Z"       │
│  }                                           │
└──────────────────────────────────────────────┘
        │
        │ OR METHOD 2: Monthly CSV Report
        │ Buyer emails CSV at end of month
        ▼
┌──────────────────────────────────────────────┐
│  conversions-2026-03.csv                     │
│  click_id,sale_date,amount,commission        │
│  abc123xyz,2026-03-10,650.00,32.50           │
│  def456uvw,2026-03-11,480.00,24.00           │
│  ...                                         │
└──────────────────────────────────────────────┘
        │
        │ Import to conversions table
        ▼
┌──────────────────────────────────────────┐
│  conversions table (new)                 │
│  ────────────────────────────────────    │
│  click_id: "abc123xyz"                   │
│  sale_amount_cents: 65000                │
│  commission_cents: 3250                  │
│  converted_at: 2026-03-10T09:00:00Z      │
│  buyer_id: "buybacktree-uuid"            │
└──────────────────────────────────────────┘

Step 3: REVENUE REPORTING
        │
        ▼
┌──────────────────────────────────────────────┐
│  Admin Dashboard: /admin/revenue             │
│  ────────────────────────────────────────    │
│  March 2026 Revenue:                         │
│  - Total Clicks: 1,000                       │
│  - Conversions: 100 (10% CVR)                │
│  - Total Sales: $40,000                      │
│  - Commission Earned: $2,000 (5% avg)        │
│                                              │
│  Top Buyer: BuyBackTree ($800 commission)    │
│  Top Device: iPhone 15 Pro ($1,200 revenue)  │
└──────────────────────────────────────────────┘
```

---

## 7. Error Handling & Monitoring

```
┌────────────────────────────────────────────────────────────────────┐
│                   MONITORING & ALERTS                               │
└────────────────────────────────────────────────────────────────────┘

ERROR SCENARIO 1: API Down
┌──────────────────────────────────┐
│  Buyer API returns 500 error     │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Adapter catches error           │
│  try/catch block                 │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Log to Sentry with context:     │
│  - Buyer name                    │
│  - Error message                 │
│  - Timestamp                     │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Send Slack alert:               │
│  "⚠️ BuyBackTree API failed"     │
│  "Last successful sync: 6hrs ago"│
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  FALLBACK: Keep old prices       │
│  active for 24 hours             │
│  (Don't delete stale data)       │
└──────────────────────────────────┘

ERROR SCENARIO 2: Device Mismatch
┌──────────────────────────────────┐
│  Buyer sends "iPhone 17 Pro Max" │
│  (Not in Revend catalog)         │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  findDeviceId() returns null     │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Log warning:                    │
│  "Unknown device: iPhone 17 Pro" │
│  "Add to catalog manually"       │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Append to pending_devices.csv   │
│  for manual review               │
└──────────────────────────────────┘

ERROR SCENARIO 3: Price Outlier
┌──────────────────────────────────┐
│  Buyer reports price: $1.00      │
│  (Avg price: $650)               │
│  Possible error or typo          │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Validation logic:               │
│  if (price < avg * 0.5)          │
│    flag as suspicious            │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Manual review queue:            │
│  Don't publish price until       │
│  admin approves                  │
└──────────────────────────────────┘
```

---

## Summary

This diagram illustrates:

1. **Partnership Flow**: From first email to signed contract
2. **Technical Integration**: API, CSV, and manual approaches
3. **User Journey**: Search → Compare → Click → Sale
4. **Data Model**: How tables relate to each other
5. **Price Sync**: Automated update cycle every 6 hours
6. **Revenue Tracking**: How clicks become commissions
7. **Error Handling**: Graceful degradation and alerts

**Next Step:** Read `BUYER_INTEGRATION_GUIDE.md` for detailed implementation instructions.

---

**Created:** March 5, 2026
**For:** Revend Platform
