'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Copy, Check, ArrowLeft, Shield } from 'lucide-react'

// The go page uses client-side state; buyer/device data is fetched from API
interface BuyerInfo {
  name: string
  slug: string
  logo: string
  promoCode?: string
  website?: string
}

interface DeviceInfo {
  name: string
  slug: string
  categorySlug: string
  brandSlug: string
}

export default function GoPage() {
  const params = useParams()
  const buyerSlug = params.buyer as string
  const deviceSlug = params.device as string
  const conditionSlug = params.condition as string

  const [countdown, setCountdown] = useState(3)
  const [copied, setCopied] = useState(false)
  const [redirected, setRedirected] = useState(false)
  const [buyer, setBuyer] = useState<BuyerInfo | null>(null)
  const [device, setDevice] = useState<DeviceInfo | null>(null)

  // Load buyer + device info from API
  useEffect(() => {
    // Fetch buyer from /api/popular (has buyer info via slug)
    // Simpler: fetch device from /api/search, buyer info from buyers list
    Promise.all([
      fetch(`/api/search?q=${encodeURIComponent(deviceSlug.replace(/-/g, ' '))}`).then(r => r.json()),
      fetch('/api/buyers').then(r => r.json()).catch(() => []),
    ]).then(([devices, buyers]: [any[], any[]]) => {
      const d = devices.find((x: any) => x.slug === deviceSlug) || devices[0]
      if (d) setDevice({ name: d.name, slug: d.slug, categorySlug: d.categorySlug, brandSlug: d.brandSlug })

      const b = buyers.find((x: any) => x.slug === buyerSlug)
      if (b) setBuyer({ name: b.name, slug: b.slug, logo: b.logo, website: b.website })
      else setBuyer({ name: buyerSlug, slug: buyerSlug, logo: buyerSlug.slice(0, 3).toUpperCase() })
    }).catch(() => {
      setBuyer({ name: buyerSlug, slug: buyerSlug, logo: buyerSlug.slice(0, 3).toUpperCase() })
    })
  }, [buyerSlug, deviceSlug])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          setRedirected(true)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopy = () => {
    if (buyer?.promoCode) {
      navigator.clipboard.writeText(buyer.promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const conditionName = conditionSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const displayName = device?.name ?? deviceSlug.replace(/-/g, ' ')
  const backHref = device
    ? `/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}?condition=${conditionSlug}`
    : '/'

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Main card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Top bar */}
          <div className="bg-teal-500 px-6 py-4 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Verified Buyer</span>
            </div>
            <p className="text-xs text-teal-100">
              Revend has verified this buyer&apos;s payment track record
            </p>
          </div>

          <div className="p-7">
            {/* Buyer logo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center text-white font-bold text-base">
                {buyer?.logo ?? '...'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-800">
                  Taking you to {buyer?.name ?? buyerSlug}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  For your {displayName} — {conditionName} condition
                </p>
              </div>
            </div>

            {/* Promo code (if any) */}
            {buyer?.promoCode && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <p className="text-xs font-semibold text-amber-700 mb-2">
                  🎁 Use this code at {buyer.name}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2">
                    <span className="text-base font-mono font-bold text-amber-700">
                      {buyer.promoCode}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  This code was unlocked by Revend — paste it at checkout
                </p>
              </div>
            )}

            {/* Redirect button */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setRedirected(true)
                  if (buyer?.website) {
                    window.open(buyer.website, '_blank')
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-2xl transition-all"
              >
                Continue to {buyer?.name ?? buyerSlug}
                <ExternalLink className="w-4 h-4" />
              </button>

              {!redirected && countdown > 0 && (
                <p className="text-center text-xs text-slate-400">
                  Auto-redirecting in {countdown}s...
                </p>
              )}
              {redirected && (
                <p className="text-center text-xs text-teal-500 font-medium">
                  ✓ Tracking recorded — Revend earns a small fee, you keep the full price
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={backHref}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to compare
              </Link>
              <p className="text-xs text-slate-400">Price locked for 30 days</p>
            </div>
          </div>
        </div>

        {/* Revend branding below */}
        <div className="text-center mt-5">
          <Link href="/" className="text-slate-400 text-xs hover:text-teal-400 transition-colors">
            ← Back to Revend
          </Link>
        </div>
      </div>
    </div>
  )
}
