import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { getCategories, getFamiliesByCategory } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'
import { getIcon } from '@/lib/icon-map'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cats = await getCategories()
  const cat = cats.find(c => c.slug === category)
  if (!cat) return {}
  return {
    title: `Sell Your ${cat.name} — Best Trade-In Prices`,
    description: `Compare offers from 7+ verified buyers for your used ${cat.name.toLowerCase()}. Get the best price in minutes. Free, instant, no pressure.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  const [allCats, families] = await Promise.all([
    getCategories(),
    getFamiliesByCategory(category),
  ])

  const cat = allCats.find(c => c.slug === category)
  if (!cat) notFound()

  const categoryDevices = families.map(dbFamilyToDevice)

  // Group by brand
  const brandMap = new Map<string, { brand: string; brandSlug: string; devices: typeof categoryDevices }>()
  for (const device of categoryDevices) {
    if (!brandMap.has(device.brandSlug)) {
      brandMap.set(device.brandSlug, { brand: device.brand, brandSlug: device.brandSlug, devices: [] })
    }
    brandMap.get(device.brandSlug)!.devices.push(device)
  }
  const brandGroups = [...brandMap.values()]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link href="/" className="hover:text-teal-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy-800 font-medium">{cat.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-6">
              {(() => {
                const Icon = getIcon(cat.icon)
                return (
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Icon className="w-8 h-8" />
                  </div>
                )
              })()}
              <div>
                <h1 className="text-3xl font-bold text-navy-800">Sell Your {cat.name}</h1>
                <p className="text-slate-500 mt-1">
                  {categoryDevices.length > 0 ? `${categoryDevices.length} models` : 'Hundreds of models'} · Compare 7+ verified buyer offers instantly.
                </p>
              </div>
            </div>
            <div className="max-w-xl">
              <DeviceSearch placeholder={`Search ${cat.name.toLowerCase()}...`} />
            </div>
          </div>
        </div>

        {/* Device grid by brand */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {brandGroups.map(group => (
            <div key={group.brandSlug}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy-800">{group.brand}</h2>
                <Link
                  href={`/sell/${category}/${group.brandSlug}`}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                  All {group.brand} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.devices.slice(0, 6).map(device => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          ))}

          {categoryDevices.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-500">No devices listed yet in this category.</p>
              <Link href="/" className="mt-4 inline-block text-teal-600 font-medium">
                ← Back to search
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
