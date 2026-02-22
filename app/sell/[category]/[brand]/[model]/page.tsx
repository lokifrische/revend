import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDeviceFamilyBySlug, getAllOffersForFamily, getPopularFamilies, getConditions } from '@/lib/db'
import { dbFamilyToDevice, dbConditionToCondition } from '@/lib/adapters'
import DevicePageClient, { DeviceNotFound } from '@/components/sell/DevicePageClient'

interface Props {
  params: Promise<{ category: string; brand: string; model: string }>
  searchParams: Promise<{ condition?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params
  const family = await getDeviceFamilyBySlug(model)
  if (!family) return {}
  return {
    title: `Sell ${family.name} — Compare All Buyer Offers | Revend`,
    description: `See real offers from ${7}+ verified buyers for your ${family.name}. Ranked by price. Free shipping, paid in 1–5 days. Free to compare.`,
  }
}

export default async function DevicePage({ params, searchParams }: Props) {
  const { category, brand, model } = await params
  const { condition } = await searchParams

  // Fetch device family by slug
  const family = await getDeviceFamilyBySlug(model)

  if (!family) {
    return <DeviceNotFound />
  }

  // Fetch all data in parallel
  const [allOffers, popularFamilies, dbConditions] = await Promise.all([
    getAllOffersForFamily(family.id),
    getPopularFamilies(8),
    getConditions(),
  ])

  const conditions = dbConditions.map(dbConditionToCondition)

  // Fetch related devices (same brand, popular)
  const relatedDevices = popularFamilies
    .filter(f => f.brandSlug === family.brandSlug && f.id !== family.id)
    .slice(0, 4)
    .map(dbFamilyToDevice)

  return (
    <DevicePageClient
      family={{
        id: family.id,
        name: family.name,
        slug: family.slug,
        brand: family.brand,
        brandSlug: family.brandSlug,
        category: family.category,
        categorySlug: family.categorySlug,
        image: family.image_url,
        releasedYear: family.released_year,
        variants: family.variants.map(v => ({ id: v.id, storageGb: v.storage_gb })),
        maxOfferCents: family.maxOfferCents,
      }}
      allOffers={allOffers}
      conditions={conditions}
      initialCondition={condition ?? ''}
      relatedDevices={relatedDevices}
      categorySlug={category}
      brandSlug={brand}
    />
  )
}
