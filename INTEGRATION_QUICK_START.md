# Buyer Integration Quick Start

**TL;DR - What You Need to Do This Week**

---

## The 5-Minute Summary

### How SellCell Makes Money
1. Users search for their device
2. SellCell shows prices from 40+ buyers side-by-side
3. User clicks "Sell Now" on best offer
4. SellCell gets 4-6% commission when sale completes
5. **No inventory, no customer support, no logistics** - just comparison & referral

### Your 3 Integration Options

| Option | Best For | Timeline | Cost |
|--------|----------|----------|------|
| **API** | Large buyers with dev teams | 1-2 weeks | Free |
| **CSV Feed** | Medium buyers (daily/weekly updates) | 3-5 days | Free |
| **Manual/Portal** | Small buyers or temporary solution | 1 day | Free |

---

## Week 1 Action Plan

### Monday: Lock Down BuyBackTree Deal
- [ ] **Call Ryan** - Get verbal yes on partnership
- [ ] **Negotiate:** 4-6% CPA (you keep 4-6% of each sale)
- [ ] **Ask for:** API docs OR daily CSV price feed
- [ ] **Get:** Logo, tagline, website URL, affiliate tracking param
- [ ] **Sign:** Simple 1-page agreement (template in full guide)

### Tuesday-Wednesday: Build Integration
- [ ] **If Ryan has API:**
  - Request API key
  - Build `/lib/adapters/buyback-tree.ts` adapter
  - Test with 10 devices

- [ ] **If Ryan has CSV feed:**
  - Get FTP/URL access
  - Build CSV import script
  - Schedule daily sync

- [ ] **If Ryan has neither (manual):**
  - Ask Ryan to fill out Google Sheet template weekly
  - Build Google Sheets → Database sync

### Thursday: Add Devices
- [ ] **Seed top 20 devices manually:**
  - iPhone 15 Pro (all storage options)
  - iPhone 14 Pro (all storage)
  - Samsung Galaxy S24 Ultra
  - Samsung Galaxy S23
  - Google Pixel 9 Pro
  - iPad Air M2
  - MacBook Air M2

- [ ] **Source images:**
  - Download from Apple.com, Samsung.com
  - Store in `/public/images/devices/`
  - Update `device_families.image_url`

### Friday: Test & Deploy
- [ ] **Manual test:**
  1. Search "iPhone 15 Pro" on Revend
  2. Verify BuyBackTree price shows
  3. Click "Sell Now"
  4. Confirm redirect to BuyBackTree with `?ref=revend`
  5. Check `affiliate_clicks` table for logged click

- [ ] **Deploy:**
  - Push to production
  - Set up Vercel Cron to sync prices every 6 hours
  - Monitor for errors

---

## Next 30 Days: Scale to 5+ Buyers

### Week 2-3: Add More Buyers

**Target these 5 next:**

1. **Gazelle** - Large, established, likely has API
2. **Decluttr** - Good reputation, clean site
3. **ItsWorthMore** - High trust score
4. **uSell** - Aggregator (may have API)
5. **[Local/Regional Buyer]** - Higher margins, less competition

**For each buyer:**
- Send outreach email (template in full guide)
- Schedule 15-min intro call
- Negotiate 4-6% CPA
- Integrate same way as BuyBackTree

### Week 4: Automate Everything

- [ ] **Price syncing:** Hourly automated updates via cron
- [ ] **New device alerts:** Subscribe to MobileAPI.dev ($29/month)
- [ ] **Error monitoring:** Slack alerts when sync fails
- [ ] **Analytics dashboard:** Track clicks, revenue per buyer

---

## Image Sourcing: 3 Options

### Option 1: Manual (Free, Immediate)
- Go to Apple.com, Samsung.com, etc.
- Right-click → Save product images
- Store in `/public/images/devices/[brand]/[model]/`
- **Time:** 5 min per device
- **Coverage:** 50 devices = 4 hours of work

### Option 2: MobileAPI.dev (Recommended)
- **Cost:** $29/month
- **Coverage:** 15,000+ devices with 5-10 images each
- **Integration:** REST API, easy to sync
- **Time:** 1 hour setup, then automated
- **URL:** https://mobileapi.dev

### Option 3: Free Stock APIs (Fallback)
- Unsplash API or Pexels API
- Search for "iPhone 15 Pro" generic photos
- **Limitation:** Not device-specific (wrong colors, angles)
- Use only when real images unavailable

---

## Catalog Management: 3 Approaches

### Phase 1: Manual (0-100 devices)
- **Process:** You manually add new devices when they launch
- **Time:** 30 min per device (including variants)
- **Tools:** Google Sheets template → CSV import script
- **Good for:** Launch phase (first 2 months)

### Phase 2: API-Assisted (100-500 devices)
- **Process:** Weekly sync from MobileAPI.dev
- **Time:** 10 min/week to review new devices
- **Cost:** $29-99/month depending on API plan
- **Good for:** Growth phase (months 3-6)

### Phase 3: Fully Automated (500+ devices)
- **Process:** Nightly sync, auto-publish new devices
- **Time:** 0 (just monitor for errors)
- **Cost:** $99/month for comprehensive API
- **Good for:** Scale phase (6+ months)

---

## Common Questions

### Q: What if buyer doesn't have an API?
**A:** Three options:
1. **CSV Feed:** Ask them to email you a CSV weekly (template provided)
2. **Google Sheets:** Give them a shared sheet to update prices
3. **Partner Portal:** Build them a simple login where they update prices manually

### Q: How do I match buyer's device names to my catalog?
**A:** Fuzzy matching script:
```typescript
// "iPhone 15 Pro Max 256GB" → find device_id
function findDeviceId(buyerDeviceName: string) {
  // 1. Extract brand (Apple, Samsung, etc.)
  // 2. Extract model (iPhone 15 Pro Max)
  // 3. Extract storage (256GB)
  // 4. Query database for match
  // 5. If no match, log warning for manual review
}
```

### Q: How often should I update prices?
**A:** Depends on buyer:
- **Large buyers (Gazelle, etc.):** Every 1-6 hours
- **Medium buyers:** Daily
- **Small buyers:** Weekly
- **Critical:** Always within 24 hours of major device launches

### Q: What's a realistic timeline to 10 buyers?
**A:**
- Week 1: BuyBackTree (Ryan) ✓
- Week 2-3: Add 2 more buyers (API-enabled)
- Week 4-5: Add 2 more buyers (CSV/manual)
- Month 2: Add 3-5 more buyers
- **Total:** 8-10 buyers within 60 days

### Q: How much can I make?
**A:** Back-of-napkin math:
- 1,000 clicks/month × 10% conversion = 100 sales
- Avg device value: $400
- Your commission: 5%
- **Revenue:** 100 × $400 × 0.05 = **$2,000/month**
- Scale to 10,000 clicks = **$20,000/month**

---

## The Absolute Minimum to Launch

If you only do these 5 things, you can go live:

1. **Sign BuyBackTree deal** (1 day)
2. **Add 10 popular devices** (iPhone 15/14, Galaxy S24/S23, Pixel 9) (2 hours)
3. **Get BuyBackTree's prices** (API, CSV, or manual) (1 day)
4. **Test end-to-end** (search → click → redirect) (30 min)
5. **Deploy & monitor** (1 hour)

**Total Time:** 2-3 days to working MVP with real prices

---

## Tools You'll Need

### APIs & Services
- **MobileAPI.dev** ($29/month) - Device images & specs
- **Vercel Cron** (free) - Scheduled price syncs
- **Sentry** (free tier) - Error tracking
- **Slack Webhooks** (free) - Sync failure alerts

### Development
- **Postman** - Test buyer APIs
- **Papa Parse** (npm) - CSV parsing
- **Sharp** (npm) - Image optimization
- **Google Sheets API** - Temporary data entry

### Analytics
- **PostHog** (already in Revend) - Click tracking
- **Supabase Dashboard** - Database queries
- **Google Sheets** - Revenue reporting

---

## Red Flags to Watch For

### Buyer Partnership
- ❌ Buyer wants upfront payment (should be commission-only)
- ❌ Buyer won't sign agreement (need written contract)
- ❌ BBB rating below B- (trust issue)
- ❌ No way to track conversions (you can't verify revenue)

### Technical Integration
- ❌ API has no documentation (will be painful)
- ❌ Prices never update (stale data = bad UX)
- ❌ Device names don't match (hard to map)
- ❌ No test environment (risk of production bugs)

### Business Model
- ❌ Buyer's prices are always lowest (they may game the system)
- ❌ Conversion rate <2% (bad fit for your audience)
- ❌ Payment delays >90 days (cash flow issues)

---

## Success Metrics

Track these weekly:

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| **Active Buyers** | 3-5 | 8-10 |
| **Devices Covered** | 50 | 200 |
| **Clicks/Month** | 500 | 5,000 |
| **Click-Through Rate** | 15%+ | 20%+ |
| **Coverage** | 80% of searches have 3+ offers | 95% have 5+ offers |

---

## Resources

**Full Guide:** `BUYER_INTEGRATION_GUIDE.md` (this repo)

**Key Links:**
- MobileAPI.dev: https://mobileapi.dev
- TechSpecs API: https://developer.techspecs.io
- SellCell (study their UX): https://www.sellcell.com
- OpenSTF Device DB: https://github.com/openstf/stf-device-db

**Contact:**
- Questions? Email nick@revend.com
- BuyBackTree: ryan@buybacktree.com

---

**Last Updated:** March 5, 2026
