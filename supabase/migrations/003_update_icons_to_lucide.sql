-- ================================================================
-- Update Icons to Lucide Icon Names
-- Replaces emoji icons with professional Lucide icon names
-- ================================================================

-- Update Categories to use Lucide icon names
UPDATE categories SET icon = 'Smartphone' WHERE slug = 'phones';
UPDATE categories SET icon = 'Tablet' WHERE slug = 'tablets';
UPDATE categories SET icon = 'Laptop' WHERE slug = 'laptops';
UPDATE categories SET icon = 'Watch' WHERE slug = 'watches' OR slug = 'smartwatches';
UPDATE categories SET icon = 'Gamepad2' WHERE slug = 'consoles';
UPDATE categories SET icon = 'Headphones' WHERE slug = 'headphones';
UPDATE categories SET icon = 'Speaker' WHERE slug = 'speakers';
UPDATE categories SET icon = 'Tv' WHERE slug = 'tvs';
UPDATE categories SET icon = 'Camera' WHERE slug = 'cameras';

-- Update Conditions to use Lucide icon names
UPDATE conditions SET icon = 'Sparkles' WHERE slug = 'like-new';
UPDATE conditions SET icon = 'Check' WHERE slug = 'good';
UPDATE conditions SET icon = 'AlertCircle' WHERE slug = 'fair';
UPDATE conditions SET icon = 'XCircle' WHERE slug = 'poor';
UPDATE conditions SET icon = 'Wrench' WHERE slug = 'broken' OR slug = 'faulty';
