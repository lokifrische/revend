// Server-side Supabase data fetching
import { createClient } from '@supabase/supabase-js'

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export type DeviceRow = {
  id: string
  familyId: string
  familySlug: string
  name: string
  brand: string
  brandSlug: string
  category: string
  categorySlug: string
  image: string
  storageGb: number | null
  carrier: string
  msrpCents: number | null
  releasedYear: number | null
  isPopular: boolean
  maxOffer: number
}

export type OfferRow = {
  buyerId: string
  buyerName: string
  buyerSlug: string
  buyerWebsite: string
  paymentMethods: string[]
  paymentSpeedDays: number
  trustScore: number
  isFeatured: boolean
  conditionSlug: string
  conditionName: string
  offerCents: number
}

// ── Fetch all device families (for homepage/listings) ─────────
export async function getDeviceFamilies(opts?: {
  categorySlug?: string
  brandSlug?: string
  popularOnly?: boolean
  limit?: number
}): Promise<DeviceRow[]> {
  const db = getDb()
  
  let q = db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier)
    `)
    .eq('is_active', true)
    .order('is_popular', { ascending: false })
    .order('released_year', { ascending: false })

  if (opts?.categorySlug) q = q.eq('categories.slug', opts.categorySlug)
  if (opts?.brandSlug)    q = q.eq('brands.slug', opts.brandSlug)
  if (opts?.popularOnly)  q = q.eq('is_popular', true)
  if (opts?.limit)        q = q.limit(opts.limit)

  const { data, error } = await q
  if (error || !data) return []

  // Get max offers for each family
  const familyIds = data.map(f => f.id)
  const { data: offerData } = await db
    .from('offers')
    .select('devices!inner(family_id), offer_cents')
    .in('devices.family_id', familyIds)
    .eq('is_active', true)

  const maxOfferByFamily: Record<string, number> = {}
  offerData?.forEach((o: any) => {
    const fid = o.devices?.family_id
    if (fid && (o.offer_cents > (maxOfferByFamily[fid] || 0))) {
      maxOfferByFamily[fid] = o.offer_cents
    }
  })

  return data.map((f: any) => ({
    id: f.id,
    familyId: f.id,
    familySlug: f.slug,
    name: f.name,
    brand: f.brands.name,
    brandSlug: f.brands.slug,
    category: f.categories.name,
    categorySlug: f.categories.slug,
    image: f.image_url || '/images/placeholder.png',
    storageGb: null,
    carrier: 'unlocked',
    msrpCents: null,
    releasedYear: f.released_year,
    isPopular: f.is_popular,
    maxOffer: maxOfferByFamily[f.id] || 0,
  }))
}

// ── Fetch device family by slug ────────────────────────────────
export async function getDeviceFamily(slug: string) {
  const db = getDb()
  const { data, error } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return null
  return data
}

// ── Fetch offers for a specific device variant ─────────────────
export async function getOffersForDevice(deviceId: string, conditionSlug: string): Promise<OfferRow[]> {
  const db = getDb()
  
  const { data, error } = await db
    .from('offers')
    .select(`
      offer_cents,
      conditions!inner(slug, name),
      buyers!inner(id, name, slug, website, payment_methods, payment_speed_days, trust_score, is_featured)
    `)
    .eq('device_id', deviceId)
    .eq('conditions.slug', conditionSlug)
    .eq('is_active', true)
    .order('offer_cents', { ascending: false })

  if (error || !data) return []

  return data.map((o: any) => ({
    buyerId: o.buyers.id,
    buyerName: o.buyers.name,
    buyerSlug: o.buyers.slug,
    buyerWebsite: o.buyers.website,
    paymentMethods: o.buyers.payment_methods || [],
    paymentSpeedDays: o.buyers.payment_speed_days || 3,
    trustScore: o.buyers.trust_score || 70,
    isFeatured: o.buyers.is_featured,
    conditionSlug: o.conditions.slug,
    conditionName: o.conditions.name,
    offerCents: o.offer_cents,
  }))
}

// ── Fetch all offers for a device (all conditions) ─────────────
export async function getAllOffersForDevice(deviceId: string) {
  const db = getDb()
  const { data } = await db
    .from('offers')
    .select(`offer_cents, conditions(slug, name), buyers(id, name, slug, website, payment_methods, payment_speed_days, trust_score, is_featured)`)
    .eq('device_id', deviceId)
    .eq('is_active', true)
    .order('offer_cents', { ascending: false })
  return data || []
}

// ── Log affiliate click ────────────────────────────────────────
export async function logClick(opts: {
  deviceId?: string
  buyerId?: string
  conditionId?: string
  offerCents?: number
  sessionId?: string
}) {
  const db = getDb()
  await db.from('affiliate_clicks').insert({
    device_id: opts.deviceId,
    buyer_id: opts.buyerId,
    condition_id: opts.conditionId,
    offer_cents: opts.offerCents,
    session_id: opts.sessionId,
  })
}

// ── Get categories with device counts ─────────────────────────
export async function getCategories() {
  const db = getDb()
  const { data } = await db
    .from('categories')
    .select('id, name, slug, icon, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

// ── Get brands ────────────────────────────────────────────────
export async function getBrands() {
  const db = getDb()
  const { data } = await db
    .from('brands')
    .select('id, name, slug, logo_url, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

// ── Get conditions ────────────────────────────────────────────
export async function getConditions() {
  const db = getDb()
  const { data } = await db
    .from('conditions')
    .select('id, name, slug, description, icon, price_mult, sort_order')
    .order('sort_order')
  return data || []
}
