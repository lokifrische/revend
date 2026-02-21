import Link from 'next/link'
import { Leaf, Twitter, Instagram, Linkedin, Shield } from 'lucide-react'

const links = {
  Sell: [
    { label: 'Sell a Phone', href: '/sell/phones' },
    { label: 'Sell a Tablet', href: '/sell/tablets' },
    { label: 'Sell a Laptop', href: '/sell/laptops' },
    { label: 'Sell a Smartwatch', href: '/sell/smartwatches' },
    { label: 'Sell a Console', href: '/sell/consoles' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'All Buyers', href: '/buyers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Business: [
    { label: 'Business Programs', href: '/business' },
    { label: 'Partner with Us', href: '/partners/apply' },
    { label: 'Affiliate Program', href: '/affiliates' },
    { label: 'API Access', href: '/api-docs' },
    { label: 'Price Alerts', href: '/price-alerts' },
    { label: 'Sell Broken Device', href: '/sell-broken' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Affiliate Disclosure', href: '/disclosure' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white">
      {/* Trust banner */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-slate-300 font-medium">BBB Accredited Buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300 font-medium">7,248 tons CO₂ saved</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-teal-400 font-bold text-sm">$8.2M+</span>
                <span className="text-sm text-slate-300 font-medium">paid out to sellers</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center sm:text-right max-w-sm">
              Every device sold through Revend keeps e-waste out of landfills and extends the life of existing electronics.
            </p>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00C4B4, #007a70)' }}
              >
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold">revend</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The smart way to sell what you already have. Compare offers from 7+ verified buyers instantly.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {section}
              </h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2026 Revend. We are not affiliated with any buyer listed.
          </p>
          <p className="text-xs text-slate-600">
            Revend is a comparison service — we never touch your device.
          </p>
        </div>
      </div>
    </footer>
  )
}
