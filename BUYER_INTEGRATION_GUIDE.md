# Buyer Integration Guide for Revend

**Last Updated:** March 5, 2026
**Purpose:** Comprehensive guide for integrating real buyback companies into the Revend price comparison platform

---

## Table of Contents

1. [Overview: How Price Comparison Platforms Work](#1-overview-how-price-comparison-platforms-work)
2. [The Partnership Process (Business Side)](#2-the-partnership-process-business-side)
3. [Technical Integration Process](#3-technical-integration-process)
4. [Product Image Sourcing](#4-product-image-sourcing)
5. [Product Catalog Management](#5-product-catalog-management)
6. [Implementation Roadmap for Revend](#6-implementation-roadmap-for-revend)
7. [Appendix: API Examples & Resources](#7-appendix-api-examples--resources)

---

## 1. Overview: How Price Comparison Platforms Work

### The SellCell Model

Based on research into SellCell (the market leader), here's how price comparison platforms operate:

**Core Function:**
- Aggregate prices from 40+ buyback companies
- Display real-time offers side-by-side
- Users click through to the buyer's site
- Platform earns commission on each referral

**Value Proposition:**
- **For Consumers:** One search shows all prices, saves time, guarantees best deal
- **For Buyers:** Consistent lead flow, pre-qualified customers, shared marketing costs
- **For Platform:** Commission per sale (CPA model), minimal inventory risk

**Revenue Model:**
- Cost-Per-Acquisition (CPA): Typically 3-8% of the device sale price
- Alternative: Flat fee per lead (e.g., $2-$10 per click)
- Premium placements: Featured buyer badges, top-of-list positioning

---

## 2. The Partnership Process (Business Side)

### Phase 1: Buyer Vetting & Outreach

**Target Buyer Profile:**
- Established buyback companies with online presence
- BBB rating of B+ or higher
- Fast payment (under 5 days)
- Accepts PayPal, Venmo, or direct deposit
- Professional website with SSL

**Outreach Strategy:**

1. **Initial Contact Email Template:**
   ```
   Subject: Partnership Opportunity - Revend Price Comparison Platform

   Hi [Buyer Name],

   I'm reaching out from Revend, a new device trade-in price comparison platform
   launching in [Month/Year]. We help consumers find the best prices for their
   used devices by comparing offers from trusted buyers like you.

   We're currently vetting buyback partners and would love to explore a
   partnership. Here's what we offer:

   - High-quality, pre-qualified leads (users actively selling devices)
   - No upfront costs - commission-based model
   - Full attribution tracking for transparency
   - Professional brand placement with your logo & ratings

   Are you interested in receiving more qualified leads? I'd be happy to
   schedule a brief call to discuss how we can work together.

   Best,
   [Your Name]
   Revend | [website]
   ```

2. **Discovery Call Agenda:**
   - Understand their business model
   - Learn about their pricing structure
   - Discuss commission terms (target: 4-6% CPA)
   - Ask about existing API or data feeds
   - Timeline for integration

### Phase 2: Partnership Agreement

**Key Contract Terms:**

1. **Commission Structure:**
   - CPA Percentage: 3-8% of device sale price (industry standard)
   - Minimum threshold: First payout at $100-$500
   - Payment frequency: Net-30 or Net-60
   - Tracking window: 30-90 day cookie

2. **Attribution & Tracking:**
   - Click tracking via unique affiliate parameter
   - Conversion reporting (monthly CSV or API)
   - Dispute resolution process
   - Fraud prevention measures

3. **Brand Usage:**
   - Logo usage rights
   - Trademark guidelines
   - Brand approval process
   - Promotional limitations

4. **Data Integration:**
   - Pricing data update frequency (hourly, daily, weekly)
   - API access or manual feed
   - SLA for uptime (if applicable)
   - Data format specifications

5. **Term & Termination:**
   - Initial term: 12 months
   - Auto-renewal clause
   - 30-day termination notice
   - Post-termination tracking window

**Sample Partnership Models:**

| Model | How It Works | Best For |
|-------|--------------|----------|
| **CPA (Cost Per Acquisition)** | 4-6% of device sale price paid after transaction completes | Most buyers prefer this - low risk |
| **CPL (Cost Per Lead)** | $2-$10 flat fee per qualified click | Buyers with high conversion rates |
| **Hybrid** | $1 per click + 2% of sale | Balanced risk/reward |
| **Tiered** | Higher % for high-volume partners | Incentivize top performers |

### Phase 3: Technical Onboarding

Once the partnership is signed, move to technical integration:

1. **Gather Integration Details:**
   - API documentation (if available)
   - API keys / credentials
   - Data feed format (JSON, XML, CSV)
   - Update frequency
   - Test environment access

2. **Brand Assets:**
   - Logo (SVG or PNG, transparent background)
   - Brand colors (hex codes)
   - Tagline / marketing copy
   - Trust badges (BBB, TrustPilot, etc.)

3. **Tracking Setup:**
   - Affiliate parameter name (e.g., `?ref=revend`)
   - Click ID format
   - Conversion pixel or postback URL
   - Reporting dashboard access

---

## 3. Technical Integration Process

### Integration Scenarios

Based on research, buyers typically provide pricing data in one of four ways:

#### Scenario A: REST API (Best Case)

**Example Buyer API:**
```
GET https://api.buyercompany.com/v1/pricing
Authorization: Bearer {api_key}

Query Parameters:
- device_type: "phone" | "tablet" | "laptop"
- brand: "apple" | "samsung" | "google"
- model: "iPhone 15 Pro"
- storage_gb: 256
- condition: "good" | "fair" | "poor" | "like-new"
- carrier: "unlocked" | "verizon" | "att"

Response (JSON):
{
  "device": {
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "storage": "256GB",
    "condition": "good"
  },
  "offer": {
    "price_usd": 650.00,
    "expires_at": "2026-03-06T23:59:59Z",
    "affiliate_url": "https://buyercompany.com/sell?device=iphone15pro&ref={PARTNER_ID}"
  }
}
```

**Implementation for Revend:**

1. Create a buyer adapter in `/lib/adapters/`
2. Build a cron job or serverless function to poll API
3. Update `offers` table with latest prices
4. Log errors and handle rate limits

**Example Code Structure:**
```typescript
// lib/adapters/buyback-company-adapter.ts

interface BuybackApiConfig {
  apiKey: string
  baseUrl: string
  partnerId: string
}

export async function fetchPricesFromBuyer(
  config: BuybackApiConfig
): Promise<OfferUpdate[]> {
  const response = await fetch(`${config.baseUrl}/v1/pricing`, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  // Transform to Revend's offer format
  return transformToOffers(data, config.partnerId)
}

function transformToOffers(data: any, buyerId: string): OfferUpdate[] {
  // Map buyer's response to Revend's schema
  return data.map(item => ({
    deviceId: mapToDeviceId(item),
    buyerId,
    conditionId: mapToConditionId(item.condition),
    offerCents: Math.round(item.price_usd * 100),
    fetchedAt: new Date(),
    expiresAt: item.expires_at ? new Date(item.expires_at) : null
  }))
}
```

#### Scenario B: CSV/XML Data Feed

**Common Setup:**
- Buyer provides daily/hourly CSV file via FTP/SFTP
- Or: Public URL with CSV download
- Or: Email attachment (least ideal)

**Example CSV Format:**
```csv
brand,model,storage_gb,condition,carrier,price_usd,updated_at
Apple,iPhone 15 Pro,128,good,unlocked,550.00,2026-03-05T10:00:00Z
Apple,iPhone 15 Pro,256,good,unlocked,650.00,2026-03-05T10:00:00Z
Apple,iPhone 15 Pro,512,good,unlocked,750.00,2026-03-05T10:00:00Z
Samsung,Galaxy S24 Ultra,256,good,unlocked,480.00,2026-03-05T10:00:00Z
```

**Implementation:**
```typescript
// scripts/import-buyer-csv.ts

import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'

async function importBuyerCSV(buyerId: string, csvUrl: string) {
  // 1. Download CSV
  const response = await fetch(csvUrl)
  const csvText = await response.text()

  // 2. Parse CSV
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true
  })

  // 3. Match to existing devices in DB
  const db = createClient(...)

  for (const row of rows) {
    // Find matching device_id from your catalog
    const { data: device } = await db
      .from('devices')
      .select('id, family_id')
      .eq('family_id', await findFamilyId(row.brand, row.model))
      .eq('storage_gb', parseInt(row.storage_gb))
      .eq('carrier', row.carrier)
      .single()

    if (!device) {
      console.warn(`Device not found: ${row.brand} ${row.model} ${row.storage_gb}GB`)
      continue
    }

    // Find condition_id
    const conditionId = await findConditionId(row.condition)

    // 4. Upsert offer
    await db.from('offers').upsert({
      device_id: device.id,
      buyer_id: buyerId,
      condition_id: conditionId,
      offer_cents: Math.round(parseFloat(row.price_usd) * 100),
      is_active: true,
      fetched_at: new Date(),
      expires_at: row.updated_at ? addDays(new Date(row.updated_at), 7) : null
    }, {
      onConflict: 'device_id,buyer_id,condition_id'
    })
  }
}
```

#### Scenario C: Manual Price Updates (Temporary Solution)

If a buyer doesn't have an API or feed initially, you can:

1. **Manual Entry Portal:** Build an admin interface where you manually enter prices
2. **Google Sheets Integration:** Use Google Sheets API to import pricing data
3. **Scraping (Last Resort):** Automate browser to scrape their website (check ToS first!)

**Google Sheets Approach:**
```typescript
// Example using Google Sheets as a temporary database
import { GoogleSpreadsheet } from 'google-spreadsheet'

async function syncFromGoogleSheet(sheetId: string, buyerId: string) {
  const doc = new GoogleSpreadsheet(sheetId)
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!
  })

  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()

  // Process rows similar to CSV import above
}
```

#### Scenario D: Partner Portal (No API)

For buyers without any automated solution:

1. **Provide them with a partner portal:**
   - Build a simple admin interface at `/admin/buyers/[buyer-id]/pricing`
   - Let them log in and update prices manually
   - Bulk upload via CSV
   - Schedule automatic expiry (e.g., prices expire after 7 days)

2. **Workflow:**
   - Buyer logs in weekly
   - Downloads template CSV with all devices
   - Updates prices in Excel
   - Uploads back to portal
   - System updates `offers` table

### Update Frequency Recommendations

| Buyer Type | Update Frequency | Method |
|------------|------------------|--------|
| **Large, API-enabled** | Every 1-6 hours | Automated API polling |
| **Medium, CSV feed** | Daily | SFTP/URL download + import |
| **Small, manual** | Weekly | Google Sheets or partner portal |
| **Startup** | As needed | Manual admin entry |

### Handling Multiple Buyer API Formats

**Adapter Pattern:**

Create a standardized adapter interface that normalizes all buyer data:

```typescript
// lib/adapters/types.ts

export interface BuyerAdapter {
  name: string
  fetchPrices(): Promise<StandardizedOffer[]>
}

export interface StandardizedOffer {
  brandName: string
  modelName: string
  storageGb: number
  carrier: string
  condition: 'like-new' | 'good' | 'fair' | 'poor'
  priceCents: number
  expiresAt?: Date
}

// lib/adapters/buyback-tree.ts
export class BuyBackTreeAdapter implements BuyerAdapter {
  name = 'BuyBackTree'

  async fetchPrices(): Promise<StandardizedOffer[]> {
    // Implementation specific to BuyBackTree API
    const response = await fetch('https://buybacktree.com/api/pricing')
    const data = await response.json()
    return this.transform(data)
  }

  private transform(data: any): StandardizedOffer[] {
    // Map BuyBackTree format to standard format
  }
}

// lib/adapters/gazelle.ts
export class GazelleAdapter implements BuyerAdapter {
  name = 'Gazelle'

  async fetchPrices(): Promise<StandardizedOffer[]> {
    // Implementation specific to Gazelle API
    // Different format, but returns same StandardizedOffer[]
  }
}
```

**Price Sync Service:**

```typescript
// scripts/sync-all-buyers.ts

import { BuyBackTreeAdapter } from '@/lib/adapters/buyback-tree'
import { GazelleAdapter } from '@/lib/adapters/gazelle'
import { createClient } from '@supabase/supabase-js'

const adapters = [
  new BuyBackTreeAdapter(),
  new GazelleAdapter(),
  // Add more as you integrate
]

async function syncAllBuyers() {
  const db = createClient(...)

  for (const adapter of adapters) {
    console.log(`Syncing ${adapter.name}...`)

    try {
      const offers = await adapter.fetchPrices()

      for (const offer of offers) {
        // Find matching device in your catalog
        const device = await findDevice(offer)
        if (!device) continue

        // Find buyer_id
        const buyer = await findBuyerByName(adapter.name)
        if (!buyer) continue

        // Find condition_id
        const condition = await findConditionBySlug(offer.condition)
        if (!condition) continue

        // Upsert offer
        await db.from('offers').upsert({
          device_id: device.id,
          buyer_id: buyer.id,
          condition_id: condition.id,
          offer_cents: offer.priceCents,
          is_active: true,
          fetched_at: new Date(),
          expires_at: offer.expiresAt || null
        }, {
          onConflict: 'device_id,buyer_id,condition_id'
        })
      }

      console.log(`✓ ${adapter.name}: ${offers.length} offers synced`)
    } catch (error) {
      console.error(`✗ ${adapter.name} failed:`, error)
      // Log to error tracking (Sentry, etc.)
    }
  }
}

// Run every hour via cron or serverless function
syncAllBuyers()
```

### Affiliate Click Tracking

**How it works:**

1. User clicks "Sell Now" on a buyer's offer
2. Revend redirects through `/go/[buyer]/[device]/[condition]`
3. Log the click to `affiliate_clicks` table
4. Redirect to buyer's site with tracking parameter

**Implementation (already exists in Revend):**

```typescript
// app/go/[buyer]/[device]/[condition]/route.ts

import { logClick } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { buyer: string; device: string; condition: string } }
) {
  // 1. Log the click
  await logClick({
    buyerId: params.buyer,
    deviceId: params.device,
    conditionId: params.condition,
    sessionId: getSessionId(request)
  })

  // 2. Build affiliate URL
  const buyer = await getBuyer(params.buyer)
  const affiliateUrl = buildAffiliateUrl(buyer, params.device, params.condition)

  // 3. Redirect
  redirect(affiliateUrl)
}

function buildAffiliateUrl(buyer: Buyer, deviceId: string, condition: string): string {
  // Example: https://buyercompany.com/sell?device=iphone15pro&ref=revend&click_id=abc123
  const baseUrl = buyer.website || buyer.affiliate_url
  const params = new URLSearchParams({
    [buyer.affiliate_param || 'ref']: 'revend',
    device: deviceId,
    condition: condition,
    click_id: generateClickId()
  })
  return `${baseUrl}?${params.toString()}`
}
```

---

## 4. Product Image Sourcing

### Challenge
You need high-quality, consistent images for 1000+ devices across multiple brands.

### Solution Options

#### Option 1: Device Specification APIs (Recommended)

**MobileAPI.dev** - Best for smartphones, tablets, smartwatches
- **Coverage:** 15,000+ devices from 200+ brands
- **Images:** 5-10 professional photos per device (multiple angles, colors)
- **Pricing:** Free tier available, paid plans start at $29/month
- **Data Format:** JSON REST API
- **Integration:**
  ```typescript
  // Example: Fetch iPhone 15 Pro images
  const response = await fetch('https://mobileapi.dev/api/v1/devices/apple-iphone-15-pro', {
    headers: { 'Authorization': `Bearer ${MOBILE_API_KEY}` }
  })
  const data = await response.json()
  // data.images = ["url1.jpg", "url2.jpg", ...]
  ```

**TechSpecs API** - Best for all electronics (laptops, monitors, etc.)
- **Coverage:** 240,000+ products across all tech categories
- **Images:** High-quality product images, multi-color variants
- **Pricing:** Custom pricing based on usage
- **Use Case:** When you expand beyond phones/tablets

#### Option 2: Stock Image APIs (Fallback)

For devices without API coverage:

**Unsplash API** - Free, high-quality stock photos
- Search for generic device photos: "iPhone 15 Pro", "Samsung Galaxy S24"
- Free for commercial use with attribution
- **Limitation:** Not device-specific (e.g., might show wrong color/storage)

**Pexels API** - Similar to Unsplash
- Large library of tech product photos
- Free with attribution

#### Option 3: Manufacturer Websites (Manual)

For new/popular devices:
1. Visit Apple.com, Samsung.com, etc.
2. Download product images from marketing pages
3. **Legal:** Most manufacturers allow use for resale/comparison purposes, but check their brand guidelines
4. Store in `/public/images/devices/[brand]/[model]/`

**Apple GSX API (Advanced):**
- If you become an Apple Authorized Service Provider, you get access to GSX API
- Provides official device images, specs, serial number lookups
- **Requirement:** Must be registered AASP (significant process)

#### Option 4: Hybrid Approach (Recommended for Revend)

**Phase 1: Launch (Manual)**
1. Focus on top 100 most-traded devices
2. Manually download images from manufacturer sites
3. Store in `/public/images/devices/`
4. Update `device_families.image_url` column

**Phase 2: Scale (API)**
1. Subscribe to MobileAPI.dev ($29-99/month)
2. Build nightly sync script to update new devices
3. Fallback to manufacturer sites for missing devices

**Phase 3: Automation (Full API)**
1. Integrate TechSpecs API for comprehensive coverage
2. Automatic image updates when new devices release
3. CDN integration for fast loading

### Image Storage Best Practices

```typescript
// Recommended structure:
/public/images/devices/
  apple/
    iphone-15-pro/
      main.png          // Primary hero image
      front.png
      back.png
      gold.png          // Color variants
      silver.png
  samsung/
    galaxy-s24-ultra/
      main.png
      ...
```

**Image Specifications:**
- Format: PNG (transparent background) or WebP (better compression)
- Size: 800x800px (square) or 600x800px (portrait)
- Max file size: 100KB (optimize with Sharp or TinyPNG)
- Naming: Lowercase, kebab-case, descriptive

**Optimization:**

```typescript
// scripts/optimize-images.ts
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'

async function optimizeDeviceImages() {
  const imagesDir = '/public/images/devices'
  const files = await getAllImageFiles(imagesDir)

  for (const file of files) {
    await sharp(file)
      .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .webp({ quality: 85 })
      .toFile(file.replace('.png', '.webp'))

    console.log(`✓ Optimized ${file}`)
  }
}
```

---

## 5. Product Catalog Management

### Challenge
Keeping your device catalog updated with:
- New device releases (iPhone 17, Galaxy S25, etc.)
- Accurate specifications (storage options, colors, carriers)
- Variant mapping (256GB vs 512GB, Unlocked vs Verizon)

### Solutions

#### Option 1: Manual Curation (Current State)

**Process:**
1. Monitor tech news for new device releases
2. Add to `device_families` and `devices` tables manually
3. Source images from manufacturer sites
4. Notify buyers to update pricing

**Tools:**
- Google Sheets with device catalog template
- CSV import script to bulk-add devices
- Alerts from sites like GSMArena, TechCrunch

**Pros:** Free, full control, accurate
**Cons:** Time-consuming, prone to delays

#### Option 2: Device Specification APIs (Recommended)

**MobileAPI.dev / TechSpecs API:**

```typescript
// scripts/sync-device-catalog.ts

interface DeviceFromAPI {
  brand: string
  model: string
  release_date: string
  storage_options: number[] // [128, 256, 512, 1024]
  colors: string[]
  carriers: string[]
  msrp_usd: number
  images: string[]
}

async function syncNewDevices() {
  const api = new MobileAPIClient(MOBILE_API_KEY)

  // Get all devices released in the last 30 days
  const newDevices = await api.getDevices({
    released_after: thirtyDaysAgo(),
    categories: ['smartphone', 'tablet']
  })

  const db = getDb()

  for (const device of newDevices) {
    // 1. Ensure brand exists
    let brand = await db.from('brands')
      .select('id')
      .eq('slug', slugify(device.brand))
      .single()

    if (!brand) {
      brand = await db.from('brands').insert({
        name: device.brand,
        slug: slugify(device.brand),
        is_active: true
      }).select('id').single()
    }

    // 2. Create device family
    const family = await db.from('device_families').insert({
      brand_id: brand.id,
      category_id: await getCategoryId('smartphone'),
      name: device.model,
      slug: slugify(device.model),
      image_url: device.images[0],
      released_year: new Date(device.release_date).getFullYear(),
      is_popular: false, // Mark popular manually
      is_active: true
    }).select('id').single()

    // 3. Create variants for each storage option
    for (const storage of device.storage_options) {
      for (const carrier of ['unlocked', ...device.carriers]) {
        await db.from('devices').insert({
          family_id: family.id,
          storage_gb: storage,
          carrier: carrier,
          msrp_cents: Math.round(device.msrp_usd * 100),
          is_active: true
        })
      }
    }

    console.log(`✓ Added ${device.brand} ${device.model}`)
  }
}

// Run weekly via cron
```

**Benefits:**
- Automatic new device detection
- Accurate specs from trusted source
- Includes images, colors, storage options

**Cost:** $29-$99/month depending on API call volume

#### Option 3: Community-Maintained Database

**OpenSTF Device Database (GitHub):**
- Free, open-source JSON database of devices
- Updated by community contributors
- **URL:** https://github.com/openstf/stf-device-db
- **Format:** JSON files with device specs

**Implementation:**
```typescript
// scripts/import-openstf.ts

import devices from './stf-device-db/devices.json'

async function importFromOpenSTF() {
  for (const device of devices) {
    // Transform and insert into Revend database
    // Note: You'll need to map their schema to yours
  }
}
```

**Pros:** Free, comprehensive
**Cons:** May lag behind new releases, requires schema mapping

#### Option 4: Hybrid Approach (Recommended)

**Phase 1: Popular Devices (Manual)**
- Top 50 most-traded devices (iPhone, Samsung flagships, etc.)
- Updated quarterly or when major releases happen
- Use manufacturer sites for images and specs

**Phase 2: Expansion (API-Assisted)**
- Subscribe to MobileAPI.dev
- Weekly sync of new devices from API
- Manual review and approval before publishing

**Phase 3: Full Automation (API + Community)**
- Nightly sync from MobileAPI.dev
- Fallback to OpenSTF for obscure devices
- Automated image optimization and storage
- Slack notifications when new devices are added

### Handling Device Variants

**Challenge:** How do you map all the variants?
- iPhone 15 Pro: 128GB, 256GB, 512GB, 1TB
- Colors: Natural Titanium, Blue Titanium, White Titanium, Black Titanium
- Carriers: Unlocked, Verizon, AT&T, T-Mobile

**Solution in Revend Schema:**

The `devices` table already handles this:
```sql
-- device_families: The model (e.g., "iPhone 15 Pro")
-- devices: Specific sellable variants

INSERT INTO device_families (brand_id, category_id, name, slug, image_url)
VALUES (apple_id, phone_id, 'iPhone 15 Pro', 'iphone-15-pro', '/images/iphone-15-pro.png');

-- Create variants
INSERT INTO devices (family_id, storage_gb, carrier, msrp_cents)
VALUES
  (family_id, 128, 'unlocked', 99900),
  (family_id, 256, 'unlocked', 109900),
  (family_id, 512, 'unlocked', 129900),
  (family_id, 1024, 'unlocked', 149900);
```

**Color Handling:**
- Most buyback companies don't differentiate by color (price is the same)
- Store color in `devices.color` column only if buyers price differently
- Otherwise, show all colors in product images but use single pricing

---

## 6. Implementation Roadmap for Revend

### Current State
- Database schema is ready (`buyers`, `offers`, `devices`, etc.)
- Click tracking is implemented (`/go/` redirect)
- Frontend displays mock data
- Partnership with BuyBackTree (Ryan) is in progress

### Immediate Next Steps (Week 1-2)

#### Task 1: Finalize BuyBackTree Partnership
**Owner:** Nick + Ryan
**Deliverables:**
- [ ] Signed partnership agreement (CPA terms)
- [ ] Affiliate tracking parameter (e.g., `?ref=revend`)
- [ ] API documentation or pricing feed format
- [ ] Brand assets (logo, colors, tagline)

#### Task 2: Build BuyBackTree Adapter
**Owner:** Developer
**Files to Create:**
- `/lib/adapters/buyback-tree.ts` - API client
- `/scripts/sync-buyback-tree.ts` - Cron job to fetch prices
- `/lib/adapters/types.ts` - Standardized interface

**Steps:**
1. Request API access from Ryan
2. Test API in Postman/curl
3. Map BuyBackTree's device names to Revend's `device_families`
4. Build adapter following the pattern in Section 3
5. Test with 10-20 devices
6. Deploy hourly sync via Vercel Cron or GitHub Actions

#### Task 3: Seed Initial Device Catalog
**Owner:** Content
**Deliverables:**
- [ ] Top 50 most-traded devices added to `device_families`
- [ ] Variants created in `devices` table
- [ ] Images sourced and uploaded to `/public/images/devices/`

**Recommended Devices:**
- iPhones: 13, 14, 15, 16 (all models)
- Samsung Galaxy: S22, S23, S24 (all models)
- Google Pixel: 7, 8, 9
- iPads: Air, Pro (latest 2 generations)
- MacBooks: Air M1/M2, Pro M1/M2

**Data Source:**
- Manual entry from manufacturer sites
- Or: Import from CSV template

#### Task 4: Test Integration End-to-End
**Owner:** QA
**Test Cases:**
1. User searches for "iPhone 15 Pro"
2. Sees BuyBackTree's real price
3. Clicks "Sell Now"
4. Redirected to BuyBackTree with `?ref=revend`
5. Click logged in `affiliate_clicks` table

### Short-Term Goals (Month 1)

#### Goal 1: Add 3-5 More Buyers
**Target Buyers:**
- Gazelle (large, established)
- Decluttr (UK-based, US operations)
- ItsWorthMore
- uSell (aggregator, may have API)
- Local buyer (if any regional partners)

**Process:**
1. Outreach using email template (Section 2)
2. Negotiate CPA (target: 4-6%)
3. Integrate via API or CSV feed
4. Launch with pricing for top 20 devices initially

#### Goal 2: Automate Pricing Syncs
**Implementation:**
- Set up Vercel Cron Jobs or GitHub Actions
- Run `sync-all-buyers.ts` every 6 hours
- Slack notifications on errors
- Monitor via Datadog or PostHog

**Cron Schedule:**
```yaml
# .github/workflows/sync-prices.yml
name: Sync Buyer Prices
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch: # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run sync-all-buyers
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          BUYBACK_TREE_API_KEY: ${{ secrets.BUYBACK_TREE_API_KEY }}
```

#### Goal 3: Expand Device Catalog to 200 Devices
**Strategy:**
- Subscribe to MobileAPI.dev ($29/month)
- Run weekly sync script
- Manual review before publishing new devices

### Medium-Term Goals (Month 2-3)

#### Goal 1: Build Partner Portal
**Why:** Not all buyers have APIs. Give them a way to update prices directly.

**Features:**
- Login with email/password (or magic link)
- Dashboard showing their active devices
- Bulk CSV upload for price updates
- Price history charts
- Click/conversion analytics

**Tech Stack:**
- Next.js App Router (already in use)
- Supabase Auth for buyer accounts
- CSV parsing with `papaparse`

#### Goal 2: Add Price History & Alerts
**Features:**
- Track price changes in `price_history` table (already exists)
- Show "Price Dropped 10%" badges
- Let users subscribe to price alerts
- Send email when target price is reached (via Resend)

#### Goal 3: Revenue Tracking & Reporting
**Build Admin Dashboard:**
- `/admin/analytics` - Total clicks, conversions, revenue
- `/admin/buyers` - Per-buyer performance
- `/admin/devices` - Top-traded devices
- Export to CSV for accounting

**Metrics to Track:**
- Click-through rate (CTR) per buyer
- Estimated revenue (clicks × avg. CPA)
- Top-performing devices
- Buyer trust score impact on clicks

### Long-Term Goals (Month 4-6)

#### Goal 1: Expand to 10+ Buyers
**Target Coverage:**
- At least 3 offers per device
- Geographic coverage (US, UK, Canada if applicable)
- Mix of large (Gazelle) and small (local shops)

#### Goal 2: Advanced Features
**Buyer Comparison Matrix:**
- Payment speed
- Customer reviews
- BBB rating
- Accepted payment methods
- Shipping options (free label, printable, etc.)

**Device Trade-Up Calculator:**
- "Sell iPhone 14, upgrade to iPhone 16"
- Show net cost after trade-in
- Affiliate links to retailers

**Bulk Selling:**
- `/business` page for companies selling 10+ devices
- Direct buyer contact for quotes
- Higher CPA for bulk deals

#### Goal 3: API for Third Parties
**White-Label API:**
- Let other sites embed Revend's pricing widget
- Charge per API call or rev-share
- Example: Tech blogs, repair shops, carriers

---

## 7. Appendix: API Examples & Resources

### Example Buyer API Contracts

#### Example 1: RESTful JSON API

**Endpoint:** `GET /api/v1/devices/{device_id}/price`

**Request:**
```bash
curl -X GET 'https://api.buyercompany.com/v1/devices/apple-iphone-15-pro-256gb/price?condition=good' \
  -H 'Authorization: Bearer abc123xyz'
```

**Response:**
```json
{
  "device": {
    "id": "apple-iphone-15-pro-256gb",
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "storage": "256GB",
    "carrier": "unlocked"
  },
  "condition": "good",
  "pricing": {
    "offer_usd": 650.00,
    "currency": "USD",
    "valid_until": "2026-03-12T23:59:59Z"
  },
  "affiliate": {
    "tracking_url": "https://buyercompany.com/sell?ref=REVEND&device=apple-iphone-15-pro-256gb&utm_source=revend",
    "commission_rate": 0.05
  }
}
```

#### Example 2: Bulk Pricing API

**Endpoint:** `POST /api/v1/pricing/bulk`

**Request:**
```json
{
  "devices": [
    { "brand": "Apple", "model": "iPhone 15 Pro", "storage_gb": 256, "condition": "good" },
    { "brand": "Samsung", "model": "Galaxy S24 Ultra", "storage_gb": 512, "condition": "fair" }
  ],
  "partner_id": "revend"
}
```

**Response:**
```json
{
  "prices": [
    {
      "device": { "brand": "Apple", "model": "iPhone 15 Pro", "storage_gb": 256 },
      "condition": "good",
      "offer_usd": 650.00,
      "tracking_url": "https://buyercompany.com/sell?ref=revend&device=iphone-15-pro"
    },
    {
      "device": { "brand": "Samsung", "model": "Galaxy S24 Ultra", "storage_gb": 512 },
      "condition": "fair",
      "offer_usd": 480.00,
      "tracking_url": "https://buyercompany.com/sell?ref=revend&device=galaxy-s24-ultra"
    }
  ],
  "fetched_at": "2026-03-05T10:30:00Z"
}
```

### Example CSV Feed Format

**File:** `buyer-prices-2026-03-05.csv`

```csv
device_id,brand,model,storage_gb,carrier,condition,price_usd,updated_at,expires_at
iphone-15-pro-256,Apple,iPhone 15 Pro,256,unlocked,like-new,720.00,2026-03-05T08:00:00Z,2026-03-12T08:00:00Z
iphone-15-pro-256,Apple,iPhone 15 Pro,256,unlocked,good,650.00,2026-03-05T08:00:00Z,2026-03-12T08:00:00Z
iphone-15-pro-256,Apple,iPhone 15 Pro,256,unlocked,fair,520.00,2026-03-05T08:00:00Z,2026-03-12T08:00:00Z
galaxy-s24-ultra-512,Samsung,Galaxy S24 Ultra,512,unlocked,good,580.00,2026-03-05T08:00:00Z,2026-03-12T08:00:00Z
```

**FTP Access:**
- Host: `ftp.buyercompany.com`
- Username: `revend`
- Password: `[provided separately]`
- Path: `/exports/pricing/daily/`
- Filename pattern: `prices-YYYY-MM-DD.csv`
- Update frequency: Daily at 8:00 AM UTC

### Device Image APIs

#### MobileAPI.dev Example

**Endpoint:** `GET /api/v1/devices/{slug}`

**Request:**
```bash
curl 'https://mobileapi.dev/api/v1/devices/apple-iphone-15-pro' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

**Response:**
```json
{
  "brand": "Apple",
  "model": "iPhone 15 Pro",
  "slug": "apple-iphone-15-pro",
  "release_date": "2023-09-22",
  "specifications": {
    "display": "6.1 inches, OLED",
    "storage": [128, 256, 512, 1024],
    "colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    "msrp": 999
  },
  "images": {
    "main": "https://cdn.mobileapi.dev/devices/apple-iphone-15-pro/main.png",
    "front": "https://cdn.mobileapi.dev/devices/apple-iphone-15-pro/front.png",
    "back": "https://cdn.mobileapi.dev/devices/apple-iphone-15-pro/back.png",
    "colors": {
      "natural-titanium": "https://cdn.mobileapi.dev/devices/apple-iphone-15-pro/natural-titanium.png",
      "blue-titanium": "https://cdn.mobileapi.dev/devices/apple-iphone-15-pro/blue-titanium.png"
    }
  }
}
```

**Pricing:** Free tier (100 requests/day), Pro ($29/month for 10,000 requests/day)

### Industry Resources

**Research & Trends:**
- [SellCell](https://www.sellcell.com/) - Market leader, study their UX
- [Compare and Recycle](https://www.compareandrecycle.co.uk/) - UK competitor
- [Gazelle](https://www.gazelle.com/) - Major buyer with good API docs

**Technical Standards:**
- [TM Forum TMF620 Product Catalog API](https://www.tmforum.org/resources/specification/tmf620-product-catalog-management-api-rest-specification-r17-5-0/) - Industry standard for product catalogs
- [Orisha Commerce Recommerce API Guide](https://commerce.orisha.com/blog/api-recommerce-technical-guide/) - Technical guide for buyback/resale APIs

**Device Data:**
- [MobileAPI.dev](https://mobileapi.dev/) - Best device specs API
- [TechSpecs API](https://developer.techspecs.io/) - Comprehensive electronics database
- [OpenSTF Device Database](https://github.com/openstf/stf-device-db) - Free, open-source device DB

**Business Models:**
- [PartnerStack](https://partnerstack.com/) - B2B affiliate program management
- [Impact.com](https://impact.com/) - Enterprise affiliate tracking platform

---

## Quick Start Checklist

For Revend specifically, here's what to do **this week**:

### Day 1: Partnership Setup
- [ ] Finalize BuyBackTree agreement with Ryan
- [ ] Get API credentials or pricing feed access
- [ ] Collect brand assets (logo, tagline)
- [ ] Define affiliate tracking parameter

### Day 2-3: Technical Integration
- [ ] Create `/lib/adapters/buyback-tree.ts`
- [ ] Test API/feed with 5 sample devices
- [ ] Map BuyBackTree devices to Revend catalog
- [ ] Build sync script

### Day 4: Seed Device Catalog
- [ ] Add top 20 most-traded devices to DB
- [ ] Source images from Apple/Samsung sites
- [ ] Create variants (storage, carrier)
- [ ] Verify image URLs work

### Day 5: Test & Deploy
- [ ] Run sync script manually
- [ ] Verify prices show on frontend
- [ ] Test click tracking (`/go/` redirect)
- [ ] Deploy to production
- [ ] Set up automated sync (cron job)

### Day 6-7: Monitor & Optimize
- [ ] Check for sync errors
- [ ] Validate prices match BuyBackTree site
- [ ] Monitor click-through rates
- [ ] Begin outreach to next 2 buyers

---

## Sources

This guide was compiled from the following research:

**Business Model & Partnerships:**
- [SellCell - How It Works](https://www.sellcell.com/)
- [SellCell About Page](https://www.sellcell.com/about/)
- [B2B Affiliate Programs 2026](https://olavivo.com/b2b-affiliate-programs/)

**Technical Integration:**
- [GlobalCare Buyback Platform](https://sbeglobalcare.com/buy-back/)
- [Wireless Distribution Trade-In Software](https://wirelessdistribution.co.uk/website-development.php)
- [Phonecheck Buyback AI](https://www.phonecheck.com/partners/buyback-ai)
- [Orisha Commerce API Recommerce Guide](https://commerce.orisha.com/blog/api-recommerce-technical-guide/)
- [Reusely Data Feed](https://help.reusely.com/en/articles/9242527-data-feed)

**Device APIs & Images:**
- [MobileAPI.dev](https://mobileapi.dev/)
- [TechSpecs API](https://developer.techspecs.io/)
- [Apify Mobile Phone Specs](https://apify.com/making-data-meaningful/mobile-phone-specs-database)
- [OpenSTF Device Database](https://github.com/openstf/stf-device-db)
- [Unsplash Image API](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)

**Product Catalog Management:**
- [TM Forum TMF620 Spec](https://www.tmforum.org/resources/specification/tmf620-product-catalog-management-api-rest-specification-r17-5-0/)
- [Back4App Cell Phone Database](https://www.back4app.com/database/paul-datasets/cell-phone-dataset)

**Trade-In Platforms:**
- [GlobalCare Buyback Management](https://sbeglobalcare.com/buy-back/)
- [Apkudo Trade-In Solutions](https://www.apkudo.com/trade-in)
- [Reconext Trade-In Services](https://www.reconext.com/lifecycle-services/trade-in-buy-back/)
- [Trade-in Group Partner Program](https://tradein-group.com/partner/)

**Apple GSX:**
- [Apple GSX Integration - MyGadgetRepairs](https://www.mygadgetrepairs.com/gsx-integration/)
- [iGSX Software](https://igsx.software/)
- [Fixably GSX Integration](https://www.fixably.com//features/gsx-integration)

---

**Last Updated:** March 5, 2026
**Maintained By:** Revend Team
**Questions?** Contact nick@revend.com or ryan@buybacktree.com
