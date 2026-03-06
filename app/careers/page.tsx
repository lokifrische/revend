import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Heart } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Careers — Join the Revend Team',
  description: 'Help us build a smarter, greener way for people to get value from their used devices. We\'re hiring.',
}

const openings = [
  {
    title: 'Full-Stack Engineer',
    dept: 'Engineering',
    type: 'Full-time',
    location: 'Remote (US)',
    description: 'Build and scale the Revend comparison engine. Work across Next.js, Supabase, and background workers. Strong TypeScript and PostgreSQL skills required.',
  },
  {
    title: 'SEO Content Writer',
    dept: 'Marketing',
    type: 'Full-time or Contract',
    location: 'Remote',
    description: 'Write authoritative, useful content about device trade-ins, phone value, and tech sustainability. You should love data and know SEO deeply.',
  },
  {
    title: 'Buyer Partnership Manager',
    dept: 'Business Development',
    type: 'Full-time',
    location: 'Remote (US)',
    description: 'Onboard and manage relationships with device buyback companies. You\'ll own revenue from new buyer partners and ensure they deliver great outcomes for sellers.',
  },
  {
    title: 'Head of Operations',
    dept: 'Operations',
    type: 'Full-time',
    location: 'Remote or Indianapolis, IN',
    description: 'Build the operational infrastructure behind Revend - from buyer onboarding and dispute resolution to pricing systems and seller experience.',
  },
]

const deptColors: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700',
  Marketing: 'bg-purple-100 text-purple-700',
  'Business Development': 'bg-amber-100 text-amber-700',
  Operations: 'bg-teal-100 text-teal-700',
}

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Build something that matters</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;re building the fairest, most transparent device trade-in platform in the US. Join a small, high-trust team doing meaningful work.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-10 px-4 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { emoji: '🌎', label: '100% Remote' },
                { emoji: '🏖️', label: 'Unlimited PTO' },
                { emoji: '💊', label: 'Full Health Benefits' },
                { emoji: '📈', label: 'Equity for Everyone' },
              ].map(v => (
                <div key={v.label} className="py-4">
                  <p className="text-2xl mb-2">{v.emoji}</p>
                  <p className="text-sm font-semibold text-navy-800">{v.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 mb-8">Open positions</h2>
            <div className="space-y-4">
              {openings.map((role, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-navy-800">{role.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${deptColors[role.dept] ?? 'bg-slate-100 text-slate-600'}`}>
                          {role.dept}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3 leading-relaxed">{role.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{role.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{role.type}</span>
                      </div>
                    </div>
                    <Link href="/contact" className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors">
                      Apply <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* General */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-slate-500 mb-4">Don&apos;t see the right role? We&apos;re always interested in exceptional people.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-xl transition-colors">
              Send us a note <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
