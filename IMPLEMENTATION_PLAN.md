# Revend Buyer Integration - Implementation Plan

## Executive Summary

**Goal:** Get live with real buyer pricing data in 2 weeks

**Strategy:** Build in 3 phases, prioritizing speed to market over perfection

**Phase 1 (Week 1):** Manual CSV uploads + 50 top devices → Go live with 1 buyer
**Phase 2 (Week 2-3):** Automated sync + 200 devices → Scale to 5 buyers
**Phase 3 (Month 2):** API integrations + Auto device catalog → Scale to 10+ buyers

---

## Phase 1: Quick Start (Week 1)

**Goal:** Get BuyBackTree integrated and live with real pricing

### What You'll Build

1. **CSV Import Script** - Upload buyer pricing files
2. **Admin Tool** - Web UI to manage imports and view buyer data
3. **Device Catalog** - Top 50 most-traded devices
4. **Product Images** - High-quality photos for all 50 devices

### Timeline: 7 Days

---

### Day 1-2: Database Schema Updates

**Task:** Add buyer integration support to Supabase

#### New Tables

```sql
-- Track CSV imports and sync jobs
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id),
  import_type TEXT NOT NULL, -- 'csv', 'api', 'manual'
  file_name TEXT,
  status TEXT NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
  rows_processed INT DEFAULT 0,
  rows_failed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by TEXT, -- admin email
  metadata JSONB -- store original file URL, API response, etc.
);

-- Track buyer integration config
CREATE TABLE buyer_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) UNIQUE,
  integration_type TEXT NOT NULL, -- 'csv_upload', 'csv_url', 'api', 'manual'
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL, -- API credentials, CSV URL, etc.
  last_sync_at TIMESTAMPTZ,
  sync_frequency_minutes INT DEFAULT 360, -- 6 hours
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track price changes over time (analytics)
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id),
  buyer_id UUID NOT NULL REFERENCES buyers(id),
  condition_id UUID NOT NULL REFERENCES conditions(id),
  offer_cents INT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  import_log_id UUID REFERENCES import_logs(id)
);

CREATE INDEX idx_price_history_device ON price_history(device_id, recorded_at DESC);
CREATE INDEX idx_import_logs_buyer ON import_logs(buyer_id, created_at DESC);
CREATE INDEX idx_buyer_integrations_active ON buyer_integrations(buyer_id) WHERE is_active = true;
```

#### Schema Updates

```sql
-- Add image URLs to device_families and devices
ALTER TABLE device_families ADD COLUMN IF NOT EXISTS
  image_url TEXT; -- Main product image

ALTER TABLE devices ADD COLUMN IF NOT EXISTS
  image_url TEXT; -- Variant-specific image (e.g., color)

-- Add buyer integration metadata
ALTER TABLE buyers ADD COLUMN IF NOT EXISTS
  integration_notes TEXT, -- Internal notes about their API/feed
  contact_email TEXT, -- Partner contact
  tracking_param_format TEXT; -- e.g., "?ref=revend&click_id={clickId}"

-- Add last updated timestamp to offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS
  last_updated_at TIMESTAMPTZ DEFAULT NOW();
```

#### Implementation Files

**Create:** `scripts/setup-buyer-integrations.sql`

```sql
-- Run this in Supabase SQL editor
-- Copy all the CREATE TABLE and ALTER TABLE statements above
```

**Action:** Execute this SQL in Supabase dashboard → SQL Editor

---

### Day 3: CSV Import Script

**Task:** Build CLI tool to import buyer pricing CSVs

#### Expected CSV Format

```csv
device_name,storage_gb,carrier,condition,price_usd,updated_at
iPhone 15 Pro,256,Unlocked,Excellent,850.00,2026-03-05
iPhone 15 Pro,256,Unlocked,Good,780.00,2026-03-05
iPhone 15 Pro,256,Unlocked,Fair,650.00,2026-03-05
iPhone 15,128,Unlocked,Excellent,650.00,2026-03-05
```

**Note:** Each buyer may have different column names. The script will handle mapping.

#### Implementation

**Create:** `scripts/import-buyer-csv.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CSVRow {
  device_name: string
  storage_gb: string | number
  carrier?: string
  condition: string
  price_usd: string | number
  updated_at?: string
}

interface ImportConfig {
  buyerId: string
  buyerSlug: string
  filePath: string
  columnMapping?: {
    device_name?: string
    storage_gb?: string
    carrier?: string
    condition?: string
    price_usd?: string
  }
  dryRun?: boolean
}

async function importBuyerCSV(config: ImportConfig) {
  console.log(`\n🚀 Starting import for buyer: ${config.buyerSlug}`)
  console.log(`📁 File: ${config.filePath}`)
  console.log(`🧪 Dry run: ${config.dryRun ? 'Yes' : 'No'}\n`)

  // Create import log
  const { data: importLog, error: logError } = await supabase
    .from('import_logs')
    .insert({
      buyer_id: config.buyerId,
      import_type: 'csv',
      file_name: path.basename(config.filePath),
      status: 'processing',
      created_by: 'cli',
    })
    .select()
    .single()

  if (logError) {
    console.error('❌ Failed to create import log:', logError)
    return
  }

  try {
    // Read and parse CSV
    const fileContent = fs.readFileSync(config.filePath, 'utf-8')
    const records: CSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`📊 Found ${records.length} rows in CSV\n`)

    let processed = 0
    let failed = 0
    const errors: string[] = []

    // Process each row
    for (const row of records) {
      try {
        // Extract data (handle column mapping)
        const deviceName = row[config.columnMapping?.device_name || 'device_name']
        const storageGb = parseInt(String(row[config.columnMapping?.storage_gb || 'storage_gb']))
        const carrier = row[config.columnMapping?.carrier || 'carrier'] || 'Unlocked'
        const conditionName = row[config.columnMapping?.condition || 'condition']
        const priceUsd = parseFloat(String(row[config.columnMapping?.price_usd || 'price_usd']))

        if (!deviceName || isNaN(storageGb) || !conditionName || isNaN(priceUsd)) {
          throw new Error(`Invalid data: ${JSON.stringify(row)}`)
        }

        // Find matching device in database
        const { data: devices } = await supabase
          .from('devices')
          .select(`
            id,
            storage_gb,
            carrier,
            device_families!inner(name, slug)
          `)
          .ilike('device_families.name', `%${deviceName}%`)
          .eq('storage_gb', storageGb)
          .ilike('carrier', carrier)

        if (!devices || devices.length === 0) {
          console.log(`⚠️  No match: ${deviceName} ${storageGb}GB ${carrier}`)
          failed++
          errors.push(`No device match: ${deviceName} ${storageGb}GB`)
          continue
        }

        const device = devices[0]

        // Find matching condition
        const { data: conditions } = await supabase
          .from('conditions')
          .select('id, slug')
          .ilike('name', conditionName)

        if (!conditions || conditions.length === 0) {
          console.log(`⚠️  No condition match: ${conditionName}`)
          failed++
          errors.push(`No condition match: ${conditionName}`)
          continue
        }

        const condition = conditions[0]

        // Upsert offer
        if (!config.dryRun) {
          const { error: upsertError } = await supabase
            .from('offers')
            .upsert(
              {
                device_id: device.id,
                buyer_id: config.buyerId,
                condition_id: condition.id,
                offer_cents: Math.round(priceUsd * 100),
                last_updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'device_id,buyer_id,condition_id',
              }
            )

          if (upsertError) {
            console.log(`❌ Failed to upsert: ${deviceName}`, upsertError.message)
            failed++
            errors.push(`Upsert failed: ${deviceName} - ${upsertError.message}`)
            continue
          }

          // Log to price_history
          await supabase.from('price_history').insert({
            device_id: device.id,
            buyer_id: config.buyerId,
            condition_id: condition.id,
            offer_cents: Math.round(priceUsd * 100),
            import_log_id: importLog.id,
          })
        }

        processed++
        console.log(`✅ ${deviceName} ${storageGb}GB ${carrier} - ${conditionName}: $${priceUsd}`)
      } catch (err) {
        failed++
        const errorMsg = err instanceof Error ? err.message : String(err)
        errors.push(errorMsg)
        console.log(`❌ Error processing row:`, errorMsg)
      }
    }

    // Update import log
    await supabase
      .from('import_logs')
      .update({
        status: failed > 0 ? 'completed' : 'completed',
        rows_processed: processed,
        rows_failed: failed,
        error_message: errors.length > 0 ? errors.join('\n') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', importLog.id)

    console.log(`\n✅ Import complete!`)
    console.log(`   Processed: ${processed}`)
    console.log(`   Failed: ${failed}`)

    if (config.dryRun) {
      console.log(`\n⚠️  DRY RUN - No data was written to database`)
    }
  } catch (err) {
    console.error('\n❌ Import failed:', err)

    await supabase
      .from('import_logs')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : String(err),
        completed_at: new Date().toISOString(),
      })
      .eq('id', importLog.id)
  }
}

// CLI usage
const buyerId = process.argv[2]
const buyerSlug = process.argv[3]
const filePath = process.argv[4]
const dryRun = process.argv[5] === '--dry-run'

if (!buyerId || !buyerSlug || !filePath) {
  console.log(`
Usage: npx tsx scripts/import-buyer-csv.ts <buyer_id> <buyer_slug> <csv_file> [--dry-run]

Example:
  npx tsx scripts/import-buyer-csv.ts 123e4567-e89b-12d3-a456-426614174000 buybacktree ./data/buybacktree_2026_03_05.csv --dry-run
  `)
  process.exit(1)
}

importBuyerCSV({ buyerId, buyerSlug, filePath, dryRun })
```

**Install dependencies:**

```bash
npm install csv-parse
npm install -D tsx @types/node
```

**Test the script:**

```bash
# Create sample CSV
mkdir -p data
cat > data/test.csv << 'EOF'
device_name,storage_gb,carrier,condition,price_usd
iPhone 15 Pro,256,Unlocked,Excellent,850.00
iPhone 15 Pro,256,Unlocked,Good,780.00
iPhone 15,128,Unlocked,Excellent,650.00
EOF

# Run dry-run
npx tsx scripts/import-buyer-csv.ts <BUYER_ID> buybacktree ./data/test.csv --dry-run

# Run for real
npx tsx scripts/import-buyer-csv.ts <BUYER_ID> buybacktree ./data/test.csv
```

---

### Day 4: Admin Portal - Import UI

**Task:** Build web UI to upload CSVs and view import history

#### Implementation

**Create:** `app/admin/imports/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import Header from '@/components/layout/Header'

interface ImportLog {
  id: string
  buyer_id: string
  buyers: { name: string; slug: string }
  import_type: string
  file_name: string
  status: string
  rows_processed: number
  rows_failed: number
  error_message: string | null
  started_at: string
  completed_at: string | null
}

export default function ImportsPage() {
  const [imports, setImports] = useState<ImportLog[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadImports()
  }, [])

  async function loadImports() {
    const { data } = await supabase
      .from('import_logs')
      .select('*, buyers(name, slug)')
      .order('created_at', { ascending: false })
      .limit(50)

    setImports(data || [])
    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Upload CSV to Supabase Storage
      const fileName = `imports/${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('csv-imports')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('csv-imports')
        .getPublicUrl(fileName)

      console.log('File uploaded:', urlData.publicUrl)

      // Trigger server-side import
      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: urlData.publicUrl,
          fileName: file.name,
          // TODO: Add buyer selection
        }),
      })

      if (!response.ok) throw new Error('Import failed')

      alert('Import started! Refresh to see results.')
      loadImports()
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1C2E' }}>
      <Header alwaysOpaque />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">CSV Imports</h1>

          <label className="cursor-pointer px-6 py-3 bg-[#00C4B4] text-white rounded-lg font-semibold hover:bg-[#00A89A] transition-colors">
            {uploading ? 'Uploading...' : '📤 Upload CSV'}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading imports...</p>
        ) : (
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    File
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Processed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Failed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {imports.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {log.buyers?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {log.file_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : log.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{log.rows_processed}</td>
                    <td className="px-6 py-4 text-red-400">{log.rows_failed}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(log.started_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {imports.length === 0 && !loading && (
          <p className="text-center text-slate-400 py-12">
            No imports yet. Upload your first CSV above.
          </p>
        )}
      </main>
    </div>
  )
}
```

**Create:** `app/api/admin/import-csv/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, fileName, buyerId } = await req.json()

    if (!fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create import log
    const { data: importLog, error } = await supabase
      .from('import_logs')
      .insert({
        buyer_id: buyerId, // TODO: Get from request
        import_type: 'csv',
        file_name: fileName,
        status: 'pending',
        metadata: { file_url: fileUrl },
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Trigger background job to process CSV
    // For now, return success - you'll process manually via CLI

    return NextResponse.json({
      success: true,
      importLogId: importLog.id,
      message: 'Import queued. Process via CLI: npx tsx scripts/import-buyer-csv.ts',
    })
  } catch (err) {
    console.error('Import API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Import failed' },
      { status: 500 }
    )
  }
}
```

**Create Supabase Storage bucket:**

```sql
-- Run in Supabase SQL editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('csv-imports', 'csv-imports', false);
```

---

### Day 5-6: Device Catalog + Images

**Task:** Add top 50 devices with high-quality images

#### Option A: Manual (Free, 1 day of work)

**Download images from manufacturer sites:**

```bash
# iPhone images
curl -o public/images/devices/iphone-15-pro.png https://www.apple.com/v/iphone-15-pro/...

# Samsung images
curl -o public/images/devices/galaxy-s24-ultra.png https://images.samsung.com/...
```

**Create CSV template:**

```csv
family_name,brand,category,base_price_usd,storage_variants,image_url
iPhone 15 Pro,Apple,Phones,999,"128,256,512,1024",/images/devices/iphone-15-pro.png
iPhone 15,Apple,Phones,799,"128,256,512",/images/devices/iphone-15.png
Galaxy S24 Ultra,Samsung,Phones,1299,"256,512,1024",/images/devices/galaxy-s24-ultra.png
```

**Import script:** `scripts/import-devices.ts` (similar to CSV import)

#### Option B: MobileAPI.dev (Recommended, $29/month)

**Sign up:** https://mobileapi.dev/pricing

**Create:** `lib/services/mobile-api.ts`

```typescript
const MOBILE_API_KEY = process.env.MOBILE_API_KEY!

export async function getDeviceDetails(deviceName: string) {
  const response = await fetch(
    `https://api.mobileapi.dev/v1/devices/search?q=${encodeURIComponent(deviceName)}`,
    {
      headers: {
        'Authorization': `Bearer ${MOBILE_API_KEY}`,
      },
    }
  )

  const data = await response.json()
  return {
    name: data.name,
    brand: data.brand,
    images: data.images, // Array of high-res URLs
    specs: {
      storage: data.storage_options,
      colors: data.colors,
      dimensions: data.dimensions,
    },
  }
}

export async function downloadDeviceImage(imageUrl: string, localPath: string) {
  const response = await fetch(imageUrl)
  const buffer = await response.arrayBuffer()
  const fs = require('fs')
  fs.writeFileSync(localPath, Buffer.from(buffer))
}
```

**Batch import script:** `scripts/fetch-device-images.ts`

```typescript
import { getDeviceDetails, downloadDeviceImage } from '@/lib/services/mobile-api'

const TOP_DEVICES = [
  'iPhone 15 Pro',
  'iPhone 15',
  'iPhone 14 Pro',
  'iPhone 14',
  'Samsung Galaxy S24 Ultra',
  'Samsung Galaxy S24',
  'Samsung Galaxy S23',
  'Google Pixel 9 Pro',
  'Google Pixel 8',
  // ... add 40 more
]

async function fetchImages() {
  for (const deviceName of TOP_DEVICES) {
    console.log(`Fetching ${deviceName}...`)

    const details = await getDeviceDetails(deviceName)

    if (details.images && details.images.length > 0) {
      const mainImage = details.images[0]
      const fileName = deviceName.toLowerCase().replace(/\s+/g, '-')
      const localPath = `public/images/devices/${fileName}.png`

      await downloadDeviceImage(mainImage, localPath)
      console.log(`✅ Saved: ${localPath}`)

      // Update database
      await supabase
        .from('device_families')
        .update({ image_url: `/images/devices/${fileName}.png` })
        .ilike('name', deviceName)
    }

    // Rate limit: 1 request/second
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

fetchImages()
```

**Run:**

```bash
npx tsx scripts/fetch-device-images.ts
```

#### Top 50 Devices to Add (Priority Order)

```
Phones (40):
1. iPhone 15 Pro Max
2. iPhone 15 Pro
3. iPhone 15 Plus
4. iPhone 15
5. iPhone 14 Pro Max
6. iPhone 14 Pro
7. iPhone 14 Plus
8. iPhone 14
9. iPhone 13 Pro Max
10. iPhone 13 Pro
11. iPhone 13
12. iPhone 13 Mini
13. iPhone 12 Pro Max
14. iPhone 12 Pro
15. iPhone 12
16. iPhone SE (3rd gen)
17. Samsung Galaxy S24 Ultra
18. Samsung Galaxy S24+
19. Samsung Galaxy S24
20. Samsung Galaxy S23 Ultra
21. Samsung Galaxy S23+
22. Samsung Galaxy S23
23. Samsung Galaxy Z Fold 5
24. Samsung Galaxy Z Flip 5
25. Google Pixel 9 Pro XL
26. Google Pixel 9 Pro
27. Google Pixel 9
28. Google Pixel 8 Pro
29. Google Pixel 8
30. Google Pixel 7 Pro
31. OnePlus 12
32. OnePlus 11
33. Motorola Razr+
34. Nothing Phone 2

Tablets (6):
35. iPad Pro 12.9" (6th gen)
36. iPad Pro 11" (4th gen)
37. iPad Air (5th gen)
38. iPad (10th gen)
39. Samsung Galaxy Tab S9 Ultra
40. Samsung Galaxy Tab S9

Watches (4):
41. Apple Watch Series 9
42. Apple Watch Ultra 2
43. Apple Watch SE (2nd gen)
44. Samsung Galaxy Watch 6

Laptops (6):
45. MacBook Air M2
46. MacBook Pro 14" M3
47. MacBook Pro 16" M3
48. Microsoft Surface Laptop 5
49. Dell XPS 13
50. HP Spectre x360
```

---

### Day 7: Test End-to-End

**Checklist:**

1. ✅ Run database schema updates
2. ✅ Add 50 devices with images to `device_families` table
3. ✅ Create device variants (storage/carrier) in `devices` table
4. ✅ Get sample CSV from BuyBackTree
5. ✅ Run `import-buyer-csv.ts` script (dry-run first)
6. ✅ Verify offers appear in database
7. ✅ Test on staging: Search "iPhone 15 Pro" → See BuyBackTree prices
8. ✅ Test click tracking: Click "Sell Now" → Verify redirect
9. ✅ Check admin dashboard: See import log at `/admin/imports`
10. ✅ Deploy to production

**Success Criteria:**

- BuyBackTree pricing data live on production
- Users can compare offers and click through
- Clicks logged to `affiliate_clicks` table
- Import history visible in admin dashboard

---

## Phase 2: Scale (Week 2-3)

**Goal:** Add 4 more buyers + 200 devices + automated sync

### Week 2: Automated CSV Sync

**Task:** Build scheduled job to fetch CSV feeds automatically

#### For Buyers with Public CSV URLs

Some buyers provide a public URL that always has the latest prices:

```
https://partner.buybacktree.com/feeds/revend/prices.csv
```

**Create:** `lib/integrations/csv-sync.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function syncBuyerCSV(buyerId: string) {
  // Get buyer integration config
  const { data: integration } = await supabase
    .from('buyer_integrations')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('is_active', true)
    .single()

  if (!integration) {
    throw new Error('No active integration found')
  }

  const csvUrl = integration.config.csv_url
  if (!csvUrl) {
    throw new Error('No CSV URL configured')
  }

  console.log(`Fetching CSV from: ${csvUrl}`)

  // Download CSV
  const response = await fetch(csvUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`)
  }

  const csvContent = await response.text()

  // Save to temporary file
  const fs = require('fs')
  const tempFile = `/tmp/${buyerId}_${Date.now()}.csv`
  fs.writeFileSync(tempFile, csvContent)

  // Import using existing script logic
  // (extract import logic from import-buyer-csv.ts into reusable function)

  // Update last_sync_at
  await supabase
    .from('buyer_integrations')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', integration.id)

  console.log(`✅ Sync complete for buyer ${buyerId}`)
}
```

**Create:** `app/api/cron/sync-buyers/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { syncBuyerCSV } from '@/lib/integrations/csv-sync'

export async function GET(req: Request) {
  // Verify cron secret (prevents unauthorized calls)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Get all active CSV integrations
  const { data: integrations } = await supabase
    .from('buyer_integrations')
    .select('buyer_id, buyers(name, slug)')
    .eq('is_active', true)
    .in('integration_type', ['csv_url'])

  const results = []

  for (const integration of integrations || []) {
    try {
      await syncBuyerCSV(integration.buyer_id)
      results.push({ buyer: integration.buyers.name, status: 'success' })
    } catch (err) {
      console.error(`Failed to sync ${integration.buyers.name}:`, err)
      results.push({
        buyer: integration.buyers.name,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({ results })
}
```

**Create:** `vercel.json` (configure cron job)

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-buyers",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**This runs every 6 hours automatically on Vercel.**

**Set environment variable:**

```bash
# In Vercel dashboard
CRON_SECRET=your_random_secret_here_abc123
```

**Test locally:**

```bash
curl http://localhost:3000/api/cron/sync-buyers \
  -H "Authorization: Bearer your_random_secret_here_abc123"
```

---

### Week 3: Expand Device Catalog to 200

**Task:** Add 150 more devices using MobileAPI.dev

**Run:**

```bash
# Expand TOP_DEVICES list to 200
# Run batch import script
npx tsx scripts/fetch-device-images.ts
```

**Categories to add:**

- Laptops (30 more)
- Tablets (20 more)
- Smartwatches (20 more)
- Gaming consoles (10: PS5, Xbox, Switch)
- Headphones (10: AirPods, Sony, Bose)
- Cameras (10: Canon, Sony, Nikon)

---

## Phase 3: Optimize (Month 2)

**Goal:** API integrations + auto device catalog + analytics

### API Integration (Buyers with REST APIs)

**Create:** `lib/adapters/buyback-tree-api.ts`

```typescript
interface BuyBackTreeAPIResponse {
  device_id: string
  prices: {
    excellent: number
    good: number
    fair: number
  }
}

export class BuyBackTreeAdapter {
  private apiKey: string
  private baseUrl = 'https://api.buybacktree.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async fetchPrices(deviceSlug: string): Promise<StandardizedOffer[]> {
    const response = await fetch(
      `${this.baseUrl}/prices?device=${deviceSlug}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data: BuyBackTreeAPIResponse = await response.json()

    return [
      {
        deviceSlug,
        condition: 'excellent',
        offerCents: data.prices.excellent * 100,
        buyerSlug: 'buybacktree',
      },
      {
        deviceSlug,
        condition: 'good',
        offerCents: data.prices.good * 100,
        buyerSlug: 'buybacktree',
      },
      {
        deviceSlug,
        condition: 'fair',
        offerCents: data.prices.fair * 100,
        buyerSlug: 'buybacktree',
      },
    ]
  }
}
```

**Update cron job to support API adapters:**

```typescript
// In /api/cron/sync-buyers/route.ts

if (integration.integration_type === 'api') {
  const adapter = new BuyBackTreeAdapter(integration.config.api_key)
  // Fetch for all devices in catalog
  // ...
}
```

---

### Auto Device Catalog

**Subscribe to manufacturer release feeds:**

- Apple RSS: https://www.apple.com/newsroom/rss-feed.rss
- Samsung Newsroom API
- Google Pixel announcements

**Create:** `scripts/sync-new-devices.ts`

```typescript
// Parse RSS feeds
// Detect new product announcements
// Fetch specs from MobileAPI.dev
// Auto-create device_family entry
// Send Slack notification for manual approval
```

---

## Technology Stack Summary

### Services You'll Use

| Service | Purpose | Cost | Phase |
|---------|---------|------|-------|
| **Supabase** | Database + Storage | $25/mo (Pro tier) | Phase 1 |
| **Vercel** | Hosting + Cron Jobs | $20/mo (Pro tier) | Phase 1 |
| **MobileAPI.dev** | Device images + specs | $29/mo | Phase 2 |
| **Sentry** | Error monitoring | Free tier | Phase 2 |
| **Slack** | Sync alerts | Free | Phase 2 |

**Total Monthly Cost:** ~$75/month

### File Structure

```
/revend
├── app/
│   ├── admin/
│   │   ├── imports/page.tsx          (CSV upload UI)
│   │   └── buyers/page.tsx           (Manage buyer integrations)
│   └── api/
│       ├── admin/import-csv/route.ts (Upload handler)
│       └── cron/sync-buyers/route.ts (Automated sync)
├── lib/
│   ├── integrations/
│   │   ├── csv-sync.ts               (CSV fetcher)
│   │   └── types.ts                  (Standardized interfaces)
│   ├── adapters/
│   │   ├── buyback-tree.ts           (API client)
│   │   ├── gazelle.ts
│   │   └── decluttr.ts
│   └── services/
│       └── mobile-api.ts             (MobileAPI.dev client)
├── scripts/
│   ├── setup-buyer-integrations.sql  (Database schema)
│   ├── import-buyer-csv.ts           (CLI import tool)
│   ├── fetch-device-images.ts        (Batch image downloader)
│   └── sync-new-devices.ts           (Auto catalog updater)
├── data/
│   └── *.csv                         (Buyer price feeds)
└── public/images/devices/            (Product images)
```

---

## Week 1 Success Metrics

At the end of Week 1, you should have:

- ✅ 1 buyer integrated (BuyBackTree)
- ✅ 50 devices with high-quality images
- ✅ 200+ offers in database (50 devices × 4 conditions × 1 buyer)
- ✅ CSV import tool working (CLI + admin UI)
- ✅ End-to-end flow tested (search → compare → click → redirect)
- ✅ Production deployment live

**Revenue potential:** $1,000-2,000/month with 1 buyer

---

## Week 3 Success Metrics

At the end of Week 3, you should have:

- ✅ 5 buyers integrated
- ✅ 200 devices
- ✅ 4,000+ offers (200 devices × 4 conditions × 5 buyers)
- ✅ Automated sync running every 6 hours
- ✅ Admin dashboard showing import history
- ✅ Price history tracking

**Revenue potential:** $5,000-10,000/month with 5 buyers

---

## Month 2 Goals

- ✅ 10 buyers integrated
- ✅ 500+ devices
- ✅ API integrations for top 3 buyers
- ✅ Auto device catalog updates
- ✅ Analytics dashboard (conversion rates, top devices)

**Revenue potential:** $20,000+/month

---

## Risk Mitigation

### Buyer Doesn't Have API or CSV Feed

**Solution:** Manual portal workflow

1. You log into their partner portal weekly
2. Export CSV of current prices
3. Upload to `/admin/imports`
4. Process via import script

**Time:** 10 minutes per buyer per week

### Device Name Matching Fails

**Problem:** Buyer calls it "iPhone 15 Pro 256GB" but your DB has "iPhone 15 Pro"

**Solution:** Fuzzy matching + manual mapping

```typescript
// In import script
const deviceAliases = {
  'iPhone15Pro': 'iPhone 15 Pro',
  'iPhone 15Pro': 'iPhone 15 Pro',
  'iphone-15-pro': 'iPhone 15 Pro',
}

function normalizeDeviceName(name: string): string {
  return deviceAliases[name] || name
}
```

### Image Quality Issues

**Problem:** Downloaded images are low-res or wrong product

**Solution:** Manual review queue

- Script downloads images
- You review in admin dashboard
- Approve or upload replacement

---

## Next Steps

1. **This week:** Execute Phase 1 (Days 1-7)
2. **Get BuyBackTree partnership finalized** while building tech
3. **Deploy by Friday** - Go live with real pricing
4. **Week 2:** Start adding buyers 2-5
5. **Week 3:** Set up automated sync
6. **Month 2:** Scale to 10 buyers + 500 devices

---

## Questions to Ask Each Buyer

When you reach out, ask:

1. **"Do you have a partner API we can integrate with?"**
   - If yes → Get API docs, credentials, rate limits
   - If no → Ask about CSV feed

2. **"Can you provide a daily CSV feed of your pricing?"**
   - If yes → Get format, delivery method (FTP, email, URL)
   - If no → Ask about manual portal access

3. **"What's your tracking parameter format for affiliate links?"**
   - Example: `?ref=revend&click_id={clickId}`

4. **"How often do your prices update?"**
   - Determines sync frequency

5. **"What's your CPA percentage?"**
   - Target: 4-6% of device sale price

6. **"Do you have a logo and tagline we can use?"**
   - For buyer cards on comparison page

---

## Support & Resources

**If you get stuck:**

- Check import logs: `SELECT * FROM import_logs ORDER BY created_at DESC`
- Check Supabase logs: Dashboard → Logs → API Logs
- Check Vercel logs: `vercel logs [deployment-url]`
- Test CSV import with `--dry-run` flag first

**Documentation:**

- Supabase Storage: https://supabase.com/docs/guides/storage
- Vercel Cron: https://vercel.com/docs/cron-jobs
- MobileAPI.dev: https://docs.mobileapi.dev

---

**You're ready to build! Start with Day 1 and ship by end of Week 1. 🚀**
