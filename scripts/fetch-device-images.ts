#!/usr/bin/env tsx

/**
 * Device Image Fetching Script
 *
 * Fetches high-quality device images from various sources:
 * 1. MobileAPI.dev (recommended - $29/mo)
 * 2. Manual URLs from manufacturer sites (free)
 * 3. Fallback to placeholder
 *
 * Usage:
 *   npx tsx scripts/fetch-device-images.ts [--source=mobile-api|manual] [--limit=N]
 *
 * Examples:
 *   npx tsx scripts/fetch-device-images.ts --source=mobile-api
 *   npx tsx scripts/fetch-device-images.ts --source=manual --limit=10
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import https from 'https'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================================================
// Configuration
// ============================================================================

const MOBILE_API_KEY = process.env.MOBILE_API_KEY
const MOBILE_API_BASE_URL = 'https://api.mobileapi.dev/v1'
const IMAGE_OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'devices')

// Ensure output directory exists
if (!fs.existsSync(IMAGE_OUTPUT_DIR)) {
  fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true })
}

// ============================================================================
// MobileAPI.dev Integration
// ============================================================================

interface MobileAPIDevice {
  name: string
  brand: string
  images: string[]
  storage_options?: number[]
  colors?: string[]
}

async function fetchFromMobileAPI(deviceName: string): Promise<MobileAPIDevice | null> {
  if (!MOBILE_API_KEY) {
    console.error('❌ MOBILE_API_KEY not set in environment')
    return null
  }

  try {
    const response = await fetch(
      `${MOBILE_API_BASE_URL}/devices/search?q=${encodeURIComponent(deviceName)}`,
      {
        headers: {
          Authorization: `Bearer ${MOBILE_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      console.error(`MobileAPI error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    if (!data || !data.devices || data.devices.length === 0) {
      return null
    }

    return data.devices[0] // Return best match
  } catch (err) {
    console.error('MobileAPI fetch failed:', err)
    return null
  }
}

// ============================================================================
// Image Download
// ============================================================================

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          console.error(`Failed to download: ${response.statusCode}`)
          resolve(false)
          return
        }

        const fileStream = fs.createWriteStream(outputPath)
        response.pipe(fileStream)

        fileStream.on('finish', () => {
          fileStream.close()
          resolve(true)
        })

        fileStream.on('error', err => {
          console.error('File write error:', err)
          fs.unlinkSync(outputPath)
          resolve(false)
        })
      })
      .on('error', err => {
        console.error('Download error:', err)
        resolve(false)
      })
  })
}

// ============================================================================
// Manual Image URLs (Free Alternative)
// ============================================================================

// Pre-mapped URLs for top devices (scraped from manufacturer sites)
const MANUAL_IMAGE_URLS: Record<string, string> = {
  'iphone-15-pro': 'https://www.apple.com/v/iphone-15-pro/c/images/overview/closer-look/finish_natural_titanium_large_2x.jpg',
  'iphone-15-pro-max': 'https://www.apple.com/v/iphone-15-pro/c/images/overview/closer-look/finish_natural_titanium_large_2x.jpg',
  'iphone-15': 'https://www.apple.com/v/iphone-15/b/images/overview/closer-look/finish_pink_large_2x.jpg',
  'iphone-15-plus': 'https://www.apple.com/v/iphone-15/b/images/overview/closer-look/finish_pink_large_2x.jpg',
  'iphone-14-pro': 'https://www.apple.com/v/iphone-14-pro/a/images/overview/finish/finish_space_black_large_2x.jpg',
  'iphone-14-pro-max': 'https://www.apple.com/v/iphone-14-pro/a/images/overview/finish/finish_space_black_large_2x.jpg',
  'iphone-14': 'https://www.apple.com/v/iphone-14/b/images/overview/finish/finish_blue_large_2x.jpg',
  'iphone-14-plus': 'https://www.apple.com/v/iphone-14/b/images/overview/finish/finish_blue_large_2x.jpg',

  // Add more as needed...
}

// ============================================================================
// Main Processing
// ============================================================================

async function processDevice(
  familyId: string,
  familyName: string,
  familySlug: string,
  source: 'mobile-api' | 'manual'
) {
  console.log(`\n📱 Processing: ${familyName}`)

  let imageUrl: string | null = null
  let localPath: string | null = null

  if (source === 'mobile-api') {
    // Try MobileAPI.dev
    const deviceData = await fetchFromMobileAPI(familyName)

    if (deviceData && deviceData.images && deviceData.images.length > 0) {
      const remoteImageUrl = deviceData.images[0] // Use first image
      const fileName = `${familySlug}.jpg`
      localPath = path.join(IMAGE_OUTPUT_DIR, fileName)

      console.log(`   Downloading from MobileAPI...`)
      const success = await downloadImage(remoteImageUrl, localPath)

      if (success) {
        imageUrl = `/images/devices/${fileName}`
        console.log(`   ✅ Downloaded: ${imageUrl}`)
      } else {
        console.log(`   ❌ Download failed`)
      }
    } else {
      console.log(`   ⚠️  No images found on MobileAPI`)
    }
  } else if (source === 'manual') {
    // Use manual mapping
    const remoteImageUrl = MANUAL_IMAGE_URLS[familySlug]

    if (remoteImageUrl) {
      const fileName = `${familySlug}.jpg`
      localPath = path.join(IMAGE_OUTPUT_DIR, fileName)

      console.log(`   Downloading from manufacturer site...`)
      const success = await downloadImage(remoteImageUrl, localPath)

      if (success) {
        imageUrl = `/images/devices/${fileName}`
        console.log(`   ✅ Downloaded: ${imageUrl}`)
      } else {
        console.log(`   ❌ Download failed`)
      }
    } else {
      console.log(`   ⚠️  No manual URL configured for ${familySlug}`)
    }
  }

  // Update database
  if (imageUrl) {
    const { error } = await supabase
      .from('device_families')
      .update({ image_url: imageUrl })
      .eq('id', familyId)

    if (error) {
      console.log(`   ❌ Database update failed: ${error.message}`)
    } else {
      console.log(`   ✅ Database updated`)
    }
  }

  // Rate limit: 1 request/second
  await new Promise(resolve => setTimeout(resolve, 1000))
}

async function main() {
  const args = process.argv.slice(2)

  let source: 'mobile-api' | 'manual' = 'mobile-api'
  let limit: number | null = null

  for (const arg of args) {
    if (arg.startsWith('--source=')) {
      const value = arg.split('=')[1]
      if (value === 'mobile-api' || value === 'manual') {
        source = value
      }
    }
    if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1])
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('🖼️  Device Image Fetcher')
  console.log('='.repeat(80))
  console.log(`Source: ${source}`)
  console.log(`Limit: ${limit || 'All devices'}`)
  console.log('='.repeat(80))

  if (source === 'mobile-api' && !MOBILE_API_KEY) {
    console.error('\n❌ MOBILE_API_KEY environment variable not set')
    console.error('   Get an API key at: https://mobileapi.dev/pricing')
    console.error('   Then add to .env.local: MOBILE_API_KEY=your_key_here')
    process.exit(1)
  }

  // Fetch device families from database
  let query = supabase
    .from('device_families')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .is('image_url', null) // Only fetch families without images
    .order('name')

  if (limit) {
    query = query.limit(limit)
  }

  const { data: families, error } = await query

  if (error) {
    console.error('Database error:', error)
    process.exit(1)
  }

  if (!families || families.length === 0) {
    console.log('\n✅ All devices already have images!')
    process.exit(0)
  }

  console.log(`\nFound ${families.length} device families without images\n`)

  for (const family of families) {
    await processDevice(family.id, family.name, family.slug, source)
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Image fetching complete!')
  console.log('='.repeat(80) + '\n')
}

// Run if called directly
if (require.main === module) {
  main()
}
