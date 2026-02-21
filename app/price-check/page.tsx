import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingDown, ArrowRight, Info } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceSearch from '@/components/device/DeviceSearch'
import DeviceCard from '@/components/device/DeviceCard'
import { devices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'How Much Is My Phone Worth? — Device Price Checker',
  description: 'Find out what your iPhone, Samsung, or Google phone is worth today. Compare buyback prices instantly. Free, no sign-up.',
}

// Depreciation data — rough industry averages
const depreciationData = [
  { model: 'iPhone 17 Pro Max', launch: 1199, after6m: 820, after12m: 650, after24m: 420 },
  { model: 'iPhone 16 Pro Max', launch: 1099, after6m: 720, after12m: 560, after24m: 360 },
  { model: 'Samsung Galaxy S25 Ultra', launch: 1299, after6m: 710, after12m: 580, after24m: 380 },
  { model: 'Google Pixel 9 Pro', launch: 999, after6m: 490, after12m: 390, after24m: 250 },
  { model: 'MacBook Pro 16" M4', launch: 2499, after6m: 1380, after12m: 1100, after24m: 750 },
]

const popularLookups = devices.filter(d => d.popular).slice(0, 8)

export default function PriceCheckPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-5">
              What is my phone worth?
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Find out in seconds. Compare live offers from 20+ verified buyers — and see how your device&apos;s value has changed over time.
            </p>
            <DeviceSearch placeholder="Search your phone or device..." large />
          </div>
        </section>

        {/* Popular lookups */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-navy-800 mb-6">Most searched devices</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {popularLookups.map(device => (
                <Link
                  key={device.id}
                  href={`/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all group"
                >
                  <span className="text-xl">{device.category === 'Phones' ? '📱' : device.category === 'Laptops' ? '🖥️' : '💻'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-800 truncate">{device.name}</p>
                    <p className="text-xs text-teal-500 font-medium">Up to ${device.maxOffer}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Depreciation table */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-navy-800">Device depreciation tracker</h2>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Device values drop every month — especially around new model launches. Here&apos;s how trade-in values change over time for the most popular devices.
            </p>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Device</th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Launch Price</th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">After 6 Months</th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">After 1 Year</th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">After 2 Years</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {depreciationData.map((row, i) => {
                      const drop2yr = Math.round(((row.launch - row.after24m) / row.launch) * 100)
                      return (
                        <tr key={i} className="border-b border-slate-50 hover:bg-teal-50/30 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-navy-800">{row.model}</p>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">${row.launch.toLocaleString()}</td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-teal-600">${row.after6m}</td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">${row.after12m}</td>
                          <td className="px-4 py-4 text-right">
                            <div>
                              <span className="text-sm text-slate-600">${row.after24m}</span>
                              <span className="text-xs text-red-400 ml-1">−{drop2yr}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Link href="/#search" className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap flex items-center gap-1">
                              Sell now <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400">Trade-in values shown are estimates based on current buyback market averages. Actual offers may vary based on condition and buyer. Compare live offers for exact prices.</p>
            </div>
          </div>
        </section>

        {/* Pro tip */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-amber-800 mb-2">💡 Pro tip: Sell before the next model launches</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Device values typically drop 15–25% in the month after a new model is announced. If you&apos;re thinking of selling, doing it before the next iPhone or Galaxy announcement can mean hundreds of dollars more.
              </p>
              <Link href="/blog/best-time-to-sell-iphone" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-amber-700 hover:text-amber-800">
                Read our depreciation guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-navy-800">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Find your device&apos;s real value now</h2>
            <p className="text-slate-400 mb-8">Live prices from 20+ verified buyers. Free, instant, no sign-up needed.</p>
            <DeviceSearch placeholder="Search your device..." large />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
