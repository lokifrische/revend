import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = { title: 'Affiliate Disclosure — Revend' }

export default function DisclosurePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-navy-800 text-white py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">Affiliate & Referral Disclosure</h1>
            <p className="text-slate-400 text-sm mt-2">Required by FTC guidelines (16 C.F.R. § 255)</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-sm text-slate-600 leading-relaxed space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
            <p className="font-semibold text-teal-800 mb-2">The short version:</p>
            <p className="text-teal-700">Revend earns a referral fee from buyback companies when you sell your device through our links. This fee is paid by the buyer, not you, and does not affect the price you receive. We disclose this clearly on every comparison page.</p>
          </div>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">How Our Referral Model Works</h2>
            <p>When you click &quot;Sell Now&quot; on a Buyer card and complete a sale, Revend receives a commission from that Buyer. This is typically 3–5% of the sale value, paid by the Buyer from their margin — not from your offer price.</p>
            <p>The offer you see on Revend is the same offer you would see going directly to the Buyer&apos;s site. We do not inflate prices to hide our fee.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Does This Affect Rankings?</h2>
            <p>No. Buyer offers are always ranked by the price you receive — highest first. We do not accept payment from Buyers to improve their ranking. A Buyer with a higher commission rate is never shown higher than one with a better offer for you.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Blog Content</h2>
            <p>Revend&apos;s blog contains articles that may discuss specific buyback companies. Where we have a referral relationship with a company mentioned in an article, we disclose this at the top of the post.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Questions?</h2>
            <p>Contact us at <a href="mailto:hello@revend.com" className="text-teal-600 hover:underline">hello@revend.com</a>. We&apos;re transparent about how we make money and happy to explain further.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
