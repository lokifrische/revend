/**
 * Admin Manual Sync API
 *
 * Allows admins to manually trigger a sync of all active buyer integrations
 * (instead of waiting for the cron job)
 */

import { NextRequest, NextResponse } from 'next/server'
import { buyerSyncService } from '@/lib/integrations/sync-service'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes max

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    console.log('[Admin] Manual sync triggered')

    // Run sync for all active buyers
    const results = await buyerSyncService.syncAllBuyers()

    const duration = Date.now() - startTime
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log('[Admin] Manual sync complete')
    console.log(`[Admin] Duration: ${duration}ms`)
    console.log(`[Admin] Success: ${successCount}, Failed: ${failCount}`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      results: results.map(r => ({
        buyer: r.buyerSlug,
        success: r.success,
        imported: r.importResult?.offersImported || 0,
        updated: r.importResult?.offersUpdated || 0,
        failed: r.importResult?.offersFailed || 0,
        error: r.error,
      })),
      summary: {
        total: results.length,
        succeeded: successCount,
        failed: failCount,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error('[Admin] Sync failed:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        duration,
      },
      { status: 500 }
    )
  }
}
