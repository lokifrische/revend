/**
 * Base CSV Adapter
 *
 * Reusable CSV adapter that can be extended for specific buyers
 */

import { parse } from 'csv-parse/sync'
import type {
  BuyerAdapter,
  StandardizedOffer,
  CSVConfig,
  IntegrationType,
} from '../types'

export interface BaseCSVAdapterConfig {
  buyerSlug: string
  buyerName: string
  csvConfig: CSVConfig
  csvUrl?: string // For automated fetching
  csvContent?: string // For manual uploads
}

export class BaseCSVAdapter implements BuyerAdapter {
  buyerSlug: string
  buyerName: string
  integrationType: IntegrationType
  private csvConfig: CSVConfig
  private csvUrl?: string
  private csvContent?: string

  constructor(config: BaseCSVAdapterConfig) {
    this.buyerSlug = config.buyerSlug
    this.buyerName = config.buyerName
    this.integrationType = config.csvUrl ? 'csv_url' : 'csv_upload'
    this.csvConfig = config.csvConfig
    this.csvUrl = config.csvUrl
    this.csvContent = config.csvContent
  }

  async validateConfig(): Promise<void> {
    if (!this.csvUrl && !this.csvContent) {
      throw new Error('Either csvUrl or csvContent must be provided')
    }

    if (!this.csvConfig.columnMapping) {
      throw new Error('Column mapping is required')
    }

    const required = ['device_name', 'storage_gb', 'condition', 'price_usd']
    const mapping = this.csvConfig.columnMapping

    for (const field of required) {
      if (!mapping[field as keyof typeof mapping]) {
        throw new Error(`Missing column mapping for required field: ${field}`)
      }
    }
  }

  async testConnection(): Promise<boolean> {
    if (this.csvUrl) {
      try {
        const response = await fetch(this.csvUrl, { method: 'HEAD' })
        return response.ok
      } catch {
        return false
      }
    }

    // For upload, just check if content exists
    return !!this.csvContent
  }

  async fetchPrices(): Promise<StandardizedOffer[]> {
    // Fetch CSV content if URL provided
    let content = this.csvContent

    if (this.csvUrl && !content) {
      const response = await fetch(this.csvUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }
      content = await response.text()
    }

    if (!content) {
      throw new Error('No CSV content available')
    }

    // Parse CSV
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: this.csvConfig.delimiter || ',',
      from: (this.csvConfig.skipRows || 0) + 1,
      encoding: this.csvConfig.encoding || 'utf-8',
    })

    // Transform to standardized format
    const offers: StandardizedOffer[] = []
    const mapping = this.csvConfig.columnMapping!

    for (const row of records) {
      try {
        const offer = this.transformRow(row, mapping)
        offers.push(offer)
      } catch (err) {
        console.error('Failed to transform row:', err, row)
        // Continue processing other rows
      }
    }

    return offers
  }

  private transformRow(
    row: Record<string, string>,
    mapping: NonNullable<CSVConfig['columnMapping']>
  ): StandardizedOffer {
    const deviceName = row[mapping.device_name!]?.trim()
    const storageGbRaw = row[mapping.storage_gb!]?.trim()
    const carrier = row[mapping.carrier || 'carrier']?.trim() || 'Unlocked'
    const conditionName = row[mapping.condition!]?.trim()
    const priceUsdRaw = row[mapping.price_usd!]?.trim()
    const updatedAt = row[mapping.updated_at || 'updated_at']?.trim()

    if (!deviceName || !storageGbRaw || !conditionName || !priceUsdRaw) {
      throw new Error(`Missing required fields in row: ${JSON.stringify(row)}`)
    }

    // Parse numbers
    const storageGb = parseInt(storageGbRaw.replace(/[^0-9]/g, ''))
    const priceUsd = parseFloat(priceUsdRaw.replace(/[^0-9.]/g, ''))

    if (isNaN(storageGb)) {
      throw new Error(`Invalid storage: ${storageGbRaw}`)
    }

    if (isNaN(priceUsd)) {
      throw new Error(`Invalid price: ${priceUsdRaw}`)
    }

    return {
      deviceName,
      storageGb,
      carrier,
      conditionName,
      offerCents: Math.round(priceUsd * 100),
      buyerSlug: this.buyerSlug,
      updatedAt: updatedAt || new Date().toISOString(),
    }
  }
}
