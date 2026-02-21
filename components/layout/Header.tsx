'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const nav = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'All Buyers', href: '/buyers' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'About', href: '/about' },
]

const categories = [
  { label: 'Phones', href: '/sell/phones' },
  { label: 'Tablets', href: '/sell/tablets' },
  { label: 'Smartwatches', href: '/sell/smartwatches' },
  { label: 'Laptops', href: '/sell/laptops' },
  { label: 'Consoles', href: '/sell/consoles' },
  { label: 'Headphones', href: '/sell/headphones' },
]

export default function Header({ alwaysOpaque = false }: { alwaysOpaque?: boolean }) {
  const [scrolled, setScrolled] = useState(alwaysOpaque)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C4B4, #009e91)' }}>
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tight transition-colors',
              scrolled ? 'text-navy-800' : 'text-white'
            )}>
              revend
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Sell dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setSellOpen(true)}
                onMouseLeave={() => setSellOpen(false)}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scrolled ? 'text-slate-600 hover:text-navy-800 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                Sell a Device
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {sellOpen && (
                <div
                  onMouseEnter={() => setSellOpen(true)}
                  onMouseLeave={() => setSellOpen(false)}
                  className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-48 z-50"
                >
                  {categories.map(cat => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scrolled ? 'text-slate-600 hover:text-navy-800 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#search"
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              Find Best Price
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-navy-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            )}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">Sell a Device</p>
            {categories.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2" />
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 hover:text-navy-800 hover:bg-slate-50 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/#search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-teal-500 text-white text-sm font-semibold rounded-xl"
              >
                <Search className="w-4 h-4" />
                Find Best Price
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
