'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Building2, CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const subjects = [
    'General inquiry',
    'Business/bulk sales inquiry',
    'Buyer partnership inquiry',
    'Press / media inquiry',
    'Bug report',
    'Careers',
    'Other',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-navy-800 text-white py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-3">Get in touch</h1>
            <p className="text-slate-300">We read every message and respond within 1–2 business days.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact channels */}
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-5 h-5 text-teal-500" />, title: 'Email', val: 'hello@revend.com', sub: 'General inquiries' },
                { icon: <Building2 className="w-5 h-5 text-teal-500" />, title: 'Business', val: 'partners@revend.com', sub: 'Buyer + business inquiries' },
                { icon: <MessageSquare className="w-5 h-5 text-teal-500" />, title: 'Press', val: 'press@revend.com', sub: 'Media & PR' },
              ].map((ch, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    {ch.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">{ch.title}</p>
                    <p className="text-sm font-medium text-navy-800">{ch.val}</p>
                    <p className="text-xs text-slate-400">{ch.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-navy-800 mb-2">Message sent!</h2>
                  <p className="text-slate-500">We&apos;ll get back to you at <strong>{form.email}</strong> within 1–2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-navy-800 mb-2">Send a message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name *</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                      <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                    <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all">
                      <option value="">Select a subject...</option>
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                    <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm transition-all resize-none" placeholder="Tell us what's on your mind..." />
                  </div>
                  <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all">
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
