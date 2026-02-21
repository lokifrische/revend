'use client'

import { useState } from 'react'
import { Star, Clock, Shield, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { BuyerOffer } from '@/lib/data'

interface BuyerCardProps {
  offer: BuyerOffer
  rank: number
  deviceSlug: string
  conditionSlug: string
}

const paymentIcons: Record<string, string> = {
  PayPal: '🅿️',
  Venmo: '💜',
  Zelle: '💜',
  'Cash App': '💚',
  Check: '📄',
  'Amazon Gift Card': '🛒',
}

export default function BuyerCard({ offer, rank, deviceSlug, conditionSlug }: BuyerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [clicked, setClicked] = useState(false)

  const { buyer, offerPrice, isBestOffer, shippingFree, lockDays } = offer

  const handleCopyCode = () => {
    if (buyer.promoCode) {
      navigator.clipboard.writeText(buyer.promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSellNow = () => {
    setClicked(true)
    // In production: POST /api/go → get tracking URL
    // For now, navigate to the interstitial page
    window.open(`/go/${buyer.slug}/${deviceSlug}/${conditionSlug}`, '_blank')
    setTimeout(() => setClicked(false), 2000)
  }

  return (
    <div className={cn(
      'relative rounded-2xl border transition-all duration-200',
      isBestOffer
        ? 'border-teal-300 shadow-lg shadow-teal-100 bg-gradient-to-br from-teal-50/50 to-white'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
    )}>
      {/* Best offer badge */}
      {isBestOffer && (
        <div className="absolute -top-3 left-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full shadow-md">
            ⭐ Best Offer
          </span>
        </div>
      )}

      <div className="p-4 md:p-5">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
            rank === 1 ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
          )}>
            {rank}
          </div>

          {/* Buyer logo + name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0',
              rank === 1 ? 'bg-teal-600' : 'bg-navy-700'
            )}>
              {buyer.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-navy-800 truncate">{buyer.name}</p>
                {buyer.verified && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-teal-600 font-medium">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              {/* Stars */}
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.round(buyer.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">{buyer.rating} ({buyer.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className={cn(
                'text-2xl font-bold',
                isBestOffer ? 'text-teal-600' : 'text-navy-800'
              )}>
                ${offerPrice.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">{shippingFree ? 'Free shipping' : 'Shipping included'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className={cn('text-xl font-bold sm:hidden', isBestOffer ? 'text-teal-600' : 'text-navy-800')}>
                ${offerPrice.toLocaleString()}
              </p>
              <button
                onClick={handleSellNow}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  isBestOffer
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5'
                    : 'bg-navy-800 hover:bg-navy-700 text-white'
                )}
              >
                {clicked ? 'Redirecting...' : 'Sell Now'}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick info bar */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>Pays in <strong className="text-navy-700">{buyer.paymentSpeedDays} {buyer.paymentSpeedDays === 1 ? 'day' : 'days'}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            {buyer.paymentMethods.slice(0, 3).map(method => (
              <span key={method} title={method}>{paymentIcons[method] ?? '💳'}</span>
            ))}
            {buyer.paymentMethods.length > 3 && (
              <span className="text-slate-400">+{buyer.paymentMethods.length - 3}</span>
            )}
          </div>
          {buyer.promoCode && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-slate-500">Code:</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs font-mono font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {buyer.promoCode}
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors ml-auto"
          >
            Details {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <p className="text-sm text-slate-600 italic">&ldquo;{buyer.tagline}&rdquo;</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Years Active</p>
                <p className="text-sm font-semibold text-navy-800">{buyer.yearsActive} years</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Lock-in Period</p>
                <p className="text-sm font-semibold text-navy-800">{lockDays} days</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Payment</p>
                <p className="text-sm font-semibold text-navy-800">{buyer.paymentMethods[0]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
