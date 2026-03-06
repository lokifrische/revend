/**
 * Buyer Sync Service
 *
 * Handles automated syncing of buyer pricing data
 * Used by cron jobs and manual triggers
 */

import { createServiceClient } from '@/lib/supabase'
import { BaseCSVAdapter } from './adapters/base-csv-adapter'
import type {
  SyncResult,
  IntegrationConfig,
  StandardizedOffer,
  ImportResult,
} from './types'

// ============================================================================
// Main Sync Service
// ============================================================================

export class BuyerSyncService {
  private supabase = createServiceClient()

  /**
   * Sync a single buyer's pricing data
   */
  async syncBuyer(buyerId: string): Promise<SyncResult> {
    const startedAt = new Date().toISOString()
    const startTime = Date.now()

    try {
      console.log(`[SyncService] Starting sync for buyer: ${buyerId}`)

      // Get buyer and integration config
      const { data: integration, error: integrationError } = await this.supabase
        .from('buyer_integrations')
        .select(`
          *,
          buyers!inner(id, name, slug)
        `)
        .eq('buyer_id', buyerId)
        .eq('is_active', true)
        .eq('sync_enabled', true)
        .single()

      if (integrationError || !integration) {
        throw new Error(`No active integration found for buyer ${buyerId}`)
      }

      const buyer = (integration as any).buyers
      const config = integration.config as IntegrationConfig

      console.log(`[SyncService] Found buyer: ${buyer.name} (${buyer.slug})`)
      console.log(`[SyncService] Integration type: ${config.type}`)

      // Create import log
      const { data: importLog, error: logError } = await this.supabase
        .from('import_logs')
        .insert({
          buyer_id: buyerId,
          import_type: config.type,
          status: 'processing',
          created_by: 'system',
          metadata: {
            triggered_by: 'cron',
          },
        })
        .select()
        .single()

      if (logError) {
        throw new Error(`Failed to create import log: ${logError.message}`)
      }

      console.log(`[SyncService] Import log created: ${importLog.id}`)

      // Fetch prices based on integration type
      let offers: StandardizedOffer[] = []

      if (config.type === 'csv_url' && config.csv?.url) {
        offers = await this.fetchFromCSVUrl(buyer.slug, buyer.name, config)
      } else if (config.type === 'api' && config.api) {
        // TODO: Implement API adapter
        throw new Error('API integration not yet implemented')
      } else {
        throw new Error(`Unsupported integration type: ${config.type}`)
      }

      console.log(`[SyncService] Fetched ${offers.length} offers`)

      // Import offers into database
      const importResult = await this.importOffers(
        buyerId,
        buyer.slug,
        offers,
        importLog.id
      )

      // Update import log
      await this.supabase
        .from('import_logs')
        .update({
          status: 'completed',
          rows_processed: importResult.offersImported + importResult.offersUpdated,
          rows_failed: importResult.offersFailed,
          error_message: importResult.errors.length > 0 ? importResult.errors.join('\n') : null,
          completed_at: new Date().toISOString(),
        })
        .eq('id', importLog.id)

      // Update buyer_integrations last_sync_at
      await this.supabase
        .from('buyer_integrations')
        .update({
          last_sync_at: new Date().toISOString(),
          next_sync_at: this.calculateNextSync(integration.sync_frequency_minutes),
        })
        .eq('id', integration.id)

      const duration = Date.now() - startTime

      console.log(`[SyncService] Sync completed in ${duration}ms`)
      console.log(`[SyncService] Imported: ${importResult.offersImported}, Updated: ${importResult.offersUpdated}, Failed: ${importResult.offersFailed}`)

      return {
        buyerId,
        buyerSlug: buyer.slug,
        success: true,
        importResult,
        startedAt,
        completedAt: new Date().toISOString(),
        duration,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)

      console.error(`[SyncService] Sync failed:`, errorMessage)

      return {
        buyerId,
        buyerSlug: 'unknown',
        success: false,
        error: errorMessage,
        startedAt,
        completedAt: new Date().toISOString(),
        duration,
      }
    }
  }

  /**
   * Sync all active buyers
   */
  async syncAllBuyers(): Promise<SyncResult[]> {
    console.log('[SyncService] Starting sync for all active buyers')

    // Get all active integrations ready for sync
    const { data: integrations, error } = await this.supabase
      .from('buyer_integrations')
      .select('buyer_id, buyers!inner(name, slug)')
      .eq('is_active', true)
      .eq('sync_enabled', true)
      .in('integration_type', ['csv_url', 'api'])

    if (error) {
      console.error('[SyncService] Failed to fetch integrations:', error)
      return []
    }

    if (!integrations || integrations.length === 0) {
      console.log('[SyncService] No active integrations found')
      return []
    }

    console.log(`[SyncService] Found ${integrations.length} active integrations`)

    // Sync each buyer sequentially (could be parallelized later)
    const results: SyncResult[] = []

    for (const integration of integrations) {
      const result = await this.syncBuyer(integration.buyer_id)
      results.push(result)

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log(`[SyncService] Sync complete: ${successCount} succeeded, ${failCount} failed`)

    return results
  }

  /**
   * Fetch offers from CSV URL
   */
  private async fetchFromCSVUrl(
    buyerSlug: string,
    buyerName: string,
    config: IntegrationConfig
  ): Promise<StandardizedOffer[]> {
    if (!config.csv?.url) {
      throw new Error('CSV URL not configured')
    }

    const adapter = new BaseCSVAdapter({
      buyerSlug,
      buyerName,
      csvConfig: config.csv,
      csvUrl: config.csv.url,
    })

    await adapter.validateConfig()
    const connected = await adapter.testConnection()

    if (!connected) {
      throw new Error(`Failed to connect to CSV URL: ${config.csv.url}`)
    }

    return await adapter.fetchPrices()
  }

  /**
   * Import offers into database
   */
  private async importOffers(
    buyerId: string,
    buyerSlug: string,
    offers: StandardizedOffer[],
    importLogId: string
  ): Promise<ImportResult> {
    let imported = 0
    let updated = 0
    let failed = 0
    const errors: string[] = []
    const warnings: string[] = []

    for (const offer of offers) {
      try {
        // Find matching device
        const deviceMatch = await this.findMatchingDevice(offer)

        if (!deviceMatch) {
          warnings.push(`No device match: ${offer.deviceName} ${offer.storageGb}GB ${offer.carrier}`)
          failed++
          continue
        }

        // Find matching condition
        const conditionMatch = await this.findMatchingCondition(offer)

        if (!conditionMatch) {
          warnings.push(`No condition match: ${offer.conditionName}`)
          failed++
          continue
        }

        // Upsert offer
        const { error: upsertError } = await this.supabase
          .from('offers')
          .upsert(
            {
              device_id: deviceMatch.id,
              buyer_id: buyerId,
              condition_id: conditionMatch.id,
              offer_cents: offer.offerCents,
              last_updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'device_id,buyer_id,condition_id',
            }
          )

        if (upsertError) {
          errors.push(`Failed to upsert offer: ${upsertError.message}`)
          failed++
          continue
        }

        // Log to price history
        await this.supabase.from('price_history').insert({
          device_id: deviceMatch.id,
          buyer_id: buyerId,
          condition_id: conditionMatch.id,
          offer_cents: offer.offerCents,
          import_log_id: importLogId,
        })

        // Check if this was an insert or update (simplified - assume update if offer exists)
        const { data: existingOffer } = await this.supabase
          .from('offers')
          .select('id')
          .eq('device_id', deviceMatch.id)
          .eq('buyer_id', buyerId)
          .eq('condition_id', conditionMatch.id)
          .single()

        if (existingOffer) {
          updated++
        } else {
          imported++
        }
      } catch (err) {
        failed++
        const errorMsg = err instanceof Error ? err.message : String(err)
        errors.push(errorMsg)
      }
    }

    return {
      success: failed < offers.length, // Success if at least some imported
      offersImported: imported,
      offersUpdated: updated,
      offersFailed: failed,
      errors,
      warnings,
    }
  }

  /**
   * Find matching device in database
   */
  private async findMatchingDevice(offer: StandardizedOffer) {
    const deviceName = offer.deviceName?.toLowerCase().trim()

    if (!deviceName) return null

    const { data: devices } = await this.supabase
      .from('devices')
      .select(`
        id,
        storage_gb,
        carrier,
        device_families!inner(name, slug)
      `)
      .or(`device_families.name.ilike.%${deviceName}%,device_families.slug.ilike.%${deviceName}%`)
      .eq('storage_gb', offer.storageGb)

    if (!devices || devices.length === 0) return null

    // Find best carrier match
    const carrierNormalized = (offer.carrier || 'unlocked').toLowerCase()

    const match = devices.find(d =>
      d.carrier.toLowerCase() === carrierNormalized
    )

    return match || devices[0] // Fallback to first match
  }

  /**
   * Find matching condition in database
   */
  private async findMatchingCondition(offer: StandardizedOffer) {
    const conditionName = offer.conditionName?.toLowerCase().trim()

    if (!conditionName) return null

    const { data: conditions } = await this.supabase
      .from('conditions')
      .select('id, name, slug')
      .ilike('name', conditionName)

    return conditions?.[0] || null
  }

  /**
   * Calculate next sync timestamp
   */
  private calculateNextSync(frequencyMinutes: number): string {
    const now = new Date()
    now.setMinutes(now.getMinutes() + frequencyMinutes)
    return now.toISOString()
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const buyerSyncService = new BuyerSyncService()
