'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft, Shield, TrendingUp, Users } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PartnerApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    website: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyVolume: '',
    devicesAccepted: [] as string[],
    paymentMethods: [] as string[],
    message: '',
  })

  const deviceTypes = ['iPhones', 'Android Phones', 'iPads/Tablets', 'MacBooks/Laptops', 'Smartwatches', 'Gaming Consoles', 'Headphones']
  const paymentOpts = ['PayPal', 'Venmo', 'Zelle', 'Cash App', 'Check', 'ACH/Wire']

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: POST to /api/partner-apply
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header alwaysOpaque />
        <main className="flex-1 flex items-center justify-center pt-20 px-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-teal-500" />
            </div>
            <h1 className="text-2xl font-bold text-navy-800 mb-3">Application received!</h1>
            <p className="text-slate-500 mb-6 leading-relaxed">
              We typically review new partner applications within 3–5 business days. We&apos;ll email you at <strong>{form.email}</strong> with next steps.
            </p>
            <Link href="/" className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 text-white font-semibold rounded-xl">
              <ArrowLeft className="w-4 h-4" /> Back to Revend
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alwaysOpaque />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-navy-800 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">Become a Revend Buyer Partner</h1>
                <p className="text-slate-300 leading-relaxed">
                  Get access to qualified, ready-to-sell leads from real consumers who&apos;ve already decided to sell. No cold leads — every click is someone actively looking at your price.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Shield className="w-5 h-5 text-teal-400" />, label: 'Verified status badge on your listing' },
                  { icon: <TrendingUp className="w-5 h-5 text-teal-400" />, label: 'Pay per qualified lead only (CPA model)' },
                  { icon: <Users className="w-5 h-5 text-teal-400" />, label: 'Access to 127K+ active seller base' },
                ].map((f, i) => (
                  <div key={i} className="glass rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-2">{f.icon}</div>
                    <p className="text-xs text-slate-300 leading-tight">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-800 mb-6">Partner Application</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name *</label>
                  <input required value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} type="text" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="BuyBackTree" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Website *</label>
                  <input required value={form.website} onChange={e => setForm({...form, website: e.target.value})} type="url" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="https://yourbuyback.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Name *</label>
                  <input required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} type="text" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="Ryan Smith" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Business Email *</label>
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="ryan@yourbuyback.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Device Volume (approximate) *</label>
                <select required value={form.monthlyVolume} onChange={e => setForm({...form, monthlyVolume: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all">
                  <option value="">Select volume...</option>
                  <option>Under 100 devices/month</option>
                  <option>100–500 devices/month</option>
                  <option>500–2,000 devices/month</option>
                  <option>2,000–10,000 devices/month</option>
                  <option>10,000+ devices/month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Devices You Accept *</label>
                <div className="flex flex-wrap gap-2">
                  {deviceTypes.map(d => (
                    <button key={d} type="button" onClick={() => setForm({...form, devicesAccepted: toggleArray(form.devicesAccepted, d)})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.devicesAccepted.includes(d) ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Payment Methods You Offer *</label>
                <div className="flex flex-wrap gap-2">
                  {paymentOpts.map(p => (
                    <button key={p} type="button" onClick={() => setForm({...form, paymentMethods: toggleArray(form.paymentMethods, p)})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.paymentMethods.includes(p) ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Anything else we should know?</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all resize-none" placeholder="Tell us about your business, specialties, or any questions..." />
              </div>

              <button type="submit" className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/25">
                Submit Application →
              </button>

              <p className="text-xs text-slate-400 text-center">
                By submitting, you agree to our{' '}
                <Link href="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>.
                {' '}We review all applications within 3–5 business days.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
