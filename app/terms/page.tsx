import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = { title: 'Terms of Service — Revend' }

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-navy-800 text-white py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-slate-400 mb-1">Last updated: February 2026</p>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-sm text-slate-600 leading-relaxed space-y-8">
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">1. Service Description</h2>
            <p>Revend is a price comparison service. We show you offers from third-party buyback companies (&quot;Buyers&quot;) for your used electronic devices. We are not a buyer ourselves and do not take possession of any device.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">2. How We Earn Money</h2>
            <p>Revend earns a referral commission from Buyers when you sell your device through our platform. This fee is paid by the Buyer, not you. The offer price you see is the full amount you receive — our commission does not reduce your payout.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">3. Price Accuracy</h2>
            <p>Prices are updated regularly from Buyer systems. However, offers are subject to change. The Buyer&apos;s own price lock policy (typically 30 days) governs the final offer. Revend does not guarantee the price shown is the price you will receive — that guarantee is between you and the Buyer.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">4. Third-Party Buyers</h2>
            <p>Buyers listed on Revend are independent businesses. By clicking through to a Buyer, you enter a separate agreement with that Buyer. Revend is not party to that transaction and is not responsible for Buyer actions, non-payment, or disputes. We do vet Buyers before listing, but we are not a guarantor.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">5. Acceptable Use</h2>
            <p>You may not use Revend for price manipulation, bulk scraping without permission, or any activity that violates applicable law. Buyers may not list inflated prices they cannot honor.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">6. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Indiana. Disputes shall be resolved by binding arbitration in Indianapolis, Indiana.</p>
            <p className="text-xs text-slate-400 mt-4">These Terms of Service are a draft. Please have an attorney review before publishing. Contact: legal@revend.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
