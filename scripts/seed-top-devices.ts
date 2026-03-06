#!/usr/bin/env tsx

/**
 * Seed Top 50 Devices
 *
 * Seeds the database with the top 50 most-traded devices
 * Priority list based on market volume and demand
 *
 * Usage:
 *   npx tsx scripts/seed-top-devices.ts [--dry-run]
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================================
// Top 50 Device List (Priority Order)
// ============================================================================

interface TopDevice {
  family_name: string
  brand: string
  category: string
  storage_variants: number[] // GB
  carriers?: string[]
  released_year?: number
  priority: number // 1 = highest
}

const TOP_50_DEVICES: TopDevice[] = [
  // === PHONES (40 devices) ===

  // iPhone 15 Series (Released 2023)
  { family_name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Phones', storage_variants: [256, 512, 1024], released_year: 2023, priority: 1 },
  { family_name: 'iPhone 15 Pro', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512, 1024], released_year: 2023, priority: 2 },
  { family_name: 'iPhone 15 Plus', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2023, priority: 3 },
  { family_name: 'iPhone 15', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2023, priority: 4 },

  // iPhone 14 Series (Released 2022)
  { family_name: 'iPhone 14 Pro Max', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512, 1024], released_year: 2022, priority: 5 },
  { family_name: 'iPhone 14 Pro', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512, 1024], released_year: 2022, priority: 6 },
  { family_name: 'iPhone 14 Plus', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2022, priority: 7 },
  { family_name: 'iPhone 14', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2022, priority: 8 },

  // iPhone 13 Series (Released 2021)
  { family_name: 'iPhone 13 Pro Max', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512, 1024], released_year: 2021, priority: 9 },
  { family_name: 'iPhone 13 Pro', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512, 1024], released_year: 2021, priority: 10 },
  { family_name: 'iPhone 13', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2021, priority: 11 },
  { family_name: 'iPhone 13 Mini', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2021, priority: 12 },

  // iPhone 12 Series (Released 2020)
  { family_name: 'iPhone 12 Pro Max', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2020, priority: 13 },
  { family_name: 'iPhone 12 Pro', brand: 'Apple', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2020, priority: 14 },
  { family_name: 'iPhone 12', brand: 'Apple', category: 'Phones', storage_variants: [64, 128, 256], released_year: 2020, priority: 15 },

  // iPhone SE & Other
  { family_name: 'iPhone SE (3rd gen)', brand: 'Apple', category: 'Phones', storage_variants: [64, 128, 256], released_year: 2022, priority: 16 },

  // Samsung Galaxy S24 Series (Released 2024)
  { family_name: 'Galaxy S24 Ultra', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512, 1024], released_year: 2024, priority: 17 },
  { family_name: 'Galaxy S24+', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512], released_year: 2024, priority: 18 },
  { family_name: 'Galaxy S24', brand: 'Samsung', category: 'Phones', storage_variants: [128, 256], released_year: 2024, priority: 19 },

  // Samsung Galaxy S23 Series (Released 2023)
  { family_name: 'Galaxy S23 Ultra', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512, 1024], released_year: 2023, priority: 20 },
  { family_name: 'Galaxy S23+', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512], released_year: 2023, priority: 21 },
  { family_name: 'Galaxy S23', brand: 'Samsung', category: 'Phones', storage_variants: [128, 256], released_year: 2023, priority: 22 },

  // Samsung Foldables
  { family_name: 'Galaxy Z Fold 5', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512, 1024], released_year: 2023, priority: 23 },
  { family_name: 'Galaxy Z Flip 5', brand: 'Samsung', category: 'Phones', storage_variants: [256, 512], released_year: 2023, priority: 24 },

  // Google Pixel Series
  { family_name: 'Pixel 9 Pro XL', brand: 'Google', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2024, priority: 25 },
  { family_name: 'Pixel 9 Pro', brand: 'Google', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2024, priority: 26 },
  { family_name: 'Pixel 9', brand: 'Google', category: 'Phones', storage_variants: [128, 256], released_year: 2024, priority: 27 },
  { family_name: 'Pixel 8 Pro', brand: 'Google', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2023, priority: 28 },
  { family_name: 'Pixel 8', brand: 'Google', category: 'Phones', storage_variants: [128, 256], released_year: 2023, priority: 29 },
  { family_name: 'Pixel 7 Pro', brand: 'Google', category: 'Phones', storage_variants: [128, 256, 512], released_year: 2022, priority: 30 },

  // OnePlus
  { family_name: 'OnePlus 12', brand: 'OnePlus', category: 'Phones', storage_variants: [256, 512], released_year: 2024, priority: 31 },
  { family_name: 'OnePlus 11', brand: 'OnePlus', category: 'Phones', storage_variants: [128, 256], released_year: 2023, priority: 32 },

  // Motorola
  { family_name: 'Razr+', brand: 'Motorola', category: 'Phones', storage_variants: [256], released_year: 2023, priority: 33 },

  // Nothing
  { family_name: 'Nothing Phone 2', brand: 'Nothing', category: 'Phones', storage_variants: [256, 512], released_year: 2023, priority: 34 },

  // === TABLETS (6 devices) ===

  { family_name: 'iPad Pro 12.9" (6th gen)', brand: 'Apple', category: 'Tablets', storage_variants: [128, 256, 512, 1024, 2048], released_year: 2022, priority: 35 },
  { family_name: 'iPad Pro 11" (4th gen)', brand: 'Apple', category: 'Tablets', storage_variants: [128, 256, 512, 1024, 2048], released_year: 2022, priority: 36 },
  { family_name: 'iPad Air (5th gen)', brand: 'Apple', category: 'Tablets', storage_variants: [64, 256], released_year: 2022, priority: 37 },
  { family_name: 'iPad (10th gen)', brand: 'Apple', category: 'Tablets', storage_variants: [64, 256], released_year: 2022, priority: 38 },
  { family_name: 'Galaxy Tab S9 Ultra', brand: 'Samsung', category: 'Tablets', storage_variants: [256, 512, 1024], released_year: 2023, priority: 39 },
  { family_name: 'Galaxy Tab S9', brand: 'Samsung', category: 'Tablets', storage_variants: [128, 256], released_year: 2023, priority: 40 },

  // === WATCHES (4 devices) ===

  { family_name: 'Apple Watch Series 9', brand: 'Apple', category: 'Watches', storage_variants: [32, 64], released_year: 2023, priority: 41 },
  { family_name: 'Apple Watch Ultra 2', brand: 'Apple', category: 'Watches', storage_variants: [64], released_year: 2023, priority: 42 },
  { family_name: 'Apple Watch SE (2nd gen)', brand: 'Apple', category: 'Watches', storage_variants: [32], released_year: 2022, priority: 43 },
  { family_name: 'Galaxy Watch 6', brand: 'Samsung', category: 'Watches', storage_variants: [16, 32], released_year: 2023, priority: 44 },

  // === LAPTOPS (6 devices) ===

  { family_name: 'MacBook Air M2', brand: 'Apple', category: 'Laptops', storage_variants: [256, 512, 1024, 2048], released_year: 2022, priority: 45 },
  { family_name: 'MacBook Pro 14" M3', brand: 'Apple', category: 'Laptops', storage_variants: [512, 1024, 2048, 4096], released_year: 2023, priority: 46 },
  { family_name: 'MacBook Pro 16" M3', brand: 'Apple', category: 'Laptops', storage_variants: [512, 1024, 2048, 4096], released_year: 2023, priority: 47 },
  { family_name: 'Surface Laptop 5', brand: 'Microsoft', category: 'Laptops', storage_variants: [256, 512, 1024], released_year: 2022, priority: 48 },
  { family_name: 'Dell XPS 13', brand: 'Dell', category: 'Laptops', storage_variants: [256, 512, 1024], released_year: 2023, priority: 49 },
  { family_name: 'HP Spectre x360', brand: 'HP', category: 'Laptops', storage_variants: [512, 1024, 2048], released_year: 2023, priority: 50 },
]

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedDevice(device: TopDevice, dryRun: boolean) {
  console.log(`\n📱 ${device.family_name}`)

  // Get or create brand
  let brandId: string

  const { data: existingBrand } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', device.brand)
    .single()

  if (existingBrand) {
    brandId = existingBrand.id
    console.log(`   ✅ Brand exists: ${device.brand}`)
  } else {
    if (dryRun) {
      console.log(`   🧪 Would create brand: ${device.brand}`)
      return
    }

    const { data: newBrand, error } = await supabase
      .from('brands')
      .insert({
        name: device.brand,
        slug: device.brand.toLowerCase().replace(/\s+/g, '-'),
        is_active: true,
        sort_order: 0,
      })
      .select()
      .single()

    if (error) {
      console.log(`   ❌ Failed to create brand: ${error.message}`)
      return
    }

    brandId = newBrand.id
    console.log(`   ✅ Created brand: ${device.brand}`)
  }

  // Get category
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', device.category)
    .single()

  if (!category) {
    console.log(`   ❌ Category not found: ${device.category}`)
    return
  }

  // Create or get device family
  const familySlug = device.family_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let familyId: string

  const { data: existingFamily } = await supabase
    .from('device_families')
    .select('id')
    .eq('slug', familySlug)
    .single()

  if (existingFamily) {
    familyId = existingFamily.id
    console.log(`   ℹ️  Family exists, skipping`)
    return // Skip if already exists
  } else {
    if (dryRun) {
      console.log(`   🧪 Would create family: ${device.family_name}`)
      console.log(`      Storage variants: ${device.storage_variants.join(', ')}GB`)
      return
    }

    const { data: newFamily, error } = await supabase
      .from('device_families')
      .insert({
        brand_id: brandId,
        category_id: category.id,
        name: device.family_name,
        slug: familySlug,
        released_year: device.released_year,
        is_popular: device.priority <= 20, // Top 20 are popular
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.log(`   ❌ Failed to create family: ${error.message}`)
      return
    }

    familyId = newFamily.id
    console.log(`   ✅ Created family: ${device.family_name}`)
  }

  // Create device variants (storage × carrier)
  const carriers = device.carriers || ['Unlocked']

  for (const storage of device.storage_variants) {
    for (const carrier of carriers) {
      if (dryRun) {
        console.log(`      🧪 Would create: ${storage}GB ${carrier}`)
        continue
      }

      const { error } = await supabase.from('devices').insert({
        family_id: familyId,
        storage_gb: storage,
        carrier,
        is_active: true,
      })

      if (error && !error.message.includes('unique')) {
        console.log(`      ❌ Failed to create variant: ${storage}GB ${carrier}`)
      } else if (!error) {
        console.log(`      ✅ Created: ${storage}GB ${carrier}`)
      }
    }
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('\n' + '='.repeat(80))
  console.log('🚀 Seed Top 50 Devices')
  console.log('='.repeat(80))
  console.log(`Mode: ${dryRun ? '🧪 DRY RUN (no changes)' : '✅ LIVE (will insert)'}`)
  console.log('='.repeat(80))

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n❌ Missing environment variables:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL')
    console.error('   SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  for (const device of TOP_50_DEVICES) {
    await seedDevice(device, dryRun)
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Seeding complete!')
  console.log('='.repeat(80))

  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN - no data was written.')
    console.log('   Run without --dry-run to actually insert devices.')
  } else {
    console.log('\n✨ Next steps:')
    console.log('   1. Fetch device images: npx tsx scripts/fetch-device-images.ts')
    console.log('   2. Get buyer CSV feeds')
    console.log('   3. Import pricing: npx tsx scripts/import-buyer-csv.ts <buyer> <csv>')
  }

  console.log('')
}

// Run if called directly
if (require.main === module) {
  main()
}
