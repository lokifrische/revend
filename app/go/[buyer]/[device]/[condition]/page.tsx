'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Copy, Check, ArrowLeft, Shield } from 'lucide-react'
import { buyers, devices } from '@/lib/data'

export default function GoPage() {
  const params = useParams()
  const buyerSlug = params.buyer as string
  const deviceSlug = params.device as string
  const conditionSlug = params.condition as string

  const [countdown, setCountdown] = useState(3)
  const [copied, setCopied] = useState(false)
  const [redirected, setRedirected] = useState(false)

  const buyer = buyers.find(b => b.slug === buyerSlug)
  const device = devices.find(d => d.slug === deviceSlug)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          setRedirected(true)
          // In production: redirect to actual buyer URL with tracking
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

  if (!buyer || !device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-navy-800 mb-2">Something went wrong</p>
          <Link href="/" className="text-teal-600 hover:underline">← Back to Revend</Link>
        </div>
      </div>
    )
  }

  const conditionName = conditionSlug.charAt(0).toUpperCase() + conditionSlug.slice(1)

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
            <p className="text-xs text-teal-100">Revend has verified this buyer&apos;s payment track record</p>
          </div>

          <div className="p-7">
            {/* Buyer logo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center text-white font-bold text-base">
                {buyer.logo}
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-800">Taking you to {buyer.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  For your {device.name} — {conditionName} condition
                </p>
              </div>
            </div>

            {/* Promo code */}
            {buyer.promoCode && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <p className="text-xs font-semibold text-amber-700 mb-2">🎁 Use this code at {buyer.name}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2">
                    <span className="text-base font-mono font-bold text-amber-700">{buyer.promoCode}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-amber-600 mt-2">This code was unlocked by Revend — paste it at checkout</p>
              </div>
            )}

            {/* Redirect button */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setRedirected(true)
                  // In production: window.open(buyer.tracking_url, '_blank')
                  alert(`[Demo] Would redirect to ${buyer.name} with tracking. In production, this opens the buyer's site with a promo code + click tracking.`)
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-2xl transition-all"
              >
                Continue to {buyer.name}
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
              <Link href={`/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}?condition=${conditionSlug}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to compare
              </Link>
              <p className="text-xs text-slate-400">
                Price locked for 30 days
              </p>
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
