-- Add unique constraint for device variants
-- This allows upsert operations on (family_id, storage_gb, carrier)
-- to prevent duplicate variants and enable incremental seeding

-- Drop any existing duplicate devices first (keep the oldest)
DELETE FROM devices a
USING devices b
WHERE a.id > b.id
  AND a.family_id = b.family_id
  AND a.storage_gb = b.storage_gb
  AND COALESCE(a.carrier, 'unlocked') = COALESCE(b.carrier, 'unlocked');

-- Add the unique constraint
ALTER TABLE devices
ADD CONSTRAINT devices_family_storage_carrier_unique
UNIQUE (family_id, storage_gb, carrier);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_devices_variant ON devices(family_id, storage_gb, carrier);
