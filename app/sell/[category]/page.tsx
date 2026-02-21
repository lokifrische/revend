import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { categories, devices } from '@/lib/data'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categories.find(c => c.slug === category)
  if (!cat) return {}
  return {
    title: `Sell Your ${cat.name} — Best Trade-In Prices`,
    description: `Compare offers from 20+ verified buyers for your used ${cat.name.toLowerCase()}. Get the best price in minutes. Free, instant, no pressure.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = categories.find(c => c.slug === category)
  if (!cat) notFound()

  const categoryDevices = devices.filter(d => d.categorySlug === category)

  const brands = [...new Set(categoryDevices.map(d => d.brand))]
  const brandGroups = brands.map(brand => ({
    brand,
    brandSlug: categoryDevices.find(d => d.brand === brand)?.brandSlug ?? '',
    devices: categoryDevices.filter(d => d.brand === brand),
  }))

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
              <span className="text-5xl">{cat.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-navy-800">Sell Your {cat.name}</h1>
                <p className="text-slate-500 mt-1">
                  Compare {cat.deviceCount}+ devices. Get offers from {20}+ verified buyers instantly.
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
            <div key={group.brand}>
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
              <p className="text-4xl mb-4">🔭</p>
              <p className="text-slate-500">No devices listed yet in this category.</p>
              <Link href="/" className="mt-4 inline-block text-teal-600 font-medium">← Back to search</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
