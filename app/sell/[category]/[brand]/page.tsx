import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://revend-lokis-projects-b31d1aab.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand } = await params
  const brandData = brands.find(b => b.slug === brand)
  const catData = categories.find(c => c.slug === category)
  if (!brandData || !catData) return {}

  const title = `Sell ${brandData.name} ${catData.name} — Compare Buyback Prices | Revend`
  const description = `Compare offers from 20+ verified buyers for your used ${brandData.name} ${catData.name.toLowerCase()}. Get the best price instantly. Free shipping, fast payment.`
  const canonicalUrl = `${BASE}/sell/${category}/${brand}`

  return {
    title,
    description,
    keywords: [
      `sell ${brandData.name} ${catData.name.toLowerCase()}`,
      `${brandData.name} trade in`,
      `${brandData.name} buyback`,
      `best place to sell ${brandData.name}`,
      `${brandData.name} ${catData.name.toLowerCase()} buyback comparison`,
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
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
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                <Image
                  src={brandData.logo}
                  alt={brandData.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
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
