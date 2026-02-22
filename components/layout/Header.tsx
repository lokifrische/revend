'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const sellCategories = [
  { label: '📱 Phones', href: '/sell/phones' },
  { label: '💻 Tablets', href: '/sell/tablets' },
  { label: '⌚ Smartwatches', href: '/sell/smartwatches' },
  { label: '🖥️ Laptops', href: '/sell/laptops' },
  { label: '🎮 Consoles', href: '/sell/consoles' },
  { label: '🎧 Headphones', href: '/sell/headphones' },
]

const nav = [
  { label: 'Buyers', href: '/buyers' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Blog', href: '/blog' },
]

export default function Header({ alwaysOpaque = false }: { alwaysOpaque?: boolean }) {
  const [scrolled, setScrolled] = useState(alwaysOpaque)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)

  useEffect(() => {
    if (alwaysOpaque) return
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [alwaysOpaque])

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
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logo-header.png"
              alt="Revend"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Sell Device dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSellOpen(true)}
              onMouseLeave={() => setSellOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  scrolled
                    ? 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                Sell Device
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', sellOpen && 'rotate-180')} />
              </button>
              {sellOpen && (
                <div className="absolute top-full left-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 w-52 z-50 overflow-hidden">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pt-2 pb-1.5">Categories</p>
                  {sellCategories.map(cat => (
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
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  scrolled
                    ? 'text-slate-600 hover:text-navy-800 hover:bg-slate-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
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
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 hover:-translate-y-0.5"
            >
              Start Selling
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
              scrolled ? 'text-navy-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-2xl">
          <div className="px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Sell a Device</p>
            {sellCategories.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl min-h-[44px] flex items-center"
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
                className="block px-3 py-3 text-sm text-slate-600 hover:text-navy-800 hover:bg-slate-50 rounded-xl min-h-[44px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 pb-1">
              <Link
                href="/#search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-teal-500 text-white text-sm font-semibold rounded-xl min-h-[44px]"
              >
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
