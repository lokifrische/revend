import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Wrench, DollarSign, Package } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceSearch from '@/components/device/DeviceSearch'
import { getFamiliesByCategory } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'

export const metadata: Metadata = {
  title: 'Sell a Broken Phone — Get Paid for Damaged Devices',
  description:
    "Cracked screen? Won't turn on? Still valuable! Compare offers from buyers who specialize in broken phones and devices.",
}

const brokenFacts = [
  { stat: '$75', label: 'Average payout for a broken iPhone 13' },
  { stat: '$45', label: 'Average payout for a cracked Samsung S23' },
  { stat: '7+', label: 'Verified buyers who accept poor-condition devices' },
  { stat: '48hrs', label: 'Average time to payment' },
]

export default async function SellBrokenPage() {
  const families = await getFamiliesByCategory('phones')
  const brokenDevices = families.slice(0, 8).map(dbFamilyToDevice)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-5xl mb-6">🔧</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5">
              Your broken phone
              <br />
              <span className="text-gradient-teal">is still worth money.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Cracked screen, water damage, won&apos;t turn on — our verified buyers specialize in
              damaged devices and will still pay real money. Compare all offers in seconds.
            </p>
            <div className="max-w-xl mx-auto">
              <DeviceSearch placeholder="Search your broken device..." large />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
              {brokenFacts.map(f => (
                <div key={f.label} className="py-6 px-4 text-center">
                  <p className="text-2xl font-bold text-teal-600 mb-1">{f.stat}</p>
                  <p className="text-xs text-slate-500 leading-tight">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works for broken */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-10">
              Selling a broken device is simple
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: <Wrench className="w-6 h-6 text-teal-500" />,
                  title: 'Search + select "Poor"',
                  desc: "Find your device and choose the \"Poor\" condition in the wizard. We'll show who pays most.",
                },
                {
                  icon: <Package className="w-6 h-6 text-teal-500" />,
                  title: 'Ship it free',
                  desc: "Your buyer sends a prepaid label. Pack it up — even if the screen is cracked, just don't mail shattered glass loose.",
                },
                {
                  icon: <DollarSign className="w-6 h-6 text-amber-500" />,
                  title: 'Get paid',
                  desc: 'Payment arrives in 2–5 days via PayPal, Venmo, or Zelle. Real money for a device you\'d otherwise throw away.',
                },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy-800 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular broken phones */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 mb-6">
              Popular broken phones to sell
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {brokenDevices.map(device => (
                <Link
                  key={device.id}
                  href={`/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}?condition=poor`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all group"
                >
                  <span className="text-2xl">📱</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-800 truncate">{device.name}</p>
                    {device.maxOffer > 0 && (
                      <p className="text-xs text-teal-500 font-medium">
                        Up to ${Math.round(device.maxOffer * 0.4)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 mb-8">Broken phone FAQs</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What counts as "poor" condition?',
                  a: "Cracked screen, broken buttons, water damage, bent frame, or any condition where the device doesn't function normally. Select \"Poor\" and we'll show which buyers accept it.",
                },
                {
                  q: 'Will the price change after they receive it?',
                  a: 'Our buyers lock the price for 30 days. However, if the damage is more severe than described, they may revise. Always be accurate to avoid surprises.',
                },
                {
                  q: 'Should I back up my data first?',
                  a: "If it turns on — yes, always. Back up to iCloud or Google Drive, then factory reset before shipping.",
                },
                {
                  q: "What if my phone won't turn on?",
                  a: "That's fine — many buyers specialize in non-functional devices for parts. Select \"Poor\" and you'll see which buyers accept it. The payout will be lower, but it's still real money.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <p className="text-sm font-semibold text-navy-800 mb-2">{faq.q}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-navy-800">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Don&apos;t let it collect dust</h2>
            <p className="text-slate-400 mb-8">
              A broken phone in a drawer is worth $0. A broken phone on Revend is worth real money.
            </p>
            <Link
              href="/#search"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/30"
            >
              Get Offers Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
