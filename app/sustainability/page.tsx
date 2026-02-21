import type { Metadata } from 'next'
import Link from 'next/link'
import { Leaf, Recycle, ArrowRight, Globe, BarChart3 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { platformStats, co2ByCategory } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sustainability — How Selling Your Device Helps the Planet',
  description: 'Every device sold through Revend keeps e-waste out of landfills. See how your sale makes a difference.',
}

const co2Labels: Record<string, string> = {
  phones: 'Smartphones',
  tablets: 'Tablets',
  laptops: 'Laptops',
  smartwatches: 'Smartwatches',
  consoles: 'Gaming Consoles',
  headphones: 'Headphones',
}

const impactStats = [
  { value: '50M+', label: 'phones discarded in the US annually', icon: '📱' },
  { value: '40kg', label: 'average e-waste per person per year', icon: '⚖️' },
  { value: '57kg', label: 'CO₂ to manufacture one smartphone', icon: '🏭' },
  { value: '100x', label: 'more likely to recycle if financially rewarded', icon: '♻️' },
]

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section
          className="py-20 px-4 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-emerald-300" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5">
              Sell your device.<br />
              <span className="text-emerald-300">Save the planet.</span>
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              We&apos;re building a future where nothing is wasted. Every device sold through Revend extends its life, keeps toxic materials out of landfills, and prevents a new device from being manufactured.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/20">
              <span className="text-4xl font-bold text-white">{platformStats.co2SavedTons.toLocaleString()}</span>
              <span className="text-emerald-200 text-left">
                metric tons of CO₂<br />saved by Revend users
              </span>
            </div>
          </div>
        </section>

        {/* Impact stats */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-8">The e-waste crisis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {impactStats.map((stat, i) => (
                <div key={i} className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-2xl font-bold text-navy-800 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CO2 by category */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-3">
              CO₂ saved per device sold
            </h2>
            <p className="text-slate-500 text-center text-sm mb-8">
              Estimated based on manufacturing lifecycle analysis. Selling extends device life by 2–5 years.
            </p>
            <div className="space-y-3">
              {Object.entries(co2ByCategory).map(([slug, kg]) => {
                const label = co2Labels[slug] ?? slug
                const maxKg = Math.max(...Object.values(co2ByCategory))
                const pct = (kg / maxKg) * 100
                return (
                  <div key={slug} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-navy-800">{label}</span>
                      <span className="text-sm font-bold text-emerald-600">~{kg} kg CO₂</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How we calculate */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-navy-800">How we calculate our impact</h2>
            </div>
            <div className="prose prose-sm text-slate-600 space-y-4">
              <p>
                Our CO₂ savings figures are based on lifecycle analysis research from the European Environment Agency and peer-reviewed studies on consumer electronics manufacturing emissions.
              </p>
              <p>
                When you sell a device through Revend, we count the CO₂ that would have been emitted manufacturing a replacement device — minus the emissions from refurbishing, shipping, and reselling the old one.
              </p>
              <p>
                We&apos;re conservative in our estimates. We only count a sale as a &quot;save&quot; when the click results in a confirmed purchase by the buyer. We never inflate our numbers.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 not-prose">
                <p className="text-sm font-semibold text-emerald-800 mb-1">Our commitment</p>
                <p className="text-sm text-emerald-700">
                  We publish our full methodology and update our CO₂ figures monthly based on actual conversion data. If we can&apos;t verify it, we don&apos;t claim it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other programs */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-8">Beyond comparison — our bigger mission</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: <Globe className="w-6 h-6 text-teal-500" />, title: 'Device Donations', desc: 'Routing working devices to schools, nonprofits, and communities in need who need technology.' },
                { icon: <Recycle className="w-6 h-6 text-teal-500" />, title: 'B2B Trade-ins', desc: 'Helping businesses upgrade responsibly — bulk device disposal that maximizes recovery value.' },
                { icon: <Leaf className="w-6 h-6 text-teal-500" />, title: 'Refurb Marketplace', desc: 'Coming soon: buy certified refurbished devices from our verified buyers at prices back market can\'t beat.' },
              ].map((prog, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    {prog.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy-800 mb-2">{prog.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }}>
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Make your device&apos;s last chapter count</h2>
            <p className="text-emerald-200 mb-8">Sell it right. Get the best price. Help the planet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-700 font-semibold rounded-2xl hover:-translate-y-0.5 transition-all shadow-xl"
            >
              Find Best Price <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
