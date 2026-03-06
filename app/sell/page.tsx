import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCategoriesWithCounts } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Sell Your Device — Compare Trade-In Offers | Revend',
  description:
    'Choose your device category and instantly compare offers from 7+ verified buyers. Get the best price for your phone, tablet, laptop, watch, console, or headphones.',
}

export default async function SellPage() {
  const categories = await getCategoriesWithCounts()
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1C2E' }}>
      <Header alwaysOpaque />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-14 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
            What are you selling?
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Pick a category and we&apos;ll instantly compare offers from 7+ verified buyers — free, no pressure.
          </p>
        </section>

        {/* Category Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/sell/${cat.slug}`}
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 p-8 text-center transition-all duration-200 hover:border-[#00C4B4]/60 hover:bg-white/5 hover:shadow-lg hover:shadow-[#00C4B4]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C4B4]"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                {/* Icon */}
                <span className="text-5xl select-none transition-transform duration-200 group-hover:scale-110">
                  {cat.icon}
                </span>

                {/* Name */}
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#00C4B4] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {(cat.deviceCount || 0).toLocaleString()}+ models
                  </p>
                </div>

                {/* Teal accent bar — slides in on hover */}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#00C4B4] transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* Sub-copy */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Not sure which category?{' '}
            <Link href="/" className="text-[#00C4B4] hover:underline font-medium">
              Search by device name →
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
