-- ============================================================================
-- Revend Buyer Integration Database Schema
-- ============================================================================
-- Run this in Supabase SQL Editor to add buyer integration support
--
-- This adds:
-- 1. import_logs - Track CSV/API imports
-- 2. buyer_integrations - Store integration config per buyer
-- 3. price_history - Track price changes over time
-- 4. Schema updates to existing tables (images, metadata)
-- ============================================================================

-- ============================================================================
-- 1. Import Logs Table
-- ============================================================================
-- Tracks every CSV upload, API sync, or manual import
-- Used for debugging and admin dashboard

CREATE TABLE IF NOT EXISTS import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  import_type TEXT NOT NULL CHECK (import_type IN ('csv_upload', 'csv_url', 'api', 'manual')),
  file_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  rows_processed INT DEFAULT 0,
  rows_failed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by TEXT, -- admin email or 'system' for automated
  metadata JSONB, -- store file URL, API response, column mappings, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_import_logs_buyer ON import_logs(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_import_logs_created ON import_logs(created_at DESC);

-- RLS: Admin only
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Import logs are viewable by admins only" ON import_logs
  FOR SELECT USING (false); -- Admins will use service role

CREATE POLICY "Import logs are insertable by system only" ON import_logs
  FOR INSERT WITH CHECK (false); -- System/service role only

COMMENT ON TABLE import_logs IS 'Tracks all buyer pricing imports (CSV uploads, API syncs, manual updates)';

-- ============================================================================
-- 2. Buyer Integrations Table
-- ============================================================================
-- Stores configuration for how each buyer's pricing is integrated
-- One row per buyer

CREATE TABLE IF NOT EXISTS buyer_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL UNIQUE REFERENCES buyers(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (
    integration_type IN ('csv_upload', 'csv_url', 'api', 'manual')
  ),
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}', -- API keys, CSV URL, column mappings, etc.
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency_minutes INT DEFAULT 360, -- 6 hours default
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_buyer_integrations_buyer ON buyer_integrations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_integrations_active ON buyer_integrations(buyer_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_buyer_integrations_next_sync ON buyer_integrations(next_sync_at) WHERE sync_enabled = true AND is_active = true;

-- RLS: Admin only
ALTER TABLE buyer_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyer integrations are viewable by admins only" ON buyer_integrations
  FOR SELECT USING (false);

CREATE POLICY "Buyer integrations are manageable by admins only" ON buyer_integrations
  FOR ALL USING (false);

COMMENT ON TABLE buyer_integrations IS 'Configuration for each buyer integration (API credentials, CSV URLs, sync schedule)';
COMMENT ON COLUMN buyer_integrations.config IS 'JSONB field storing: { api_key, csv_url, column_mapping, auth_type, etc. }';

-- ============================================================================
-- 3. Price History Table
-- ============================================================================
-- Tracks price changes over time for analytics
-- Inserted every time an import updates an offer

CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  condition_id UUID NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
  offer_cents INT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  import_log_id UUID REFERENCES import_logs(id) ON DELETE SET NULL
);

-- Add import_log_id column if table already existed
ALTER TABLE price_history ADD COLUMN IF NOT EXISTS import_log_id UUID REFERENCES import_logs(id) ON DELETE SET NULL;

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_price_history_device ON price_history(device_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_buyer ON price_history(buyer_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_import ON price_history(import_log_id);

-- Composite index for device+buyer price trends
CREATE INDEX IF NOT EXISTS idx_price_history_device_buyer ON price_history(device_id, buyer_id, recorded_at DESC);

-- RLS: Public read for analytics (future feature)
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Price history is readable by all" ON price_history
  FOR SELECT USING (true);

CREATE POLICY "Price history is insertable by system only" ON price_history
  FOR INSERT WITH CHECK (false); -- Service role only

COMMENT ON TABLE price_history IS 'Historical record of all offer price changes (used for price drop alerts and analytics)';

-- ============================================================================
-- 4. Updates to Existing Tables
-- ============================================================================

-- Add image URLs to device_families
ALTER TABLE device_families ADD COLUMN IF NOT EXISTS
  image_url TEXT;

COMMENT ON COLUMN device_families.image_url IS 'Main product image URL (hosted in /public/images/devices/ or CDN)';

-- Add image URLs to devices (for variant-specific images)
ALTER TABLE devices ADD COLUMN IF NOT EXISTS
  image_url TEXT;

COMMENT ON COLUMN devices.image_url IS 'Variant-specific image URL (e.g., different color) - falls back to family image_url if null';

-- Add buyer integration metadata
ALTER TABLE buyers ADD COLUMN IF NOT EXISTS
  integration_notes TEXT;

ALTER TABLE buyers ADD COLUMN IF NOT EXISTS
  contact_email TEXT;

ALTER TABLE buyers ADD COLUMN IF NOT EXISTS
  tracking_param_format TEXT;

COMMENT ON COLUMN buyers.integration_notes IS 'Internal notes about buyer API/feed (e.g., "Uses custom XML format", "Prices update hourly")';
COMMENT ON COLUMN buyers.contact_email IS 'Partner contact email for integration issues';
COMMENT ON COLUMN buyers.tracking_param_format IS 'URL parameter format for affiliate tracking (e.g., "?ref=revend&click_id={clickId}")';

-- Add last updated timestamp to offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS
  last_updated_at TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN offers.last_updated_at IS 'Timestamp of last price update (set by import scripts)';

-- Add index on last_updated_at for stale offer detection
CREATE INDEX IF NOT EXISTS idx_offers_last_updated ON offers(last_updated_at DESC);

-- ============================================================================
-- 5. Helper Functions
-- ============================================================================

-- Function to calculate next sync time based on frequency
CREATE OR REPLACE FUNCTION calculate_next_sync(
  frequency_minutes INT
)
RETURNS TIMESTAMPTZ
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NOW() + (frequency_minutes || ' minutes')::INTERVAL;
$$;

COMMENT ON FUNCTION calculate_next_sync IS 'Calculate next sync timestamp based on frequency in minutes';

-- Trigger to update buyer_integrations.updated_at
CREATE OR REPLACE FUNCTION update_buyer_integration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER buyer_integrations_updated_at
  BEFORE UPDATE ON buyer_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_buyer_integration_updated_at();

-- ============================================================================
-- 6. Sample Data - Create Integration for Existing Buyers
-- ============================================================================

-- Create placeholder integrations for all existing buyers (manual mode)
INSERT INTO buyer_integrations (buyer_id, integration_type, is_active, sync_enabled)
SELECT
  id,
  'manual' as integration_type,
  false as is_active, -- Start inactive until configured
  false as sync_enabled
FROM buyers
WHERE id NOT IN (SELECT buyer_id FROM buyer_integrations)
ON CONFLICT (buyer_id) DO NOTHING;

-- ============================================================================
-- 7. Storage Bucket for CSV Uploads
-- ============================================================================

-- Create storage bucket for CSV imports (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('csv-imports', 'csv-imports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated uploads only (admin)
CREATE POLICY "CSV imports are uploadable by authenticated users" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'csv-imports');

CREATE POLICY "CSV imports are readable by authenticated users" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'csv-imports');

-- ============================================================================
-- 8. Verification Queries
-- ============================================================================

-- Run these after setup to verify everything is working:

-- Check tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_name IN ('import_logs', 'buyer_integrations', 'price_history');

-- Check buyer integrations created
-- SELECT b.name, bi.integration_type, bi.is_active
-- FROM buyers b
-- LEFT JOIN buyer_integrations bi ON b.id = bi.buyer_id;

-- Check columns added
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'device_families' AND column_name = 'image_url';

-- ============================================================================
-- Setup Complete!
-- ============================================================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables created: import_logs, buyer_integrations, price_history
-- 3. Configure first buyer integration via admin UI
-- 4. Run CSV import script to test
-- ============================================================================
