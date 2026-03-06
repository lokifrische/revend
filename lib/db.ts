// Server-side Supabase data fetching — wired to live DB
import { createClient } from '@supabase/supabase-js'

function getDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ─── Types returned from DB layer ─────────────────────────────────────────────

export type DbCategory = {
  id: string
  name: string
  slug: string
  icon: string
  sort_order: number
  deviceCount?: number
}

export type DbBrand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  sort_order: number
}

export type DbVariant = {
  id: string
  storage_gb: number
  carrier: string
  msrp_cents: number | null
}

export type DbFamily = {
  id: string
  name: string
  slug: string
  image_url: string | null
  released_year: number | null
  is_popular: boolean
  brand: string
  brandSlug: string
  brandLogo: string | null
  category: string
  categorySlug: string
  variants: DbVariant[]
  maxOfferCents: number
}

export type DbOffer = {
  deviceId: string
  storageGb: number
  conditionId: string
  conditionSlug: string
  conditionName: string
  priceMult: number
  offerCents: number
  buyerId: string
  buyerName: string
  buyerSlug: string
  buyerWebsite: string
  paymentMethods: string[]
  paymentSpeedDays: number
  trustScore: number
  isFeatured: boolean
  tagline: string
}

export type DbBuyer = {
  id: string
  name: string
  slug: string
  website: string
  logo_url: string | null
  tagline: string
  payment_methods: string[]
  payment_speed_days: number
  bbb_rating: string | null
  trust_score: number
  is_featured: boolean
}

// ─── Helper: format storage_gb to label ──────────────────────────────────────
function formatStorageGb(gb: number): string {
  if (!gb || gb === 0) return 'N/A'
  // Convention: <= 16 means TB (e.g. 1=1TB, 2=2TB, 4=4TB)
  if (gb <= 16) return `${gb}TB`
  return `${gb}GB`
}

// ─── Get max offer cents across all families via a join ───────────────────────
async function getMaxOffersByFamilyIds(familyIds: string[]): Promise<Record<string, number>> {
  if (familyIds.length === 0) return {}
  const db = getDb()
  const { data } = await db
    .from('offers')
    .select('offer_cents, devices!inner(family_id)')
    .in('devices.family_id', familyIds)
    .eq('is_active', true)

  const result: Record<string, number> = {}
  for (const row of (data || []) as any[]) {
    const fid = row.devices?.family_id
    if (fid && row.offer_cents > (result[fid] || 0)) {
      result[fid] = row.offer_cents
    }
  }
  return result
}

// ─── Convert raw family row to DbFamily ──────────────────────────────────────
function mapFamily(f: any, maxOfferCents: number): DbFamily {
  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    image_url: f.image_url,
    released_year: f.released_year,
    is_popular: f.is_popular,
    brand: f.brands?.name ?? '',
    brandSlug: f.brands?.slug ?? '',
    brandLogo: f.brands?.logo_url ?? null,
    category: f.categories?.name ?? '',
    categorySlug: f.categories?.slug ?? '',
    variants: (f.devices || []).map((d: any): DbVariant => ({
      id: d.id,
      storage_gb: d.storage_gb,
      carrier: d.carrier,
      msrp_cents: d.msrp_cents,
    })),
    maxOfferCents,
  }
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export async function getCategories(): Promise<DbCategory[]> {
  const db = getDb()
  const { data } = await db
    .from('categories')
    .select('id, name, slug, icon, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

export async function getCategoriesWithCounts(): Promise<DbCategory[]> {
  const db = getDb()
  const cats = await getCategories()

  // Count active families per category
  const { data: counts } = await db
    .from('device_families')
    .select('category_id')
    .eq('is_active', true)

  const countMap: Record<string, number> = {}
  for (const row of (counts || []) as any[]) {
    countMap[row.category_id] = (countMap[row.category_id] || 0) + 1
  }

  // Map category id → count
  const { data: catRows } = await db
    .from('categories')
    .select('id, slug')
    .eq('is_active', true)

  const idToSlug: Record<string, string> = {}
  for (const c of (catRows || []) as any[]) idToSlug[c.id] = c.slug

  return cats.map(cat => {
    const catRow = (catRows || []).find((c: any) => c.slug === cat.slug)
    return {
      ...cat,
      deviceCount: catRow ? (countMap[catRow.id] || 0) : 0,
    }
  })
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────
export async function getBrands(): Promise<DbBrand[]> {
  const db = getDb()
  const { data } = await db
    .from('brands')
    .select('id, name, slug, logo_url, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
}

export async function getBrandsByCategory(categorySlug: string): Promise<DbBrand[]> {
  const db = getDb()
  // Get distinct brands that have families in this category
  const { data: families } = await db
    .from('device_families')
    .select('brands!inner(id, name, slug, logo_url, sort_order), categories!inner(slug)')
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)

  if (!families) return []

  const seen = new Set<string>()
  const brands: DbBrand[] = []
  for (const f of families as any[]) {
    if (f.brands && !seen.has(f.brands.id)) {
      seen.add(f.brands.id)
      brands.push(f.brands)
    }
  }
  return brands.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99))
}

// ─── BUYERS ───────────────────────────────────────────────────────────────────
export async function getBuyers(): Promise<DbBuyer[]> {
  const db = getDb()
  const { data } = await db
    .from('buyers')
    .select('id, name, slug, website, logo_url, tagline, payment_methods, payment_speed_days, bbb_rating, trust_score, is_featured')
    .eq('is_active', true)
    .order('trust_score', { ascending: false })
  return (data || []) as DbBuyer[]
}

// ─── CONDITIONS ───────────────────────────────────────────────────────────────
export async function getConditions() {
  const db = getDb()
  const { data } = await db
    .from('conditions')
    .select('id, name, slug, description, icon, price_mult, sort_order')
    .order('sort_order')
  return data || []
}

// ─── DEVICE FAMILIES ──────────────────────────────────────────────────────────

export async function getPopularFamilies(limit = 12): Promise<DbFamily[]> {
  const db = getDb()
  const { data } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug, logo_url),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('is_active', true)
    .eq('is_popular', true)
    .order('released_year', { ascending: false })
    .limit(limit)

  if (!data) return []

  const maxOffers = await getMaxOffersByFamilyIds(data.map((f: any) => f.id))
  return data.map((f: any) => mapFamily(f, maxOffers[f.id] || 0))
}

export async function getFamiliesByCategory(categorySlug: string): Promise<DbFamily[]> {
  const db = getDb()
  const { data } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug, logo_url),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('is_active', true)
    .eq('categories.slug', categorySlug)
    .order('is_popular', { ascending: false })
    .order('released_year', { ascending: false })

  if (!data) return []

  const maxOffers = await getMaxOffersByFamilyIds(data.map((f: any) => f.id))
  return data.map((f: any) => mapFamily(f, maxOffers[f.id] || 0))
}

export async function getFamiliesByCategoryAndBrand(categorySlug: string, brandSlug: string): Promise<DbFamily[]> {
  const db = getDb()
  const { data } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug, logo_url),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('is_active', true)
    .eq('categories.slug', categorySlug)
    .eq('brands.slug', brandSlug)
    .order('is_popular', { ascending: false })
    .order('released_year', { ascending: false })

  if (!data) return []

  const maxOffers = await getMaxOffersByFamilyIds(data.map((f: any) => f.id))
  return data.map((f: any) => mapFamily(f, maxOffers[f.id] || 0))
}

// Get a single device family by slug (with variants)
export async function getDeviceFamilyBySlug(slug: string): Promise<DbFamily | null> {
  const db = getDb()
  const { data, error } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug, logo_url),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  const maxOffers = await getMaxOffersByFamilyIds([data.id])
  return mapFamily(data, maxOffers[data.id] || 0)
}

// Get all offers for all variants of a device family
export async function getAllOffersForFamily(familyId: string): Promise<DbOffer[]> {
  const db = getDb()
  const { data, error } = await db
    .from('offers')
    .select(`
      offer_cents,
      condition_id,
      devices!inner(id, storage_gb, carrier, family_id),
      conditions!inner(id, slug, name, price_mult),
      buyers!inner(id, name, slug, website, payment_methods, payment_speed_days, trust_score, is_featured, tagline)
    `)
    .eq('devices.family_id', familyId)
    .eq('is_active', true)
    .order('offer_cents', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map(o => ({
    deviceId: o.devices.id,
    storageGb: o.devices.storage_gb,
    conditionId: o.condition_id,
    conditionSlug: o.conditions.slug,
    conditionName: o.conditions.name,
    priceMult: o.conditions.price_mult,
    offerCents: o.offer_cents,
    buyerId: o.buyers.id,
    buyerName: o.buyers.name,
    buyerSlug: o.buyers.slug,
    buyerWebsite: o.buyers.website,
    paymentMethods: o.buyers.payment_methods || [],
    paymentSpeedDays: o.buyers.payment_speed_days || 3,
    trustScore: o.buyers.trust_score || 70,
    isFeatured: o.buyers.is_featured || false,
    tagline: o.buyers.tagline || '',
  }))
}

// Get offers for a single device variant + condition (for API route)
export async function getOffersForDevice(deviceId: string, conditionSlug: string): Promise<DbOffer[]> {
  const db = getDb()
  const { data, error } = await db
    .from('offers')
    .select(`
      offer_cents,
      condition_id,
      devices!inner(id, storage_gb, family_id),
      conditions!inner(id, slug, name, price_mult),
      buyers!inner(id, name, slug, website, payment_methods, payment_speed_days, trust_score, is_featured, tagline)
    `)
    .eq('device_id', deviceId)
    .eq('conditions.slug', conditionSlug)
    .eq('is_active', true)
    .order('offer_cents', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map(o => ({
    deviceId: o.devices.id,
    storageGb: o.devices.storage_gb,
    conditionId: o.condition_id,
    conditionSlug: o.conditions.slug,
    conditionName: o.conditions.name,
    priceMult: o.conditions.price_mult,
    offerCents: o.offer_cents,
    buyerId: o.buyers.id,
    buyerName: o.buyers.name,
    buyerSlug: o.buyers.slug,
    buyerWebsite: o.buyers.website,
    paymentMethods: o.buyers.payment_methods || [],
    paymentSpeedDays: o.buyers.payment_speed_days || 3,
    trustScore: o.buyers.trust_score || 70,
    isFeatured: o.buyers.is_featured || false,
    tagline: o.buyers.tagline || '',
  }))
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
export async function searchFamilies(query: string, limit = 8): Promise<DbFamily[]> {
  if (!query || query.length < 2) return []
  const db = getDb()
  const q = `%${query.toLowerCase()}%`

  const { data } = await db
    .from('device_families')
    .select(`
      id, name, slug, image_url, released_year, is_popular,
      brands!inner(name, slug, logo_url),
      categories!inner(name, slug),
      devices(id, storage_gb, carrier, msrp_cents)
    `)
    .eq('is_active', true)
    .ilike('name', q)
    .order('is_popular', { ascending: false })
    .order('released_year', { ascending: false })
    .limit(limit)

  if (!data) return []

  const maxOffers = await getMaxOffersByFamilyIds(data.map((f: any) => f.id))
  return data.map((f: any) => mapFamily(f, maxOffers[f.id] || 0))
}

// ─── LOG AFFILIATE CLICK ──────────────────────────────────────────────────────
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export { formatStorageGb }
