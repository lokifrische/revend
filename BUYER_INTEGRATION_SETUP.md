# Buyer Integration Setup Guide

Complete implementation of automated buyer pricing integrations is now ready. This guide walks you through deploying and using the system.

---

## 🎯 What Was Built

### Core Features

1. **CSV Import System**
   - CLI script for batch imports
   - Admin web UI for uploads
   - Flexible column mapping
   - Device name fuzzy matching
   - Progress tracking and error logging

2. **Automated Sync**
   - Vercel Cron job (runs every 6 hours)
   - Sync service for all active buyers
   - Price history tracking
   - Slack alerts for failures

3. **Admin Dashboard**
   - Upload CSV files via drag-and-drop
   - View import history with stats
   - Manual sync trigger
   - Real-time status updates

4. **Device Catalog Tools**
   - Top 50 device seeding script
   - Image fetcher (MobileAPI.dev + manual)
   - Automated device matching

---

## 📋 Prerequisites

- Supabase project (already set up)
- Vercel account for deployment
- Node.js 20+ installed locally
- (Optional) MobileAPI.dev account ($29/mo for images)

---

## 🚀 Week 1: Quick Start Setup

### Day 1: Database Setup

#### 1. Run SQL Schema

```bash
# Copy the SQL file
cat scripts/setup-buyer-integrations.sql
```

Open Supabase Dashboard → SQL Editor → Paste the contents of `setup-buyer-integrations.sql` → Run

**This creates:**
- `import_logs` table
- `buyer_integrations` table
- `price_history` table
- Adds `image_url` columns
- Creates storage bucket for CSV uploads

**Verify:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('import_logs', 'buyer_integrations', 'price_history');

-- Should return 3 rows
```

#### 2. Install Dependencies

```bash
npm install
```

**New dependencies added:**
- `csv-parse` - CSV parsing
- `tsx` - TypeScript script execution

---

### Day 2: Seed Device Catalog

#### 1. Seed Top 50 Devices

```bash
# Dry run first (see what would be created)
npx tsx scripts/seed-top-devices.ts --dry-run

# Live run (actually insert devices)
npx tsx scripts/seed-top-devices.ts
```

**This creates:**
- 50 device families (iPhone, Samsung, Pixel, iPad, MacBook, etc.)
- 200+ device variants (storage × carrier combinations)

#### 2. Fetch Device Images

**Option A: Manual (Free)**

Uses pre-mapped URLs from Apple/Samsung sites:

```bash
npx tsx scripts/fetch-device-images.ts --source=manual --limit=10
```

**Option B: MobileAPI.dev ($29/mo - Recommended)**

Sign up: https://mobileapi.dev/pricing

Add to `.env.local`:
```bash
MOBILE_API_KEY=your_key_here
```

Fetch all images:
```bash
npx tsx scripts/fetch-device-images.ts --source=mobile-api
```

---

### Day 3: Test CSV Import

#### 1. Prepare Test CSV

Sample CSV already provided: `data/sample-buyer-pricing.csv`

Contains 45 sample offers across phones, tablets, laptops, and watches.

#### 2. Get Buyer ID

```sql
SELECT id, slug, name FROM buyers WHERE slug = 'buybacktree';
```

Copy the `id` value (UUID).

#### 3. Run Import (CLI)

```bash
# Dry run
npx tsx scripts/import-buyer-csv.ts buybacktree ./data/sample-buyer-pricing.csv --dry-run

# Live import
npx tsx scripts/import-buyer-csv.ts buybacktree ./data/sample-buyer-pricing.csv
```

**Expected output:**
```
🚀 Revend Buyer CSV Import
================================================================================
Buyer: buybacktree
File: ./data/sample-buyer-pricing.csv
Mode: ✅ LIVE IMPORT
================================================================================

✅ Found buyer: BuyBackTree (123e4567-e89b-12d3-a456-426614174000)

📝 Creating import log...
✅ Import log created: abc123...

📂 Reading CSV file...
✅ Found 45 rows in CSV

⚙️  Processing rows...

  ✅ Row 1: iPhone 15 Pro 256GB Unlocked - Excellent: $850.00
  ✅ Row 2: iPhone 15 Pro 256GB Unlocked - Good: $780.00
  ...

================================================================================
📊 Import Summary
================================================================================
Total rows: 45
✅ Processed: 45
❌ Failed: 0
================================================================================
```

#### 4. Verify Offers in Database

```sql
SELECT
  df.name as device,
  d.storage_gb,
  c.name as condition,
  o.offer_cents / 100 as price_usd,
  o.last_updated_at
FROM offers o
JOIN devices d ON o.device_id = d.id
JOIN device_families df ON d.family_id = df.id
JOIN conditions c ON o.condition_id = c.id
JOIN buyers b ON o.buyer_id = b.id
WHERE b.slug = 'buybacktree'
ORDER BY o.last_updated_at DESC
LIMIT 10;
```

---

### Day 4: Admin UI Setup

#### 1. Add CRON_SECRET to Environment

```bash
# Generate random secret
openssl rand -base64 32

# Add to .env.local
echo "CRON_SECRET=<your_secret_here>" >> .env.local
```

#### 2. Start Dev Server

```bash
npm run dev
```

#### 3. Access Admin UI

Navigate to: http://localhost:3000/admin/imports

**Enter credentials:**
- Username: `admin` (any value works)
- Password: Value of `ADMIN_PASSWORD` env var (default: `revend-admin-2026`)

#### 4. Test CSV Upload

1. Select "BuyBackTree" from dropdown
2. Click "Upload CSV"
3. Choose `data/sample-buyer-pricing.csv`
4. View results in import history table

---

### Day 5: Configure Automated Sync

#### 1. Create Buyer Integration Config

For manual CSV uploads (current state):

```sql
INSERT INTO buyer_integrations (buyer_id, integration_type, is_active, sync_enabled, config)
VALUES (
  (SELECT id FROM buyers WHERE slug = 'buybacktree'),
  'csv_upload',
  true,
  false, -- No auto-sync yet
  '{}'::jsonb
);
```

For automated CSV URL sync (once buyer provides URL):

```sql
UPDATE buyer_integrations
SET
  integration_type = 'csv_url',
  sync_enabled = true,
  sync_frequency_minutes = 360, -- 6 hours
  config = jsonb_build_object(
    'type', 'csv_url',
    'csv', jsonb_build_object(
      'url', 'https://partner.buybacktree.com/feeds/revend/prices.csv',
      'columnMapping', jsonb_build_object(
        'device_name', 'Device',
        'storage_gb', 'Storage',
        'carrier', 'Carrier',
        'condition', 'Grade',
        'price_usd', 'Price'
      )
    )
  )
WHERE buyer_id = (SELECT id FROM buyers WHERE slug = 'buybacktree');
```

#### 2. Test Manual Sync

```bash
# Call sync endpoint directly (simulates cron)
curl http://localhost:3000/api/cron/sync-buyers \
  -H "Authorization: Bearer $CRON_SECRET"
```

Or use admin UI:
1. Go to http://localhost:3000/admin/imports
2. Click "Sync All Buyers"

---

## 🌐 Production Deployment

### 1. Update Environment Variables in Vercel

Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://msvobzzeteeoddjtxfji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://revend.com
ADMIN_PASSWORD=your_secure_password
CRON_SECRET=your_random_secret
```

Optional (Phase 2):
```bash
MOBILE_API_KEY=your_mobile_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 2. Deploy to Vercel

```bash
vercel --prod
```

**Vercel will automatically:**
- Detect `vercel.json` cron configuration
- Schedule `/api/cron/sync-buyers` to run every 6 hours
- Provide cron execution logs in dashboard

### 3. Verify Cron Job

Go to Vercel Dashboard → Your Project → Cron Jobs

**Should see:**
- Path: `/api/cron/sync-buyers`
- Schedule: `0 */6 * * *` (every 6 hours)
- Status: Active

### 4. Test Production Sync

Trigger manually from Vercel dashboard or:

```bash
curl https://revend.com/api/cron/sync-buyers \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 📊 File Structure Created

```
/revend
├── app/
│   ├── admin/
│   │   └── imports/
│   │       └── page.tsx          ✅ Admin CSV upload UI
│   └── api/
│       ├── admin/
│       │   ├── import-csv/
│       │   │   └── route.ts      ✅ Handle CSV uploads
│       │   └── sync-all-buyers/
│       │       └── route.ts      ✅ Manual sync trigger
│       └── cron/
│           └── sync-buyers/
│               └── route.ts      ✅ Automated cron job
├── lib/
│   └── integrations/
│       ├── types.ts              ✅ TypeScript interfaces
│       ├── sync-service.ts       ✅ Sync orchestration
│       └── adapters/
│           └── base-csv-adapter.ts ✅ CSV adapter pattern
├── scripts/
│   ├── setup-buyer-integrations.sql  ✅ Database schema
│   ├── import-buyer-csv.ts           ✅ CLI import tool
│   ├── fetch-device-images.ts        ✅ Image downloader
│   └── seed-top-devices.ts           ✅ Device catalog seeder
├── data/
│   ├── sample-buyer-pricing.csv      ✅ Example CSV
│   └── README.md                      ✅ CSV format guide
├── vercel.json                        ✅ Cron configuration
└── .env.example                       ✅ Updated with new vars
```

---

## 🔄 Daily Operations

### Adding a New Buyer

**Step 1: Get buyer in database**

```sql
SELECT id, slug FROM buyers WHERE slug = 'newbuyer';
```

**Step 2: Create integration config**

```sql
INSERT INTO buyer_integrations (buyer_id, integration_type, is_active, sync_enabled, config)
VALUES (
  '<buyer_id>',
  'csv_upload', -- or 'csv_url' if they provide URL
  true,
  false,
  '{}'::jsonb
);
```

**Step 3: Get CSV from buyer**

- Ask for sample CSV or access to their pricing feed
- Map their column names to yours

**Step 4: Import prices**

```bash
npx tsx scripts/import-buyer-csv.ts newbuyer ./data/newbuyer_prices.csv
```

### Weekly Price Updates

**Manual upload:**
1. Download CSV from buyer
2. Go to `/admin/imports`
3. Select buyer
4. Upload CSV

**Automated (if CSV URL configured):**
- Runs automatically every 6 hours
- Check logs at `/admin/imports`

### Monitoring

**Check sync status:**

```sql
SELECT
  b.name,
  bi.integration_type,
  bi.last_sync_at,
  bi.sync_enabled,
  COUNT(o.id) as offer_count
FROM buyer_integrations bi
JOIN buyers b ON bi.buyer_id = b.id
LEFT JOIN offers o ON o.buyer_id = b.id AND o.is_active = true
GROUP BY b.name, bi.integration_type, bi.last_sync_at, bi.sync_enabled;
```

**Check import history:**

```sql
SELECT
  b.name,
  il.file_name,
  il.status,
  il.rows_processed,
  il.rows_failed,
  il.started_at,
  il.completed_at
FROM import_logs il
JOIN buyers b ON il.buyer_id = b.id
ORDER BY il.created_at DESC
LIMIT 20;
```

---

## 🔧 Troubleshooting

### Import shows "No device match" errors

**Cause:** Device not in catalog or name mismatch

**Fix:**
```bash
# Check if device exists
echo "SELECT name FROM device_families WHERE name ILIKE '%iPhone 15%';" | psql

# Add device if missing
npx tsx scripts/seed-top-devices.ts
```

### Cron job not running

**Check Vercel dashboard:**
1. Go to Cron Jobs tab
2. Verify schedule is active
3. Check execution logs

**Verify CRON_SECRET:**
```bash
# In Vercel dashboard
echo $CRON_SECRET
```

### CSV upload fails in admin UI

**Check browser console for errors**

**Verify buyer selected:**
- Must select buyer from dropdown before upload

**Check CSV format:**
- Must have required columns: device_name, storage_gb, condition, price_usd

### No offers appearing after import

**Check offers table:**
```sql
SELECT COUNT(*) FROM offers WHERE buyer_id = '<buyer_id>';
```

**If 0, check import logs:**
```sql
SELECT error_message FROM import_logs
WHERE buyer_id = '<buyer_id>'
ORDER BY created_at DESC LIMIT 1;
```

---

## 📈 Next Steps After Week 1

### Week 2: Scale to 5 Buyers

1. Reach out to 4 more buyers
2. Configure buyer_integrations for each
3. Set up automated CSV URL syncs
4. Monitor import_logs for failures

### Week 3: Add More Devices

```bash
# Expand catalog to 200 devices
# Update scripts/seed-top-devices.ts with more devices
npx tsx scripts/seed-top-devices.ts

# Fetch images for new devices
npx tsx scripts/fetch-device-images.ts --source=mobile-api
```

### Month 2: Advanced Features

1. **API Integrations**
   - Build REST API adapters for buyers with APIs
   - Add to `lib/integrations/adapters/`

2. **Analytics Dashboard**
   - Price trend charts
   - Buyer comparison metrics
   - Conversion tracking

3. **Price Drop Alerts**
   - Email notifications when prices change
   - Requires Resend integration

---

## ✅ Success Checklist

After completing Week 1 setup, you should have:

- [x] Database schema deployed to Supabase
- [x] 50 devices seeded with images
- [x] 1 buyer integrated (BuyBackTree)
- [x] 200+ active offers in database
- [x] Admin UI accessible at `/admin/imports`
- [x] CSV import working (CLI + web UI)
- [x] Vercel Cron job configured
- [x] Environment variables set in production

**Revenue Ready:**
- Users can search for devices
- Compare live buyer offers
- Click through to buyer sites
- Clicks tracked in `affiliate_clicks` table

---

## 🆘 Support

**For integration issues:**
- Check `import_logs` table for error messages
- Review `data/README.md` for CSV format
- Test with `sample-buyer-pricing.csv` first

**For deployment issues:**
- Verify all environment variables in Vercel
- Check Supabase RLS policies allow service role
- Ensure cron secret matches in code and Vercel

**For buyer partnerships:**
- See `BUYER_INTEGRATION_GUIDE.md` for outreach templates
- Reference `INTEGRATION_QUICK_START.md` for technical requirements

---

**You're now ready to integrate real buyers and launch! 🚀**

Next: Get your first buyer integrated and start generating revenue.
