import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceCard from '@/components/device/DeviceCard'
import DeviceSearch from '@/components/device/DeviceSearch'
import { getCategories, getFamiliesByCategoryAndBrand, getBrands } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'

interface Props {
  params: Promise<{ category: string; brand: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, brand } = await params
  const [cats, brands] = await Promise.all([getCategories(), getBrands()])
  const catData = cats.find(c => c.slug === category)
  const brandData = brands.find(b => b.slug === brand)
  if (!brandData || !catData) return {}
  return {
    title: `Sell ${brandData.name} ${catData.name} — Best Trade-In Prices`,
    description: `Compare offers from 7+ verified buyers for your used ${brandData.name} ${catData.name.toLowerCase()}. Get the best price instantly.`,
  }
}

export default async function BrandPage({ params }: Props) {
  const { category, brand } = await params

  const [allCats, allBrands, families] = await Promise.all([
    getCategories(),
    getBrands(),
    getFamiliesByCategoryAndBrand(category, brand),
  ])

  const catData = allCats.find(c => c.slug === category)
  const brandData = allBrands.find(b => b.slug === brand)
  if (!catData || !brandData) notFound()

  const brandDevices = families.map(dbFamilyToDevice)

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
              <Link href={`/sell/${category}`} className="hover:text-teal-600 capitalize">
                {catData.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy-800 font-medium">{brandData.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-6">
              {brandData.logo_url ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                  <Image
                    src={brandData.logo_url}
                    alt={brandData.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {brandData.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-navy-800">
                  Sell Your {brandData.name} {catData.name}
                </h1>
                <p className="text-slate-500 mt-1">
                  {brandDevices.length > 0
                    ? `${brandDevices.length} models available`
                    : 'Models available'}{' '}
                  · Compare 7+ buyer offers
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
              <p className="text-slate-500">
                No {brandData.name} {catData.name} listed yet.
              </p>
              <Link
                href={`/sell/${category}`}
                className="mt-4 inline-block text-teal-600 font-medium"
              >
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
