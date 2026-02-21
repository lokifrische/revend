import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { categories, brands, devices } from '@/lib/data'

interface Props {
  params: Promise<{ category: string; brand: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand } = await params
  const brandData = brands.find(b => b.slug === brand)
  const catData = categories.find(c => c.slug === category)
  if (!brandData || !catData) return {}
  return {
    title: `Sell ${brandData.name} ${catData.name} — Best Trade-In Prices`,
    description: `Compare offers from 20+ verified buyers for your used ${brandData.name} ${catData.name.toLowerCase()}. Get the best price instantly.`,
  }
}

export default async function BrandPage({ params }: Props) {
  const { category, brand } = await params
  const catData = categories.find(c => c.slug === category)
  const brandData = brands.find(b => b.slug === brand)
  if (!catData || !brandData) notFound()

  const brandDevices = devices.filter(d => d.brandSlug === brand && d.categorySlug === category)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <Link href="/" className="hover:text-teal-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/sell/${category}`} className="hover:text-teal-600 capitalize">{catData.name}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy-800 font-medium">{brandData.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                {brandData.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-navy-800">Sell Your {brandData.name} {catData.name}</h1>
                <p className="text-slate-500 mt-1">
                  {brandDevices.length} models available · Compare 20+ buyer offers
                </p>
              </div>
            </div>
            <div className="max-w-xl">
              <DeviceSearch placeholder={`Search ${brandData.name} models...`} />
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {brandDevices.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brandDevices.map(device => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔭</p>
              <p className="text-slate-500">No {brandData.name} {catData.name} listed yet.</p>
              <Link href={`/sell/${category}`} className="mt-4 inline-block text-teal-600 font-medium">
                ← Browse all {catData.name}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
