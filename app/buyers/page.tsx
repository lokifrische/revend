import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Star, Clock, ExternalLink } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getBuyers } from '@/lib/db'
import { dbBuyerToBuyer, formatPaymentMethod } from '@/lib/adapters'

export const metadata: Metadata = {
  title: 'Verified Buyback Partners',
  description:
    'Every buyer on Revend is verified for payment reliability and customer satisfaction. Compare their offers when you list your device.',
}

const paymentIcons: Record<string, string> = {
  PayPal: '🅿️',
  Venmo: '💜',
  Zelle: '💙',
  'Cash App': '💚',
  Check: '📄',
  'Amazon Gift Card': '🛒',
  'Bank Transfer': '🏦',
}

export default async function BuyersPage() {
  const dbBuyers = await getBuyers()
  const buyers = dbBuyers.map(dbBuyerToBuyer)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-navy-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-6">
              <Shield className="w-4 h-4" />
              All buyers are manually vetted before listing
            </div>
            <h1 className="text-4xl font-bold mb-4">Our Verified Buyer Partners</h1>
            <p className="text-slate-300 max-w-xl mx-auto">
              We work with {buyers.length} trusted buyback companies. Every offer you see comes from
              a verified business with a real track record.
            </p>
          </div>
        </div>

        {/* Buyer cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buyers.map(buyer => (
              <div
                key={buyer.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-navy-800 flex items-center justify-center text-white font-bold text-base shrink-0">
                      {buyer.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-base font-bold text-navy-800">{buyer.name}</h2>
                        {buyer.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium">
                            <Shield className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.round(buyer.rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">
                          {buyer.rating} · {buyer.reviewCount.toLocaleString()} reviews
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic">&ldquo;{buyer.tagline}&rdquo;</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Trust Score</p>
                    <p className="text-sm font-bold text-navy-800">{buyer.rating}/5</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Pays In</p>
                    <p className="text-sm font-bold text-navy-800">{buyer.paymentSpeedDays}d</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Price Lock</p>
                    <p className="text-sm font-bold text-navy-800">30 days</p>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Payment methods</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {buyer.paymentMethods.map(m => (
                        <span
                          key={m}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600"
                        >
                          {paymentIcons[m] ?? '💳'} {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/buyers/${buyer.slug}`}
                    className="shrink-0 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View profile <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Partner CTA */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl border border-navy-600 p-6 flex flex-col items-center justify-center text-center text-white">
              <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Are you a buyback company?</h3>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                Join Revend as a buyer partner and get qualified, ready-to-sell leads delivered
                daily.
              </p>
              <Link
                href="/partners/apply"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Apply to Partner →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
