import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Users, Shield, ArrowRight, BarChart3, Leaf, Phone } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Business Device Trade-In Programs — Revend for Business',
  description: 'Sell your company\'s old devices in bulk. IT asset recovery, employee device buyback programs, and enterprise trade-in for businesses of all sizes.',
}

const programs = [
  {
    icon: <Building2 className="w-6 h-6 text-teal-500" />,
    title: 'Corporate IT Asset Recovery',
    desc: 'Offboarding employees? Refreshing your device fleet? Get competitive bulk pricing for 10–10,000+ devices.',
    bullets: ['Dedicated account manager', 'Bulk pricing — up to 15% more than retail', 'Data destruction certificates available', 'ITAD compliant process'],
  },
  {
    icon: <Users className="w-6 h-6 text-teal-500" />,
    title: 'Employee Upgrade Programs',
    desc: 'Give employees a reason to turn in old devices. We handle the comparison and logistics — you get a seamless upgrade program.',
    bullets: ['Branded portal for your company', 'Employees choose their payout method', 'You get the aggregate recovery report', 'Works with BYOD and company-owned devices'],
  },
  {
    icon: <Leaf className="w-6 h-6 text-teal-500" />,
    title: 'ESG & Sustainability Reporting',
    desc: 'Need CO₂ impact data for sustainability reporting? We track and certify every device resold or recycled through your program.',
    bullets: ['Per-device CO₂ savings certificate', 'Quarterly ESG impact report', 'Suitable for CDP, GRI, TCFD reporting', 'B Corp friendly documentation'],
  },
]

export default function BusinessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-6">
                  <Building2 className="w-4 h-4" />
                  For businesses
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-5">
                  Turn old devices<br />
                  into<span className="text-gradient-teal"> working capital</span>
                </h1>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Most businesses leave 40–60% of device value on the table during upgrades. Revend for Business connects you with the best buyers for your fleet — at bulk rates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/business/apply" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/30">
                    Get a Bulk Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="tel:+15551234567" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all">
                    <Phone className="w-4 h-4" /> Talk to Sales
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '10,000+', label: 'Devices recovered for businesses' },
                  { value: '$2.4M', label: 'Total business recovery value' },
                  { value: '48hrs', label: 'Average quote turnaround' },
                  { value: '100%', label: 'Data destruction guaranteed' },
                ].map(stat => (
                  <div key={stat.label} className="glass rounded-2xl p-5">
                    <p className="text-3xl font-bold text-teal-400 mb-1">{stat.value}</p>
                    <p className="text-xs text-slate-400 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-800 text-center mb-12">Business programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((prog, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                    {prog.icon}
                  </div>
                  <h3 className="text-base font-bold text-navy-800 mb-2">{prog.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{prog.desc}</p>
                  <ul className="space-y-1.5">
                    {prog.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-teal-500 mt-0.5">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-8">Industries we serve</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                '🏢 Enterprise', '🏥 Healthcare', '🎓 Education', '⛪ Churches & Nonprofits',
                '🏦 Financial Services', '🏪 Retail Chains', '🚛 Logistics', '🏛️ Government',
              ].map(industry => (
                <span key={industry} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-10">How business programs work</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Submit your device list', desc: 'Send us a spreadsheet of what you have — model, condition, quantity. We turn around a full quote within 48 hours.' },
                { step: '2', title: 'Approve your quote', desc: 'We present offers from our buyer network. You approve the best deal, and we coordinate pickup or bulk shipping.' },
                { step: '3', title: 'We handle logistics', desc: 'Bulk shipping labels, packing guidance, coordination with the buyer — all handled by Revend.' },
                { step: '4', title: 'Get paid + get your report', desc: 'Payment via business check or ACH. You also get a full recovery report including CO₂ impact for ESG reporting.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 p-5 rounded-2xl border border-slate-200 hover:border-teal-200 transition-all">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-800 mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4 bg-navy-800">
          <div className="max-w-xl mx-auto text-center text-white">
            <BarChart3 className="w-10 h-10 text-teal-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Get your bulk quote in 48 hours</h2>
            <p className="text-slate-400 mb-8">No commitment. No pushy sales calls. Just a real number you can act on.</p>
            <Link href="/business/apply" className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/30">
              Request Business Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
