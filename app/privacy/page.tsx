import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Revend',
  description: 'How Revend collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-navy-800 text-white py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-slate-400 mb-1">Last updated: February 2026</p>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">1. Who We Are</h2>
              <p>Revend ("we," "us," or "our") is a device trade-in price comparison service. We operate revend.com, where consumers can compare offers from verified buyback companies for their used electronic devices.</p>
              <p>We are not a buyer ourselves. We connect sellers with buyers and earn a referral fee when a sale completes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">2. What We Collect</h2>
              <p><strong>Automatically collected:</strong> When you use Revend, we collect device information (browser, OS, device type), IP address (hashed for analytics, not stored raw), pages visited, search queries, and clicks made on buyer offers.</p>
              <p><strong>When you provide it:</strong> If you sign up for price alerts, we collect your email address. If you contact us, we collect your name and message content. If you apply as a buyer partner, we collect your business information.</p>
              <p><strong>What we do NOT collect:</strong> We never collect your device serial number, IMEI, account credentials, or payment information. All transactions occur on buyer websites, not ours.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To show you comparison prices and buyer offers</li>
                <li>To track clicks for referral commission purposes (anonymized after 90 days)</li>
                <li>To send price alerts if you signed up for them</li>
                <li>To improve our search and comparison engine</li>
                <li>To detect and prevent fraud</li>
              </ul>
              <p>We use PostHog for privacy-first analytics. We do NOT use Google Analytics on revend.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">4. Data Sharing</h2>
              <p>We share limited data with our buyer partners strictly for the purpose of tracking referral commissions. This includes: click ID, device model, condition selected, offer price at time of click, and timestamp. We share no personally identifiable information with buyers.</p>
              <p>We do not sell your data to third parties. Period.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">5. Cookies</h2>
              <p>We use a single first-party session cookie to track your comparison session. This is purely functional. We do not use advertising cookies or third-party tracking pixels on core comparison pages.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">6. Your Rights</h2>
              <p>You may request deletion of any personal data we hold (email address from alerts, contact form submissions). Email privacy@revend.com to submit a deletion request. We will process requests within 30 days.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-800 mb-3">7. Contact</h2>
              <p>Privacy questions: <a href="mailto:privacy@revend.com" className="text-teal-600 hover:underline">privacy@revend.com</a></p>
              <p className="text-xs text-slate-400 mt-4">This policy is effective February 2026. We will notify users of material changes via the email provided at signup or via a banner on the site.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
