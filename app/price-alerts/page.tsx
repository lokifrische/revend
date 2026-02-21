'use client'

import { useState } from 'react'
import { Bell, CheckCircle, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DeviceSearch from '@/components/device/DeviceSearch'
import { devices } from '@/lib/data'

export default function PriceAlertsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ email: '', targetPrice: '', deviceName: '' })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Price Alerts</h1>
            <p className="text-slate-300 text-lg mb-8">
              Set a target price for your device. We&apos;ll email you the moment any buyer hits or beats it.
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          {submitted ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <CheckCircle className="w-14 h-14 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-navy-800 mb-2">Alert set!</h2>
              <p className="text-slate-500 mb-2">
                We&apos;ll email <strong>{form.email}</strong> when any buyer offers <strong>${form.targetPrice}</strong> or more for your device.
              </p>
              <p className="text-xs text-slate-400">Alerts are checked daily. You can unsubscribe any time from the email.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-navy-800 mb-5">Set a price alert</h2>
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Search your device</label>
                  <DeviceSearch placeholder="iPhone 16 Pro Max, Galaxy S25..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your target price ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input required value={form.targetPrice} onChange={e => setForm({...form, targetPrice: e.target.value})} type="number" min="1" className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="500" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">We&apos;ll alert you when any buyer reaches this price or higher.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your email *</label>
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="you@example.com" />
                </div>
                <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all">
                  🔔 Set Price Alert
                </button>
                <p className="text-xs text-slate-400 text-center">Free. Unsubscribe any time. We never sell your email.</p>
              </form>
            </div>
          )}

          {/* How it works */}
          <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <p className="text-sm font-semibold text-navy-800">How price alerts work</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>• We check all buyer prices for your device daily</li>
              <li>• When any buyer reaches your target, we email you immediately</li>
              <li>• The alert includes a direct link to compare and sell</li>
              <li>• You can set multiple alerts for different devices</li>
              <li>• Alerts auto-expire after 90 days to keep things fresh</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
