import Link from 'next/link'
import { Leaf, Twitter, Instagram, Linkedin } from 'lucide-react'

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
    { label: 'Price Check', href: '/price-check' },
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
      {/* Impact banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">7,248 metric tons of CO₂ saved</p>
                <p className="text-xs text-slate-400">By Revend users keeping devices out of landfills</p>
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-500">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold">revend</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The smart way to sell what you already have. Compare offers from 20+ verified buyers instantly.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors">
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
            © 2026 Revend. All rights reserved. Prices shown are from verified buyer partners and may vary.
          </p>
          <p className="text-xs text-slate-600">
            Revend is a comparison service — we never touch your device.
          </p>
        </div>
      </div>
    </footer>
  )
}
