#!/usr/bin/env tsx

/**
 * Verify database has data
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function verify() {
  console.log('\n📊 Database Verification\n')
  console.log('='.repeat(80))

  // Brands
  const { data: brands, count: brandCount } = await supabase
    .from('brands')
    .select('*', { count: 'exact' })

  console.log(`\n✅ Brands: ${brandCount}`)
  brands?.slice(0, 5).forEach(b => console.log(`   - ${b.name} (${b.slug})`))

  // Categories
  const { data: categories, count: catCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })

  console.log(`\n✅ Categories: ${catCount}`)
  categories?.forEach(c => console.log(`   - ${c.icon} ${c.name} (${c.slug})`))

  // Conditions
  const { data: conditions, count: condCount } = await supabase
    .from('conditions')
    .select('*', { count: 'exact' })

  console.log(`\n✅ Conditions: ${condCount}`)
  conditions?.forEach(c => console.log(`   - ${c.icon} ${c.name} (${c.slug})`))

  // Device Families
  const { data: families, count: familyCount } = await supabase
    .from('device_families')
    .select('id, name, slug, released_year, is_popular', { count: 'exact' })
    .order('released_year', { ascending: false })

  console.log(`\n✅ Device Families: ${familyCount}`)
  families?.slice(0, 10).forEach(f =>
    console.log(`   - ${f.name} (${f.released_year})${f.is_popular ? ' ⭐' : ''}`)
  )

  // Devices (variants)
  const { data: devices, count: deviceCount } = await supabase
    .from('devices')
    .select('id', { count: 'exact' })

  console.log(`\n✅ Device Variants: ${deviceCount}`)

  // Sample device with family
  const { data: sampleDevices } = await supabase
    .from('devices')
    .select(`
      id,
      storage_gb,
      carrier,
      device_families (name, slug)
    `)
    .limit(5)

  sampleDevices?.forEach(d =>
    console.log(`   - ${(d.device_families as any).name} ${d.storage_gb}GB ${d.carrier}`)
  )

  // Buyers
  const { data: buyers, count: buyerCount } = await supabase
    .from('buyers')
    .select('*', { count: 'exact' })

  console.log(`\n✅ Buyers: ${buyerCount || 0}`)
  if (buyers && buyers.length > 0) {
    buyers.slice(0, 5).forEach(b => console.log(`   - ${b.name} (${b.slug})`))
  } else {
    console.log('   ⚠️  No buyers yet - need to seed or import')
  }

  // Offers
  const { count: offerCount } = await supabase
    .from('offers')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ Offers: ${offerCount || 0}`)
  if (offerCount === 0) {
    console.log('   ⚠️  No offers yet - need to import buyer pricing')
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📋 Summary:')
  console.log(`   Core Data: ${brandCount} brands, ${catCount} categories, ${condCount} conditions`)
  console.log(`   Devices: ${familyCount} families, ${deviceCount} variants`)
  console.log(`   Commerce: ${buyerCount || 0} buyers, ${offerCount || 0} offers`)

  if (buyerCount === 0) {
    console.log('\n⚠️  Next step: Seed buyer data or import CSV pricing')
  } else if (offerCount === 0) {
    console.log('\n⚠️  Next step: Import buyer pricing CSV files')
  } else {
    console.log('\n✅ Database is ready for production!')
  }

  console.log()
}

verify()
