import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Star, Clock, ExternalLink, Lock, Award, Zap } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { buyers } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Verified Buyback Partners | Revend',
  description: 'Every buyer on Revend is verified for payment reliability and customer satisfaction. Compare their offers when you list your device.',
}

const paymentMethodConfig: Record<string, { color: string; bg: string }> = {
  PayPal:             { color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200' },
  Venmo:              { color: 'text-indigo-600',  bg: 'bg-indigo-50 border-indigo-200' },
  Zelle:              { color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
  'Cash App':         { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  Check:              { color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
  'Amazon Gift Card': { color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
}

// BBB rating map for each buyer
const bbbRatings: Record<string, string> = {
  buybacktree:  'A+',
  gazelle:      'A+',
  gadgetgone:   'A',
  itsworthmore: 'A-',
  swappa:       'A',
}

export default function BuyersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />
      <main className="flex-1 pt-16">

        {/* Hero */}
        <div
          className="text-white py-16 px-4"
          style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #162540 60%, #0d2436 100%)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm mb-6">
              <Shield className="w-4 h-4" />
              All buyers are manually vetted before listing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Our Verified Buyer Partners
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto text-lg leading-relaxed">
              We work with the most trusted buyback companies in the US. Every offer you see comes from a verified business with a real track record.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
              {[
                { value: `${buyers.length}`, label: 'Verified Buyers' },
                { value: '30 days', label: 'Price Lock Guarantee' },
                { value: '1–7 days', label: 'Average Payment Speed' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buyers.map(buyer => {
              const trustScore = Math.round(buyer.rating * 20)
              const bbb = bbbRatings[buyer.slug] ?? 'A'
              return (
                <div
                  key={buyer.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-xl hover:shadow-teal-50 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                        {buyer.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-base font-bold text-navy-800">{buyer.name}</h2>
                          {buyer.verified && (
                            <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-semibold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                              <Shield className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            BBB {bbb}
                          </span>
                        </div>
                        {/* Stars */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(buyer.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">{buyer.rating} · {buyer.reviewCount.toLocaleString()} reviews</span>
                        </div>
                        <p className="text-xs text-slate-500 italic">&ldquo;{buyer.tagline}&rdquo;</p>
                      </div>
                    </div>

                    {/* Trust score bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500 font-medium">Trust Score</span>
                        <span className="text-xs font-bold text-teal-600">{trustScore}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                          style={{ width: `${trustScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
                    <div className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <p className="text-xs text-slate-400 mb-0.5">Experience</p>
                      <p className="text-sm font-bold text-navy-800">{buyer.yearsActive} yrs</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                      </div>
                      <p className="text-xs text-slate-400 mb-0.5">Pays In</p>
                      <p className="text-sm font-bold text-navy-800">{buyer.paymentSpeedDays}d</p>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <p className="text-xs text-slate-400 mb-0.5">Price Lock</p>
                      <p className="text-sm font-bold text-navy-800">30 days</p>
                    </div>
                  </div>

                  {/* Payment methods + CTA */}
                  <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Payment methods</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {buyer.paymentMethods.map(m => {
                          const cfg = paymentMethodConfig[m]
                          return (
                            <span
                              key={m}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${cfg ? `${cfg.color} ${cfg.bg}` : 'text-slate-600 bg-slate-50 border-slate-200'}`}
                            >
                              {m}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <Link
                      href={`/sell/phones`}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-teal-500/20 min-h-[44px]"
                    >
                      View offers
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}

            {/* Partner CTA card */}
            <div
              className="rounded-2xl border border-navy-600 p-6 flex flex-col items-center justify-center text-center text-white col-span-1 md:col-span-2"
              style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #1a2e4a 100%)' }}
            >
              <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Are you a buyback company?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
                Join Revend as a buyer partner and get qualified, ready-to-sell leads delivered daily. No upfront cost.
              </p>
              <Link
                href="/partners/apply"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-teal-500/30"
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
