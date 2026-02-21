import Link from 'next/link'
import { ArrowRight, Shield, Zap, TrendingUp, Leaf, Users, Award } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceSearch from '@/components/device/DeviceSearch'
import DeviceCard from '@/components/device/DeviceCard'
import { popularDevices, categories, platformStats, buyers } from '@/lib/data'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        id="search"
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #1a2e4a 60%, #0d2436 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #00C4B4 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#00C4B4 1px, transparent 1px), linear-gradient(90deg, #00C4B4 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {platformStats.totalSellers.toLocaleString()}+ devices sold through Revend
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Every device{' '}
            <span className="text-gradient-teal">has more</span>
            <br />to give.
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Compare offers from <strong className="text-white">{platformStats.totalBuyers}+ verified buyers</strong> and get the best price for your used phone, tablet, or laptop.{' '}
            <span className="text-teal-300">Free. Instant. No pressure.</span>
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <DeviceSearch
              placeholder="Search any phone, tablet, laptop..."
              large={true}
            />
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>
            {['iPhone 16 Pro', 'Galaxy S25', 'Pixel 9 Pro', 'MacBook Pro', 'iPad Pro'].map(item => (
              <button
                key={item}
                className="px-3 py-1 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <div className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-teal-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {[
              { label: 'Verified Buyers', value: `${platformStats.totalBuyers}+`, icon: <Shield className="w-4 h-4" /> },
              { label: 'Devices Listed', value: `${platformStats.totalDevices}+`, icon: <Zap className="w-4 h-4" /> },
              { label: 'Sellers Served', value: `${(platformStats.totalSellers / 1000).toFixed(0)}K+`, icon: <Users className="w-4 h-4" /> },
              { label: 'CO₂ Saved (tons)', value: `${platformStats.co2SavedTons.toLocaleString()}`, icon: <Leaf className="w-4 h-4" /> },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center justify-center py-6 px-4 gap-2 text-center">
                <div className="flex items-center gap-2 text-teal-500">
                  {stat.icon}
                  <span className="text-2xl font-bold text-navy-800">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy-800 mb-3">What are you selling?</h2>
            <p className="text-slate-500">We compare prices for 600+ devices across all major categories.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/sell/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-50 hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-navy-800 group-hover:text-teal-700 transition-colors">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.deviceCount} devices</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR DEVICES ──────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-navy-800 mb-2">Trending devices</h2>
              <p className="text-slate-500">See what people are selling right now</p>
            </div>
            <Link
              href="/sell/phones"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              See all devices
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularDevices.slice(0, 6).map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/sell/phones"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600"
            >
              View all devices <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How Revend works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three steps. Five minutes. Best price in your pocket.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal-500 to-amber-500" />

            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Search your device',
                desc: 'Type your device model. We support 600+ phones, tablets, laptops, and more.',
                color: 'teal',
              },
              {
                step: '02',
                icon: '⚖️',
                title: 'Compare every offer',
                desc: 'See all offers from verified buyers side-by-side, ranked by price. No guessing.',
                color: 'teal',
              },
              {
                step: '03',
                icon: '💰',
                title: 'Get paid fast',
                desc: 'Pick your buyer, ship free, and get paid in 1–5 days via PayPal, Venmo, or Zelle.',
                color: 'amber',
              },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl glass">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 ${step.color === 'amber' ? 'bg-amber-500/20' : 'bg-teal-500/20'}`}>
                  {step.icon}
                </div>
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-teal-500 text-white'}`}>
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Start Comparing Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRUST SECTION ────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-800 mb-3">Why sellers trust Revend</h2>
            <p className="text-slate-500">We&apos;re in your corner — not the buyers&apos;.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: <Shield className="w-6 h-6 text-teal-500" />,
                title: 'Verified buyers only',
                desc: 'Every buyer on Revend is vetted for payment reliability, BBB standing, and review score before listing.',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
                title: 'Real-time prices',
                desc: 'Offers update every 90 seconds. No stale prices. What you see is what you get.',
              },
              {
                icon: <Zap className="w-6 h-6 text-teal-500" />,
                title: 'We never touch your device',
                desc: 'Revend is a comparison service. You sell directly to the buyer — we just help you find the best deal.',
              },
              {
                icon: <Award className="w-6 h-6 text-teal-500" />,
                title: 'Price lock guarantee',
                desc: 'Buyers lock in their offer for 30 days. Ship your device knowing the price won\'t change.',
              },
              {
                icon: <Leaf className="w-6 h-6 text-teal-500" />,
                title: 'Sustainability impact',
                desc: 'Every sale keeps e-waste out of landfills. We track and show your exact CO₂ impact.',
              },
              {
                icon: <Users className="w-6 h-6 text-teal-500" />,
                title: 'Free forever for sellers',
                desc: 'Always free for consumers. We earn referral fees from buyers — not sellers.',
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buyer logos strip */}
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-6">Verified buyer partners</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {buyers.map(buyer => (
                <div key={buyer.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-white text-xs font-bold">
                    {buyer.logo}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy-800">{buyer.name}</p>
                    <p className="text-xs text-slate-400">⭐ {buyer.rating}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300">
                <p className="text-xs text-slate-400">+{platformStats.totalBuyers - buyers.length} more buyers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUSTAINABILITY TEASER ─────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-900 to-teal-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {platformStats.co2SavedTons.toLocaleString()} metric tons of CO₂ saved
          </h2>
          <p className="text-emerald-200 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Manufacturing one smartphone produces ~57kg of CO₂. When you sell instead of trash, you extend that device&apos;s life and help keep toxic materials out of landfills.
          </p>
          <Link
            href="/sustainability"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all hover:-translate-y-0.5"
          >
            Our sustainability story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-navy-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to find out what your device is worth?
          </h2>
          <p className="text-slate-400 mb-8">
            No signup needed. Free forever. 60 seconds to your best offer.
          </p>
          <DeviceSearch placeholder="Search your device..." large={true} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
