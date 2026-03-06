# Buyer Pricing Data

This directory contains CSV files for buyer pricing imports.

## CSV Format

### Required Columns

| Column Name | Type | Example | Description |
|-------------|------|---------|-------------|
| `device_name` | String | `iPhone 15 Pro` | Device family name (matches database) |
| `storage_gb` | Number | `256` | Storage capacity in GB |
| `carrier` | String | `Unlocked` | Carrier (use "Unlocked" for carrier-free) |
| `condition` | String | `Excellent` | Condition name (Excellent, Good, Fair, Poor) |
| `price_usd` | Number | `850.00` | Offer price in USD |

### Optional Columns

| Column Name | Type | Example | Description |
|-------------|------|---------|-------------|
| `updated_at` | Date | `2026-03-05` | When this price was last updated |
| `expires_at` | Date | `2026-04-05` | When this offer expires |

## Sample Files

- **`sample-buyer-pricing.csv`** - Example format with 45 sample offers
  - Covers phones, tablets, laptops, and watches
  - Includes iPhone, Samsung, Google Pixel, iPad, MacBook, Apple Watch

## Usage

### CLI Import

```bash
npx tsx scripts/import-buyer-csv.ts <buyer_slug> <csv_file> [--dry-run]
```

**Examples:**

```bash
# Dry run (test without importing)
npx tsx scripts/import-buyer-csv.ts buybacktree ./data/sample-buyer-pricing.csv --dry-run

# Live import
npx tsx scripts/import-buyer-csv.ts buybacktree ./data/sample-buyer-pricing.csv
```

### Admin UI Import

1. Go to `/admin/imports`
2. Select buyer from dropdown
3. Click "Upload CSV"
4. Choose your CSV file
5. View results in import history table

## Buyer-Specific Formats

Different buyers may use different column names. The import script supports custom column mappings.

### BuyBackTree Example

```csv
Device,Storage,Carrier,Grade,Price
iPhone 15 Pro,256GB,Unlocked,A+,850.00
```

**Column mapping:**
```json
{
  "device_name": "Device",
  "storage_gb": "Storage",
  "carrier": "Carrier",
  "condition": "Grade",
  "price_usd": "Price"
}
```

### Gazelle Example

```csv
Product Name,Capacity,Network,Condition,Payout
Apple iPhone 15 Pro,256,Unlocked,Excellent,850.00
```

**Column mapping:**
```json
{
  "device_name": "Product Name",
  "storage_gb": "Capacity",
  "carrier": "Network",
  "condition": "Condition",
  "price_usd": "Payout"
}
```

## Condition Names

Match your buyer's condition names to Revend's standard conditions:

| Revend Condition | Common Aliases |
|------------------|----------------|
| **Excellent** | Like New, Mint, A+, Grade A |
| **Good** | Very Good, B+, Grade B |
| **Fair** | Average, C+, Grade C |
| **Poor** | Damaged, D, Grade D |

The import script uses fuzzy matching, so slight variations work automatically.

## Device Name Matching

The import script matches device names flexibly:

✅ **Works:**
- `iPhone 15 Pro`
- `iPhone15Pro`
- `iphone-15-pro`
- `Apple iPhone 15 Pro`

❌ **Doesn't work:**
- Typos: `iPhone 15 Pr0` (zero instead of O)
- Wrong model: `iPhone 15 Max` (should be "Pro Max")

If devices aren't matching, check the `device_families` table for exact names.

## Carrier Matching

Standard carriers:
- `Unlocked`
- `Verizon`
- `AT&T`
- `T-Mobile`
- `Sprint`

For non-phone devices, use:
- Tablets: `WiFi`, `Cellular`, `WiFi + Cellular`
- Laptops: `N/A`
- Watches: `GPS`, `Cellular`, `Bluetooth`

## Troubleshooting

### "No device match" errors

**Cause:** Device not in catalog or name mismatch

**Fix:**
1. Check device exists: `SELECT name FROM device_families WHERE name ILIKE '%iPhone 15%'`
2. Add device if missing: `npx tsx scripts/seed-top-devices.ts`
3. Update CSV to match exact name

### "No condition match" errors

**Cause:** Condition name doesn't match database

**Fix:**
1. Check conditions: `SELECT name FROM conditions`
2. Update CSV to use: `Excellent`, `Good`, `Fair`, or `Poor`

### Import succeeds but no offers appear

**Cause:** Wrong buyer_id or inactive offers

**Fix:**
1. Verify buyer: `SELECT id, slug FROM buyers WHERE slug = 'buybacktree'`
2. Check offers: `SELECT * FROM offers WHERE buyer_id = '<ID>' ORDER BY last_updated_at DESC`
3. Ensure `is_active = true`

## File Storage

CSV files can be:
- **Manual uploads** - Place in this `/data/` directory
- **Automated URL fetches** - Buyer provides public URL
- **FTP/SFTP** - Download to `/data/` via script

## Next Steps

After importing:
1. View offers in admin UI: `/admin/imports`
2. Test on frontend: Search for a device
3. Verify prices appear in comparison table
4. Set up automated sync: Configure in `buyer_integrations` table
