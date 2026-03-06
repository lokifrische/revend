#!/usr/bin/env tsx

/**
 * Revend Buyer CSV Import Script
 *
 * Imports buyer pricing data from CSV files into the Supabase database.
 *
 * Usage:
 *   npx tsx scripts/import-buyer-csv.ts <buyer_slug> <csv_file> [--dry-run]
 *
 * Example:
 *   npx tsx scripts/import-buyer-csv.ts buybacktree ./data/buybacktree_prices.csv --dry-run
 *   npx tsx scripts/import-buyer-csv.ts buybacktree ./data/buybacktree_prices.csv
 *
 * CSV Format (flexible - use --mapping for custom columns):
 *   device_name,storage_gb,carrier,condition,price_usd,updated_at
 *   iPhone 15 Pro,256,Unlocked,Excellent,850.00,2026-03-05
 *   iPhone 15 Pro,256,Unlocked,Good,780.00,2026-03-05
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// ============================================================================
// Configuration
// ============================================================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================================
// Types
// ============================================================================

interface CSVRow {
  [key: string]: string | number
}

interface ColumnMapping {
  device_name?: string
  storage_gb?: string
  carrier?: string
  condition?: string
  price_usd?: string
  updated_at?: string
}

interface ImportConfig {
  buyerSlug: string
  filePath: string
  columnMapping?: ColumnMapping
  dryRun?: boolean
}

interface ImportResult {
  success: boolean
  processed: number
  failed: number
  errors: string[]
  importLogId?: string
}

// ============================================================================
// Device Name Normalization
// ============================================================================

// Buyer names may differ from our catalog - this maps variations
const DEVICE_NAME_ALIASES: Record<string, string> = {
  // iPhone variations
  'iphone15pro': 'iphone 15 pro',
  'iphone 15pro': 'iphone 15 pro',
  'iphone-15-pro': 'iphone 15 pro',
  'iphone_15_pro': 'iphone 15 pro',
  'apple iphone 15 pro': 'iphone 15 pro',

  // Samsung variations
  'galaxys24ultra': 'galaxy s24 ultra',
  'galaxy-s24-ultra': 'galaxy s24 ultra',
  'samsung galaxy s24 ultra': 'galaxy s24 ultra',

  // Common shortcuts
  'mbp': 'macbook pro',
  'mba': 'macbook air',
}

function normalizeDeviceName(name: string): string {
  const normalized = name.toLowerCase().trim()
  return DEVICE_NAME_ALIASES[normalized] || normalized
}

// ============================================================================
// Main Import Function
// ============================================================================

export async function importBuyerCSV(config: ImportConfig): Promise<ImportResult> {
  console.log('\n' + '='.repeat(80))
  console.log('🚀 Revend Buyer CSV Import')
  console.log('='.repeat(80))
  console.log(`Buyer: ${config.buyerSlug}`)
  console.log(`File: ${config.filePath}`)
  console.log(`Mode: ${config.dryRun ? '🧪 DRY RUN (no changes)' : '✅ LIVE IMPORT'}`)
  console.log('='.repeat(80) + '\n')

  const result: ImportResult = {
    success: false,
    processed: 0,
    failed: 0,
    errors: [],
  }

  try {
    // ========================================================================
    // 1. Verify buyer exists
    // ========================================================================
    console.log('🔍 Looking up buyer...')

    const { data: buyer, error: buyerError } = await supabase
      .from('buyers')
      .select('id, name, slug')
      .eq('slug', config.buyerSlug)
      .single()

    if (buyerError || !buyer) {
      throw new Error(`Buyer not found: ${config.buyerSlug}`)
    }

    console.log(`✅ Found buyer: ${buyer.name} (${buyer.id})\n`)

    // ========================================================================
    // 2. Create import log
    // ========================================================================
    if (!config.dryRun) {
      console.log('📝 Creating import log...')

      const { data: importLog, error: logError } = await supabase
        .from('import_logs')
        .insert({
          buyer_id: buyer.id,
          import_type: 'csv_upload',
          file_name: path.basename(config.filePath),
          status: 'processing',
          created_by: 'cli',
          metadata: {
            column_mapping: config.columnMapping,
          },
        })
        .select()
        .single()

      if (logError) {
        throw new Error(`Failed to create import log: ${logError.message}`)
      }

      result.importLogId = importLog.id
      console.log(`✅ Import log created: ${importLog.id}\n`)
    }

    // ========================================================================
    // 3. Read and parse CSV
    // ========================================================================
    console.log('📂 Reading CSV file...')

    if (!fs.existsSync(config.filePath)) {
      throw new Error(`File not found: ${config.filePath}`)
    }

    const fileContent = fs.readFileSync(config.filePath, 'utf-8')
    const records: CSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: false, // Keep as strings for now
    })

    console.log(`✅ Found ${records.length} rows in CSV\n`)

    if (records.length === 0) {
      throw new Error('CSV file is empty or has no data rows')
    }

    // ========================================================================
    // 4. Process each row
    // ========================================================================
    console.log('⚙️  Processing rows...\n')

    const mapping = config.columnMapping || {}
    const deviceNameCol = mapping.device_name || 'device_name'
    const storageCol = mapping.storage_gb || 'storage_gb'
    const carrierCol = mapping.carrier || 'carrier'
    const conditionCol = mapping.condition || 'condition'
    const priceCol = mapping.price_usd || 'price_usd'

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNum = i + 1

      try {
        // Extract data from row
        const deviceName = String(row[deviceNameCol] || '').trim()
        const storageGbRaw = String(row[storageCol] || '').trim()
        const carrier = String(row[carrierCol] || 'Unlocked').trim()
        const conditionName = String(row[conditionCol] || '').trim()
        const priceUsdRaw = String(row[priceCol] || '').trim()

        // Validate required fields
        if (!deviceName) {
          throw new Error(`Missing device_name`)
        }
        if (!storageGbRaw) {
          throw new Error(`Missing storage_gb`)
        }
        if (!conditionName) {
          throw new Error(`Missing condition`)
        }
        if (!priceUsdRaw) {
          throw new Error(`Missing price_usd`)
        }

        // Parse numbers
        const storageGb = parseInt(storageGbRaw.replace(/[^0-9]/g, ''))
        const priceUsd = parseFloat(priceUsdRaw.replace(/[^0-9.]/g, ''))

        if (isNaN(storageGb) || storageGb <= 0) {
          throw new Error(`Invalid storage: ${storageGbRaw}`)
        }
        if (isNaN(priceUsd) || priceUsd < 0) {
          throw new Error(`Invalid price: ${priceUsdRaw}`)
        }

        // Normalize device name
        const normalizedName = normalizeDeviceName(deviceName)

        // ====================================================================
        // Find matching device in database
        // ====================================================================
        const { data: devices, error: deviceError } = await supabase
          .from('devices')
          .select(`
            id,
            storage_gb,
            carrier,
            device_families!inner(name, slug)
          `)
          .or(`device_families.name.ilike.%${normalizedName}%,device_families.slug.ilike.%${normalizedName}%`)
          .eq('storage_gb', storageGb)

        if (deviceError) {
          throw new Error(`Database error: ${deviceError.message}`)
        }

        // Filter by carrier match (case-insensitive)
        const matchingDevices = devices?.filter(d =>
          d.carrier.toLowerCase() === carrier.toLowerCase() ||
          (carrier.toLowerCase() === 'unlocked' && d.carrier.toLowerCase() === 'unlocked')
        ) || []

        if (matchingDevices.length === 0) {
          console.log(`  ⚠️  Row ${rowNum}: No match - ${deviceName} ${storageGb}GB ${carrier}`)
          result.failed++
          result.errors.push(`Row ${rowNum}: No device match - ${deviceName} ${storageGb}GB ${carrier}`)
          continue
        }

        // Use first match
        const device = matchingDevices[0]

        // ====================================================================
        // Find matching condition
        // ====================================================================
        const { data: conditions, error: conditionError } = await supabase
          .from('conditions')
          .select('id, slug, name')
          .ilike('name', conditionName)

        if (conditionError) {
          throw new Error(`Database error: ${conditionError.message}`)
        }

        if (!conditions || conditions.length === 0) {
          console.log(`  ⚠️  Row ${rowNum}: No condition match - ${conditionName}`)
          result.failed++
          result.errors.push(`Row ${rowNum}: No condition match - ${conditionName}`)
          continue
        }

        const condition = conditions[0]

        // ====================================================================
        // Upsert offer
        // ====================================================================
        const offerCents = Math.round(priceUsd * 100)

        if (!config.dryRun) {
          const { error: upsertError } = await supabase
            .from('offers')
            .upsert(
              {
                device_id: device.id,
                buyer_id: buyer.id,
                condition_id: condition.id,
                offer_cents: offerCents,
                last_updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'device_id,buyer_id,condition_id',
              }
            )

          if (upsertError) {
            throw new Error(`Failed to upsert offer: ${upsertError.message}`)
          }

          // Log to price history
          await supabase.from('price_history').insert({
            device_id: device.id,
            buyer_id: buyer.id,
            condition_id: condition.id,
            offer_cents: offerCents,
            import_log_id: result.importLogId,
          })
        }

        result.processed++
        console.log(`  ✅ Row ${rowNum}: ${deviceName} ${storageGb}GB ${carrier} - ${condition.name}: $${priceUsd.toFixed(2)}`)

      } catch (err) {
        result.failed++
        const errorMsg = err instanceof Error ? err.message : String(err)
        result.errors.push(`Row ${rowNum}: ${errorMsg}`)
        console.log(`  ❌ Row ${rowNum}: ${errorMsg}`)
      }
    }

    // ========================================================================
    // 5. Update import log
    // ========================================================================
    if (!config.dryRun && result.importLogId) {
      await supabase
        .from('import_logs')
        .update({
          status: result.errors.length === 0 ? 'completed' : 'completed',
          rows_processed: result.processed,
          rows_failed: result.failed,
          error_message: result.errors.length > 0 ? result.errors.slice(0, 10).join('\n') : null,
          completed_at: new Date().toISOString(),
        })
        .eq('id', result.importLogId)
    }

    // ========================================================================
    // 6. Print summary
    // ========================================================================
    console.log('\n' + '='.repeat(80))
    console.log('📊 Import Summary')
    console.log('='.repeat(80))
    console.log(`Total rows: ${records.length}`)
    console.log(`✅ Processed: ${result.processed}`)
    console.log(`❌ Failed: ${result.failed}`)
    if (config.dryRun) {
      console.log('\n⚠️  DRY RUN - No data was written to the database')
    }
    console.log('='.repeat(80) + '\n')

    if (result.errors.length > 0 && result.errors.length <= 20) {
      console.log('Errors:')
      result.errors.forEach(err => console.log(`  - ${err}`))
      console.log('')
    }

    result.success = true
    return result

  } catch (err) {
    console.error('\n❌ Import failed:', err)

    // Update import log to failed
    if (!config.dryRun && result.importLogId) {
      await supabase
        .from('import_logs')
        .update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : String(err),
          completed_at: new Date().toISOString(),
        })
        .eq('id', result.importLogId)
    }

    result.errors.push(err instanceof Error ? err.message : String(err))
    return result
  }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx scripts/import-buyer-csv.ts <buyer_slug> <csv_file> [--dry-run]

Arguments:
  buyer_slug    Slug of the buyer (e.g., 'buybacktree', 'gazelle')
  csv_file      Path to CSV file to import
  --dry-run     Test run without writing to database

Examples:
  # Dry run (test without importing)
  npx tsx scripts/import-buyer-csv.ts buybacktree ./data/buybacktree.csv --dry-run

  # Live import
  npx tsx scripts/import-buyer-csv.ts buybacktree ./data/buybacktree.csv

Expected CSV Format:
  device_name,storage_gb,carrier,condition,price_usd
  iPhone 15 Pro,256,Unlocked,Excellent,850.00
  iPhone 15 Pro,256,Unlocked,Good,780.00
  iPhone 15,128,Unlocked,Excellent,650.00

Environment Variables Required:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`)
    process.exit(args.includes('--help') ? 0 : 1)
  }

  const buyerSlug = args[0]
  const filePath = args[1]
  const dryRun = args.includes('--dry-run')

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL')
    console.error('   SUPABASE_SERVICE_ROLE_KEY')
    console.error('\nCreate a .env.local file with these values.')
    process.exit(1)
  }

  const result = await importBuyerCSV({
    buyerSlug,
    filePath,
    dryRun,
  })

  process.exit(result.success ? 0 : 1)
}

// Run if called directly
if (require.main === module) {
  main()
}
