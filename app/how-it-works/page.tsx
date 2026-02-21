import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, BarChart3, Package, DollarSign, Shield, ArrowRight, HelpCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceSearch from '@/components/device/DeviceSearch'

export const metadata: Metadata = {
  title: 'How It Works — Revend',
  description: 'Learn how Revend finds you the best price for your used phone or device in under 60 seconds.',
}

const steps = [
  {
    icon: <Search className="w-7 h-7 text-teal-500" />,
    number: '01',
    title: 'Search your device',
    desc: 'Type your phone, tablet, or laptop model into the search bar. We have 600+ devices from all major brands.',
    detail: 'Our search uses smart matching — you can type "iPhone 15" or "Pro Max" or even just "15 Pro" and we\'ll find it.',
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-teal-500" />,
    number: '02',
    title: 'Select your device condition',
    desc: 'Choose from Flawless, Good, Fair, or Broken. Be honest — buyers verify condition on arrival.',
    detail: 'Condition affects your offer price. A "Good" condition device typically earns 80–90% of the "Flawless" price. "Broken" devices still have value!',
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-amber-500" />,
    number: '03',
    title: 'Compare every offer',
    desc: 'See all offers from our verified buyers side-by-side, ranked from highest to lowest. Pick your winner.',
    detail: 'Prices update every 90 seconds from live buyer systems. What you see is what you get — no bait-and-switch.',
  },
  {
    icon: <Package className="w-7 h-7 text-teal-500" />,
    number: '04',
    title: 'Ship your device — free',
    desc: 'Go to your chosen buyer\'s site and request your free prepaid shipping label. Pack and ship.',
    detail: 'All our verified buyers provide free shipping labels. Never pay to send your device.',
  },
  {
    icon: <DollarSign className="w-7 h-7 text-amber-500" />,
    number: '05',
    title: 'Get paid fast',
    desc: 'Buyers typically pay within 1–5 business days of receiving your device via PayPal, Venmo, Zelle, or check.',
    detail: 'The price you saw is locked for 30 days — if you ship within the lock period, you get the quoted price even if it drops.',
  },
]

const faqs = [
  {
    q: 'Is Revend free to use?',
    a: 'Yes, completely free for sellers. We earn a small referral fee from buyers when you make a sale. This never reduces the offer you receive.',
  },
  {
    q: 'How does Revend make money?',
    a: 'Buyers pay us a small commission (around 3–5%) when a sale completes through Revend. Think of it like a finder\'s fee. You always get the full quoted price.',
  },
  {
    q: 'What if my device is broken?',
    a: 'Broken devices still have value! Most of our buyers accept broken phones, tablets, and laptops. The price will be lower, but you\'ll still get paid. Select "Broken" in the condition picker to see offers.',
  },
  {
    q: 'What if the buyer revises my offer after inspection?',
    a: 'This can happen if your device\'s condition doesn\'t match what you selected. Our verified buyers always notify you and give you the choice to accept the revised offer or have your device returned free of charge.',
  },
  {
    q: 'How do I know buyers will actually pay?',
    a: 'Every buyer on Revend is manually verified. We check BBB standing, payment track records, and customer reviews before listing. We also monitor ongoing performance and remove buyers who don\'t meet our standards.',
  },
  {
    q: 'Can I sell tablets, laptops, and other devices?',
    a: 'Yes! We support phones, tablets, laptops, smartwatches, gaming consoles, and headphones. We\'re adding new categories regularly.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-navy-800 text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-5">
              From old phone to{' '}
              <span className="text-gradient-teal">cash in hand</span>
              <br />in 5 minutes
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              No account needed. No guesswork. Just the best price for your device.
            </p>
            <div className="max-w-xl mx-auto">
              <DeviceSearch placeholder="Search your device to start..." large />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-800 text-center mb-12">Step by step</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-800 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{step.desc}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="bg-slate-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-5 bg-teal-50 border border-teal-200 rounded-2xl">
              <Shield className="w-8 h-8 text-teal-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-teal-800">How we protect you</p>
                <p className="text-sm text-teal-600">Every buyer on Revend is manually vetted. We check payment track records, BBB standing, and customer reviews. We remove any buyer that fails our standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <HelpCircle className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-navy-800">Frequently asked questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200">
                  <p className="text-sm font-semibold text-navy-800 mb-2">{faq.q}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy-800 py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to find your best offer?</h2>
            <p className="text-slate-400 mb-8">Takes about 60 seconds. Completely free.</p>
            <Link
              href="/#search"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Find Best Price Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
