/**
 * Admin CSV Import API
 *
 * Handles CSV uploads from the admin UI
 * Processes the CSV and imports offers into the database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { parse } from 'csv-parse/sync'

export const runtime = 'nodejs' // Need Node runtime for file processing

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await req.json()
    const { buyerId, fileName, csvContent } = body

    if (!buyerId || !fileName || !csvContent) {
      return NextResponse.json(
        { error: 'Missing required fields: buyerId, fileName, csvContent' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // ========================================================================
    // 1. Verify buyer exists
    // ========================================================================
    const { data: buyer, error: buyerError } = await supabase
      .from('buyers')
      .select('id, name, slug')
      .eq('id', buyerId)
      .single()

    if (buyerError || !buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    // ========================================================================
    // 2. Create import log
    // ========================================================================
    const { data: importLog, error: logError } = await supabase
      .from('import_logs')
      .insert({
        buyer_id: buyerId,
        import_type: 'csv_upload',
        file_name: fileName,
        status: 'processing',
        created_by: 'admin_ui',
      })
      .select()
      .single()

    if (logError) {
      return NextResponse.json(
        { error: 'Failed to create import log' },
        { status: 500 }
      )
    }

    // ========================================================================
    // 3. Parse CSV
    // ========================================================================
    let records: any[]

    try {
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    } catch (parseError) {
      await supabase
        .from('import_logs')
        .update({
          status: 'failed',
          error_message: 'Failed to parse CSV: ' + String(parseError),
          completed_at: new Date().toISOString(),
        })
        .eq('id', importLog.id)

      return NextResponse.json(
        { error: 'Failed to parse CSV file' },
        { status: 400 }
      )
    }

    // ========================================================================
    // 4. Process rows
    // ========================================================================
    let processed = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNum = i + 1

      try {
        // Extract data (flexible column names)
        const deviceName = (
          row.device_name ||
          row['Device Name'] ||
          row.device ||
          ''
        ).trim()
        const storageGbRaw = (
          row.storage_gb ||
          row['Storage (GB)'] ||
          row.storage ||
          ''
        ).trim()
        const carrier = (
          row.carrier ||
          row.Carrier ||
          'Unlocked'
        ).trim()
        const conditionName = (
          row.condition ||
          row.Condition ||
          ''
        ).trim()
        const priceUsdRaw = (
          row.price_usd ||
          row['Price (USD)'] ||
          row.price ||
          ''
        ).trim()

        if (!deviceName || !storageGbRaw || !conditionName || !priceUsdRaw) {
          throw new Error('Missing required fields')
        }

        const storageGb = parseInt(storageGbRaw.replace(/[^0-9]/g, ''))
        const priceUsd = parseFloat(priceUsdRaw.replace(/[^0-9.]/g, ''))

        if (isNaN(storageGb) || isNaN(priceUsd)) {
          throw new Error('Invalid number format')
        }

        // Find matching device
        const { data: devices } = await supabase
          .from('devices')
          .select(`
            id,
            storage_gb,
            carrier,
            device_families!inner(name, slug)
          `)
          .or(
            `device_families.name.ilike.%${deviceName}%,device_families.slug.ilike.%${deviceName.toLowerCase()}%`
          )
          .eq('storage_gb', storageGb)

        const matchingDevices =
          devices?.filter(
            d =>
              d.carrier.toLowerCase() === carrier.toLowerCase() ||
              (carrier.toLowerCase() === 'unlocked' && d.carrier.toLowerCase() === 'unlocked')
          ) || []

        if (matchingDevices.length === 0) {
          throw new Error(`No device match: ${deviceName} ${storageGb}GB ${carrier}`)
        }

        const device = matchingDevices[0]

        // Find matching condition
        const { data: conditions } = await supabase
          .from('conditions')
          .select('id, name, slug')
          .ilike('name', conditionName)

        if (!conditions || conditions.length === 0) {
          throw new Error(`No condition match: ${conditionName}`)
        }

        const condition = conditions[0]

        // Upsert offer
        const offerCents = Math.round(priceUsd * 100)

        const { error: upsertError } = await supabase.from('offers').upsert(
          {
            device_id: device.id,
            buyer_id: buyerId,
            condition_id: condition.id,
            offer_cents: offerCents,
            last_updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'device_id,buyer_id,condition_id',
          }
        )

        if (upsertError) {
          throw new Error(`Upsert failed: ${upsertError.message}`)
        }

        // Log to price history
        await supabase.from('price_history').insert({
          device_id: device.id,
          buyer_id: buyerId,
          condition_id: condition.id,
          offer_cents: offerCents,
          import_log_id: importLog.id,
        })

        processed++
      } catch (err) {
        failed++
        const errorMsg = err instanceof Error ? err.message : String(err)
        errors.push(`Row ${rowNum}: ${errorMsg}`)
      }
    }

    // ========================================================================
    // 5. Update import log
    // ========================================================================
    await supabase
      .from('import_logs')
      .update({
        status: errors.length === 0 ? 'completed' : 'completed',
        rows_processed: processed,
        rows_failed: failed,
        error_message: errors.length > 0 ? errors.slice(0, 10).join('\n') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', importLog.id)

    const duration = Date.now() - startTime

    // ========================================================================
    // 6. Return results
    // ========================================================================
    return NextResponse.json({
      success: true,
      importLogId: importLog.id,
      processed,
      failed,
      total: records.length,
      duration,
      errors: errors.slice(0, 20), // Return first 20 errors
    })
  } catch (error) {
    console.error('Import failed:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Import failed',
      },
      { status: 500 }
    )
  }
}
