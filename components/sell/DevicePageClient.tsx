'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowLeft, Star, Package, Clock, Smartphone, Tablet, Laptop, Watch, Gamepad2, Headphones } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ConditionWizard from '@/components/comparison/ConditionWizard'
import ComparisonTable from '@/components/comparison/ComparisonTable'
import ImpactStrip from '@/components/shared/ImpactStrip'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { type Condition } from '@/lib/data'
import { filterAndAdaptOffers } from '@/lib/adapters'
import type { DbOffer } from '@/lib/db'
import type { Device } from '@/lib/data'
import { getIcon } from '@/lib/icon-map'

interface DevicePageClientProps {
  family: {
    id: string
    name: string
    slug: string
    brand: string
    brandSlug: string
    category: string
    categorySlug: string
    image: string | null
    releasedYear: number | null
    variants: { id: string; storageGb: number }[]
    maxOfferCents: number
  }
  allOffers: DbOffer[]
  conditions: Condition[]
  initialCondition: string
  relatedDevices: Device[]
  categorySlug: string
  brandSlug: string
}

// Map category slugs to Lucide icon names
const categoryIconMap: Record<string, string> = {
  phones: 'Smartphone',
  tablets: 'Tablet',
  laptops: 'Laptop',
  smartwatches: 'Watch',
  watches: 'Watch',
  consoles: 'Gamepad2',
  headphones: 'Headphones',
}

function formatStorageGb(gb: number): string {
  if (!gb) return 'N/A'
  if (gb <= 16) return `${gb}TB`
  return `${gb}GB`
}

export default function DevicePageClient({
  family,
  allOffers,
  conditions,
  initialCondition,
  relatedDevices,
  categorySlug,
  brandSlug,
}: DevicePageClientProps) {
  const router = useRouter()
  const [selectedCondition, setSelectedCondition] = useState(initialCondition)
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    family.variants[0]?.id ?? '',
  )
  const [imgError, setImgError] = useState(false)

  const iconName = categoryIconMap[categorySlug] ?? 'Package'
  const CategoryIcon = getIcon(iconName)

  // Build unique storage labels + variant ID map
  const storageOptions = family.variants.map(v => ({
    id: v.id,
    label: formatStorageGb(v.storageGb),
  }))

  // Get offers for selected variant + condition
  const offers = selectedCondition
    ? filterAndAdaptOffers(allOffers, selectedCondition, selectedVariantId || undefined)
    : []

  const bestOfferPrice = offers[0]?.offerPrice ?? Math.round(family.maxOfferCents / 100)

  const handleConditionSelect = (slug: string) => {
    setSelectedCondition(slug)
    router.replace(
      `/sell/${categorySlug}/${brandSlug}/${family.slug}?condition=${slug}`,
      { scroll: false },
    )
  }

  // Displayed max offer: best real offer if condition selected, else family max
  const displayPrice = selectedCondition && offers.length > 0
    ? bestOfferPrice
    : Math.round(family.maxOfferCents / 100)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />

      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/sell/${categorySlug}`}
                className="hover:text-teal-600 transition-colors capitalize"
              >
                {categorySlug}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/sell/${categorySlug}/${brandSlug}`}
                className="hover:text-teal-600 transition-colors capitalize"
              >
                {family.brand}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy-800 font-medium">{family.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left column — device info ───────────────── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Device card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative">
                  {!imgError && family.image ? (
                    <Image
                      src={family.image}
                      alt={family.name}
                      width={280}
                      height={280}
                      className="object-contain w-full h-full drop-shadow-xl"
                      onError={() => setImgError(true)}
                      priority
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                      <CategoryIcon className="w-16 h-16 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-1">{family.brand}</p>
                  <h1 className="text-xl font-bold text-navy-800 mb-3">{family.name}</h1>

                  {/* Offer price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-teal-600">
                      {displayPrice > 0 ? `$${displayPrice}` : '—'}
                    </span>
                    <span className="text-sm text-slate-400">
                      {selectedCondition ? 'best offer' : 'up to'}
                    </span>
                  </div>

                  {/* Storage selector */}
                  {storageOptions.length > 1 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Storage</p>
                      <div className="flex flex-wrap gap-2">
                        {storageOptions.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedVariantId(opt.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              selectedVariantId === opt.id
                                ? 'border-teal-400 bg-teal-50 text-teal-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick stats */}
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-teal-400" />
                      Free shipping label provided by buyer
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      Paid within 1–5 business days
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {offers.length > 0
                        ? `${offers.length} offers available`
                        : 'Select condition to see offers'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini search */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3">Search another device</p>
                <DeviceSearch placeholder="Another device..." />
              </div>
            </div>

            {/* ── Right column — comparison engine ──────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Condition Wizard */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                <ConditionWizard
                  selected={selectedCondition}
                  deviceMaxOffer={Math.round(family.maxOfferCents / 100)}
                  onSelect={handleConditionSelect}
                  conditions={conditions}
                />
              </div>

              {/* Impact strip */}
              {selectedCondition && (
                <ImpactStrip categorySlug={categorySlug} deviceName={family.name} />
              )}

              {/* Comparison table */}
              {selectedCondition ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-navy-800">Compare all offers</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      For <strong>{family.name}</strong>
                      {storageOptions.length > 1 && selectedVariantId && (
                        <>
                          {' '}
                          ·{' '}
                          {storageOptions.find(o => o.id === selectedVariantId)?.label ?? ''}
                        </>
                      )}{' '}
                      — <span className="capitalize">{selectedCondition.replace('-', ' ')}</span>{' '}
                      condition
                    </p>
                  </div>
                  {offers.length > 0 ? (
                    <ComparisonTable
                      offers={offers}
                      deviceSlug={family.slug}
                      conditionSlug={selectedCondition}
                    />
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      No offers found for this condition. Try a different condition.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-slate-400 text-sm">
                    👆 Select your device&apos;s condition above to see all offers
                  </p>
                </div>
              )}

              {/* SEO content */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                <h2 className="text-base font-bold text-navy-800 mb-3">
                  About selling your {family.name}
                </h2>
                <div className="prose prose-sm text-slate-600 space-y-3">
                  <p>
                    The <strong>{family.name}</strong> is one of the most popular devices on Revend.
                    {family.releasedYear && (
                      <>
                        {' '}
                        Released in {family.releasedYear}, it holds its value well compared to other{' '}
                        {family.category.toLowerCase()}.
                      </>
                    )}{' '}
                    The best time to sell is now — trade-in values drop an average of 15–20% per
                    year.
                  </p>
                  <p>
                    Our verified buyers compete for your device, which means you get more than you
                    would from a carrier trade-in or Craigslist sale. The average seller saves{' '}
                    <strong>$47 more</strong> by comparing on Revend vs going direct to one buyer.
                  </p>
                  <p>
                    <strong>Pro tip:</strong> A &quot;Good&quot; condition device typically fetches
                    80–90% of the &quot;Like New&quot; price. Be accurate — buyers inspect devices on
                    arrival and may revise if condition doesn&apos;t match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related devices */}
          {relatedDevices.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-navy-800 mb-6">More {family.brand} devices</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedDevices.map(d => (
                  <DeviceCard key={d.id} device={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Not-found fallback (exported for use in server page)
export function DeviceNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header alwaysOpaque />
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🤔</p>
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Device not found</h1>
          <p className="text-slate-500 mb-6">We couldn&apos;t find that device. Try searching again.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
