import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Heart, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About Revend — Why We Built This',
  description: 'Revend was built to give consumers a fairer deal when selling their used devices. No more leaving money on the table.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-navy-800 text-white py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-8">
              <Heart className="w-4 h-4" />
              Our story
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Built for sellers.<br />
              <span className="text-gradient-teal">Not the buyers.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              Every year, millions of people leave hundreds of dollars on the table when trading in their old devices — because they didn&apos;t know there was a better offer somewhere else. We built Revend to fix that.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto prose prose-slate prose-lg">
            <h2 className="text-2xl font-bold text-navy-800 mb-6">Why we built this</h2>
            <div className="space-y-5 text-slate-600">
              <p>
                The average carrier trade-in gives you <strong>40–60% less</strong> than what a dedicated buyback company will pay. And most people never know.
              </p>
              <p>
                We partnered with <strong>Ryan at BuyBackTree</strong> — an Indiana-based BBB-accredited buyback company — as our first buyer partner. Ryan&apos;s seen firsthand how people accept the first offer they see because comparison is too much work.
              </p>
              <p>
                So we built the comparison layer. Search your device. See every real offer side-by-side. Pick the best one. Done.
              </p>
              <p>
                We&apos;re not a buyer ourselves. We never touch your device. We&apos;re just the comparison layer that makes sure you always know your best option.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-10">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  icon: <Target className="w-6 h-6 text-teal-500" />,
                  title: 'Radical transparency',
                  desc: 'We show you how we make money. We show you how prices are generated. We tell you when a buyer has a bad track record. No hiding.',
                },
                {
                  icon: <Heart className="w-6 h-6 text-teal-500" />,
                  title: 'Seller-first always',
                  desc: 'Buyers pay us — but sellers are our real customer. If a buyer starts undercutting sellers or revising offers unfairly, they come off the platform.',
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-teal-500" />,
                  title: 'Built for the long game',
                  desc: 'We\'re not flipping a startup. We\'re building a real business that genuinely helps people get more for their stuff while keeping e-waste down.',
                },
              ].map((v, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                    {v.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy-800 mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Business inquiries</h2>
            <p className="text-slate-500 mb-8">
              Are you a buyback company and want to reach more sellers? We&apos;d love to talk.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/partners/apply"
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors"
              >
                Partner with Revend <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center gap-2 px-5 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-xl transition-colors"
              >
                Business programs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
