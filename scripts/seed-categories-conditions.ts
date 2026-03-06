#!/usr/bin/env tsx

/**
 * Seed Categories & Conditions
 *
 * Seeds the database with categories and conditions using Lucide icon names
 * Run this BEFORE seeding devices
 *
 * Usage:
 *   npx tsx scripts/seed-categories-conditions.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================================
// Categories with Lucide Icons
// ============================================================================

const CATEGORIES = [
  {
    name: 'Phones',
    slug: 'phones',
    icon: 'Smartphone',
    sort_order: 1,
  },
  {
    name: 'Tablets',
    slug: 'tablets',
    icon: 'Tablet',
    sort_order: 2,
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    icon: 'Laptop',
    sort_order: 3,
  },
  {
    name: 'Watches',
    slug: 'watches',
    icon: 'Watch',
    sort_order: 4,
  },
  {
    name: 'Consoles',
    slug: 'consoles',
    icon: 'Gamepad2',
    sort_order: 5,
  },
  {
    name: 'Headphones',
    slug: 'headphones',
    icon: 'Headphones',
    sort_order: 6,
  },
]

// ============================================================================
// Conditions with Lucide Icons
// ============================================================================

const CONDITIONS = [
  {
    name: 'Like New',
    slug: 'like-new',
    icon: 'Sparkles',
    description: 'Flawless condition. No scratches, dents, or wear. Looks brand new.',
    price_mult: 1.0,
    sort_order: 1,
  },
  {
    name: 'Good',
    slug: 'good',
    icon: 'Check',
    description: 'Light wear. Minor scratches that are barely visible. Fully functional.',
    price_mult: 0.85,
    sort_order: 2,
  },
  {
    name: 'Fair',
    slug: 'fair',
    icon: 'AlertCircle',
    description: 'Moderate wear. Visible scratches or small dents. Everything works perfectly.',
    price_mult: 0.70,
    sort_order: 3,
  },
  {
    name: 'Poor',
    slug: 'poor',
    icon: 'XCircle',
    description: 'Heavy wear. Significant cosmetic damage but still functional.',
    price_mult: 0.55,
    sort_order: 4,
  },
  {
    name: 'Broken',
    slug: 'broken',
    icon: 'Wrench',
    description: 'Cracked screen, won\'t turn on, or major functional issues.',
    price_mult: 0.30,
    sort_order: 5,
  },
]

// ============================================================================
// Seeding Functions
// ============================================================================

async function seedCategories() {
  console.log('\n📂 Seeding Categories...')

  for (const category of CATEGORIES) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.slug)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          icon: category.icon,
          sort_order: category.sort_order,
        })
        .eq('slug', category.slug)

      if (error) {
        console.log(`   ❌ Failed to update ${category.name}: ${error.message}`)
      } else {
        console.log(`   ✅ Updated: ${category.name} (icon: ${category.icon})`)
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('categories')
        .insert(category)

      if (error) {
        console.log(`   ❌ Failed to create ${category.name}: ${error.message}`)
      } else {
        console.log(`   ✅ Created: ${category.name} (icon: ${category.icon})`)
      }
    }
  }
}

async function seedConditions() {
  console.log('\n🎯 Seeding Conditions...')

  for (const condition of CONDITIONS) {
    const { data: existing } = await supabase
      .from('conditions')
      .select('id')
      .eq('slug', condition.slug)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('conditions')
        .update({
          name: condition.name,
          icon: condition.icon,
          description: condition.description,
          price_mult: condition.price_mult,
          sort_order: condition.sort_order,
        })
        .eq('slug', condition.slug)

      if (error) {
        console.log(`   ❌ Failed to update ${condition.name}: ${error.message}`)
      } else {
        console.log(`   ✅ Updated: ${condition.name} (icon: ${condition.icon})`)
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('conditions')
        .insert(condition)

      if (error) {
        console.log(`   ❌ Failed to create ${condition.name}: ${error.message}`)
      } else {
        console.log(`   ✅ Created: ${condition.name} (icon: ${condition.icon})`)
      }
    }
  }
}

async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('🚀 Seed Categories & Conditions with Lucide Icons')
  console.log('='.repeat(80))

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n❌ Missing environment variables:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL')
    console.error('   SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  await seedCategories()
  await seedConditions()

  console.log('\n' + '='.repeat(80))
  console.log('✅ Seeding complete!')
  console.log('='.repeat(80))
  console.log('\n✨ Next step:')
  console.log('   npx tsx scripts/seed-top-devices.ts')
  console.log('')
}

// Run if called directly
if (require.main === module) {
  main()
}
