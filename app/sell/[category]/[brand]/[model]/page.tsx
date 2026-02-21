'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Star, Package, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ConditionWizard from '@/components/comparison/ConditionWizard'
import ComparisonTable from '@/components/comparison/ComparisonTable'
import ImpactStrip from '@/components/shared/ImpactStrip'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { devices, getOffersForDevice, popularDevices } from '@/lib/data'

export default function DevicePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const modelSlug = params.model as string
  const categorySlug = params.category as string
  const brandSlug = params.brand as string
  const initialCondition = searchParams.get('condition') ?? ''

  const [selectedCondition, setSelectedCondition] = useState(initialCondition)
  const [selectedStorage, setSelectedStorage] = useState('')

  const device = devices.find(
    d => d.slug === modelSlug || (d.brandSlug === brandSlug && d.slug === modelSlug)
  )

  useEffect(() => {
    if (device && device.storage.length > 0 && !selectedStorage) {
      setSelectedStorage(device.storage[0])
    }
  }, [device, selectedStorage])

  const offers = selectedCondition
    ? getOffersForDevice(device?.id ?? '', selectedCondition)
    : []

  const handleConditionSelect = (slug: string) => {
    setSelectedCondition(slug)
    router.replace(`/sell/${categorySlug}/${brandSlug}/${modelSlug}?condition=${slug}`, { scroll: false })
  }

  if (!device) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header alwaysOpaque />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-4xl mb-4">🤔</p>
            <h1 className="text-2xl font-bold text-navy-800 mb-2">Device not found</h1>
            <p className="text-slate-500 mb-6">We couldn&apos;t find that device. Try searching again.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to search
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const categoryEmoji: Record<string, string> = {
    phones: '📱', tablets: '💻', laptops: '🖥️', smartwatches: '⌚', consoles: '🎮', headphones: '🎧',
  }
  const emoji = categoryEmoji[categorySlug] ?? '📦'

  const relatedDevices = popularDevices
    .filter(d => d.brandSlug === brandSlug && d.id !== device.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />

      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/sell/${categorySlug}`} className="hover:text-teal-600 transition-colors capitalize">
                {categorySlug}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/sell/${categorySlug}/${brandSlug}`} className="hover:text-teal-600 transition-colors capitalize">
                {device.brand}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy-800 font-medium">{device.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — device info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Device card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <span className="text-8xl">{emoji}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-1">{device.brand}</p>
                  <h1 className="text-xl font-bold text-navy-800 mb-3">{device.name}</h1>

                  {/* Max offer */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-teal-600">
                      ${selectedCondition
                        ? offers[0]?.offerPrice ?? device.maxOffer
                        : device.maxOffer}
                    </span>
                    <span className="text-sm text-slate-400">
                      {selectedCondition ? 'best offer' : 'up to'}
                    </span>
                  </div>

                  {/* Storage selector */}
                  {device.storage.length > 1 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Storage</p>
                      <div className="flex flex-wrap gap-2">
                        {device.storage.map(s => (
                          <button
                            key={s}
                            onClick={() => setSelectedStorage(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              selectedStorage === s
                                ? 'border-teal-400 bg-teal-50 text-teal-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {s}
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
                      {offers.length > 0 ? `${offers.length} offers available` : 'Select condition to see offers'}
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

            {/* Right column — comparison engine */}
            <div className="lg:col-span-2 space-y-6">
              {/* Condition Wizard */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                <ConditionWizard
                  selected={selectedCondition}
                  deviceMaxOffer={device.maxOffer}
                  onSelect={handleConditionSelect}
                />
              </div>

              {/* Impact strip */}
              {selectedCondition && (
                <ImpactStrip
                  categorySlug={categorySlug}
                  deviceName={device.name}
                />
              )}

              {/* Comparison table */}
              {selectedCondition ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-navy-800">Compare all offers</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      For <strong>{device.name}</strong> — <span className="capitalize">{selectedCondition}</span> condition
                    </p>
                  </div>
                  <ComparisonTable
                    offers={offers}
                    deviceSlug={device.slug}
                    conditionSlug={selectedCondition}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-slate-400 text-sm">
                    👆 Select your device&apos;s condition above to see all offers
                  </p>
                </div>
              )}

              {/* SEO content block */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                <h2 className="text-base font-bold text-navy-800 mb-3">
                  About selling your {device.name}
                </h2>
                <div className="prose prose-sm text-slate-600 space-y-3">
                  <p>
                    The <strong>{device.name}</strong> is one of the most popular devices on Revend.
                    Released in {device.releaseYear}, it holds its value well compared to other {device.category.toLowerCase()}.
                    The best time to sell is now — trade-in values drop an average of 15–20% per year.
                  </p>
                  <p>
                    Our verified buyers compete for your device, which means you get more than you would from a carrier trade-in or Craigslist sale.
                    The average seller saves <strong>$47 more</strong> by comparing on Revend vs going direct to one buyer.
                  </p>
                  <p>
                    <strong>Pro tip:</strong> A &quot;Good&quot; condition device typically fetches 80–90% of the &quot;Flawless&quot; price.
                    Be accurate — buyers inspect devices on arrival and may revise if condition doesn&apos;t match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related devices */}
          {relatedDevices.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-navy-800 mb-6">More {device.brand} devices</h2>
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
