/**
 * Automated Buyer Sync Cron Job
 *
 * Triggered by Vercel Cron every 6 hours (configurable in vercel.json)
 * Syncs pricing data from all active buyer integrations
 *
 * Security: Protected by CRON_SECRET environment variable
 */

import { NextRequest, NextResponse } from 'next/server'
import { buyerSyncService } from '@/lib/integrations/sync-service'

export const runtime = 'nodejs' // Cron jobs need Node runtime (not Edge)
export const maxDuration = 300 // 5 minutes max execution time

export async function GET(req: NextRequest) {
  const startTime = Date.now()

  try {
    // ========================================================================
    // 1. Verify authorization (prevent unauthorized cron calls)
    // ========================================================================
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET environment variable not set')
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('[Cron] Unauthorized attempt to trigger sync')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Cron] ========================================')
    console.log('[Cron] Automated Buyer Sync Started')
    console.log('[Cron] ========================================')

    // ========================================================================
    // 2. Run sync for all active buyers
    // ========================================================================
    const results = await buyerSyncService.syncAllBuyers()

    const duration = Date.now() - startTime
    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log('[Cron] ========================================')
    console.log('[Cron] Sync Complete')
    console.log(`[Cron] Duration: ${duration}ms`)
    console.log(`[Cron] Success: ${successCount}`)
    console.log(`[Cron] Failed: ${failCount}`)
    console.log('[Cron] ========================================')

    // ========================================================================
    // 3. Send alerts for failures (if configured)
    // ========================================================================
    const failures = results.filter(r => !r.success)

    if (failures.length > 0 && process.env.SLACK_WEBHOOK_URL) {
      await sendSlackAlert(failures)
    }

    // ========================================================================
    // 4. Return results
    // ========================================================================
    return NextResponse.json(
      {
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
      },
      { status: 200 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error('[Cron] Fatal error:', errorMessage)

    // Send critical alert
    if (process.env.SLACK_WEBHOOK_URL) {
      await sendSlackAlert([
        {
          buyerId: 'unknown',
          buyerSlug: 'unknown',
          success: false,
          error: errorMessage,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          duration,
        },
      ])
    }

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

// ============================================================================
// Helper: Send Slack Alert
// ============================================================================

async function sendSlackAlert(failures: Array<{ buyerSlug: string; error?: string }>) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) return

  try {
    const message = {
      text: '⚠️ Buyer Sync Failures',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '⚠️ Buyer Sync Failures',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${failures.length}* buyer sync(s) failed:\n\n${failures
              .map(f => `• *${f.buyerSlug}*: ${f.error || 'Unknown error'}`)
              .join('\n')}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Triggered at: ${new Date().toISOString()}`,
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
  } catch (err) {
    console.error('[Cron] Failed to send Slack alert:', err)
  }
}
