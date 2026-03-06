/**
 * Buyer Integration Types
 *
 * Defines standardized interfaces for all buyer integrations,
 * regardless of whether they use CSV, API, or manual input.
 */

// ============================================================================
// Integration Types
// ============================================================================

export type IntegrationType = 'csv_upload' | 'csv_url' | 'api' | 'manual'

export type IntegrationStatus = 'pending' | 'processing' | 'completed' | 'failed'

// ============================================================================
// Standardized Offer Format
// ============================================================================

/**
 * Standard format that all adapters must return
 * This gets converted to database `offers` table rows
 */
export interface StandardizedOffer {
  // Device identification
  deviceSlug?: string // e.g., 'iphone-15-pro'
  deviceName?: string // e.g., 'iPhone 15 Pro'
  deviceId?: string // UUID if you have it
  storageGb: number // e.g., 256
  carrier?: string // e.g., 'Unlocked', 'Verizon'

  // Condition
  conditionSlug?: string // e.g., 'excellent', 'good'
  conditionName?: string // e.g., 'Excellent', 'Good'
  conditionId?: string // UUID if you have it

  // Pricing
  offerCents: number // Price in cents (e.g., 85000 = $850.00)
  priceMult?: number // Condition multiplier (if applicable)

  // Buyer (usually set by adapter class)
  buyerSlug?: string
  buyerId?: string

  // Metadata
  updatedAt?: string // ISO timestamp
  expiresAt?: string // ISO timestamp (when offer expires)
}

// ============================================================================
// Buyer Adapter Interface
// ============================================================================

/**
 * All buyer integrations must implement this interface
 * This ensures consistent behavior across CSV, API, and manual sources
 */
export interface BuyerAdapter {
  /** Unique identifier for this buyer */
  buyerSlug: string

  /** Human-readable name */
  buyerName: string

  /** Integration type */
  integrationType: IntegrationType

  /**
   * Fetch latest pricing data from this buyer
   * @returns Array of standardized offers
   */
  fetchPrices(): Promise<StandardizedOffer[]>

  /**
   * Validate adapter configuration
   * Throws error if config is invalid
   */
  validateConfig(): Promise<void>

  /**
   * Test connection/authentication
   * Returns true if successful
   */
  testConnection(): Promise<boolean>
}

// ============================================================================
// CSV-specific Types
// ============================================================================

export interface CSVColumnMapping {
  device_name?: string // Column name in CSV
  storage_gb?: string
  carrier?: string
  condition?: string
  price_usd?: string
  updated_at?: string
}

export interface CSVConfig {
  url?: string // For automated CSV fetching
  columnMapping?: CSVColumnMapping
  delimiter?: string // Default: ','
  skipRows?: number // Default: 0
  encoding?: string // Default: 'utf-8'
}

// ============================================================================
// API-specific Types
// ============================================================================

export interface APIConfig {
  baseUrl: string // e.g., 'https://api.buybacktree.com/v1'
  apiKey?: string
  authType?: 'bearer' | 'basic' | 'api_key' | 'none'
  headers?: Record<string, string>
  rateLimit?: {
    requestsPerMinute: number
    requestsPerDay?: number
  }
}

// ============================================================================
// Integration Configuration
// ============================================================================

/**
 * Stored in buyer_integrations.config JSONB column
 */
export interface IntegrationConfig {
  // Type discriminator
  type: IntegrationType

  // CSV configuration
  csv?: CSVConfig

  // API configuration
  api?: APIConfig

  // General settings
  syncFrequencyMinutes?: number // How often to auto-sync (default: 360 = 6 hours)
  enabled?: boolean // Whether auto-sync is enabled
  notifyOnError?: boolean // Send alerts on sync failure
  alertEmail?: string

  // Custom settings per buyer
  customSettings?: Record<string, any>
}

// ============================================================================
// Import Result Types
// ============================================================================

export interface ImportResult {
  success: boolean
  importLogId?: string
  offersImported: number
  offersUpdated: number
  offersFailed: number
  errors: string[]
  warnings: string[]
  duration?: number // milliseconds
}

// ============================================================================
// Database Types (matches Supabase schema)
// ============================================================================

export interface BuyerIntegration {
  id: string
  buyer_id: string
  integration_type: IntegrationType
  is_active: boolean
  config: IntegrationConfig
  last_sync_at: string | null
  next_sync_at: string | null
  sync_frequency_minutes: number
  sync_enabled: boolean
  created_at: string
  updated_at: string
}

export interface ImportLog {
  id: string
  buyer_id: string
  import_type: IntegrationType
  file_name: string | null
  status: IntegrationStatus
  rows_processed: number
  rows_failed: number
  error_message: string | null
  started_at: string
  completed_at: string | null
  created_by: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface PriceHistory {
  id: string
  device_id: string
  buyer_id: string
  condition_id: string
  offer_cents: number
  recorded_at: string
  import_log_id: string | null
}

// ============================================================================
// Helper Type Guards
// ============================================================================

export function isCSVIntegration(config: IntegrationConfig): config is IntegrationConfig & { csv: CSVConfig } {
  return config.type === 'csv_upload' || config.type === 'csv_url'
}

export function isAPIIntegration(config: IntegrationConfig): config is IntegrationConfig & { api: APIConfig } {
  return config.type === 'api'
}

// ============================================================================
// Sync Job Types
// ============================================================================

export interface SyncJob {
  buyerId: string
  buyerSlug: string
  integrationType: IntegrationType
  config: IntegrationConfig
  lastSyncAt: string | null
  nextSyncAt: string | null
}

export interface SyncResult {
  buyerId: string
  buyerSlug: string
  success: boolean
  importResult?: ImportResult
  error?: string
  startedAt: string
  completedAt: string
  duration: number // milliseconds
}
