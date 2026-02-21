'use client'

import { useState } from 'react'
import { Star, Clock, Shield, ChevronDown, ChevronUp, ExternalLink, Copy, Check, Zap, Lock, Award } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { BuyerOffer } from '@/lib/data'

interface BuyerCardProps {
  offer: BuyerOffer
  rank: number
  deviceSlug: string
  conditionSlug: string
}

const paymentMethodConfig: Record<string, { label: string; color: string; bg: string }> = {
  PayPal:              { label: 'PayPal',     color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
  Venmo:               { label: 'Venmo',      color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  Zelle:               { label: 'Zelle',      color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  'Cash App':          { label: 'Cash App',   color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200' },
  Check:               { label: 'Check',      color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' },
  'Amazon Gift Card':  { label: 'Amazon',     color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
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
    window.open(`/go/${buyer.slug}/${deviceSlug}/${conditionSlug}`, '_blank')
    setTimeout(() => setClicked(false), 2000)
  }

  return (
    <div className={cn(
      'relative rounded-2xl border transition-all duration-200 group',
      isBestOffer
        ? 'border-teal-300 shadow-xl shadow-teal-100/60 bg-gradient-to-br from-teal-50/60 via-white to-white scale-[1.01]'
        : 'border-slate-200 bg-white hover:border-teal-200 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5'
    )}>

      {/* Best Offer badge */}
      {isBestOffer && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-teal-500 to-teal-400 text-white text-xs font-bold rounded-full shadow-lg shadow-teal-500/30 tracking-wide">
            <Zap className="w-3 h-3" />
            BEST OFFER
          </span>
        </div>
      )}

      <div className={cn('p-4 md:p-5', isBestOffer && 'pt-6')}>
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">

          {/* Rank bubble */}
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
            rank === 1 ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
          )}>
            {rank}
          </div>

          {/* Buyer identity */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0',
              rank === 1 ? 'bg-gradient-to-br from-teal-600 to-teal-800' : 'bg-gradient-to-br from-navy-700 to-navy-900'
            )}>
              {buyer.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-navy-800 truncate">{buyer.name}</p>
                {buyer.verified && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-teal-600 font-semibold bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-md">
                    <Shield className="w-2.5 h-2.5" />
                    Verified
                  </span>
                )}
              </div>
              {/* Stars */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.round(buyer.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">{buyer.rating} · {buyer.reviewCount.toLocaleString()} reviews</span>
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <div className="text-right">
              <p className={cn(
                'font-bold leading-none tabular-nums',
                isBestOffer ? 'text-3xl text-teal-600' : 'text-2xl text-navy-800'
              )}>
                ${offerPrice.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">{shippingFree ? 'Free shipping' : 'Incl. shipping'}</p>
            </div>
            <button
              onClick={handleSellNow}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap min-h-[44px]',
                isBestOffer
                  ? 'bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40 hover:-translate-y-0.5'
                  : 'bg-navy-800 hover:bg-navy-700 text-white hover:-translate-y-0.5'
              )}
            >
              {clicked ? 'Redirecting...' : 'Sell Now'}
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 flex-wrap">
          {/* Payment speed */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            Paid in <span className="font-bold text-navy-800">{buyer.paymentSpeedDays}d</span>
          </div>

          {/* Price lock */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-500">Locked for {lockDays} days</span>
          </div>

          {/* Payment chips */}
          <div className="flex items-center gap-1.5 flex-wrap ml-auto">
            {buyer.paymentMethods.slice(0, 3).map(method => {
              const cfg = paymentMethodConfig[method]
              return (
                <span
                  key={method}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-xs font-semibold border',
                    cfg ? `${cfg.color} ${cfg.bg}` : 'text-slate-600 bg-slate-50 border-slate-200'
                  )}
                >
                  {cfg?.label ?? method}
                </span>
              )
            })}
            {buyer.paymentMethods.length > 3 && (
              <span className="text-xs text-slate-400 font-medium">+{buyer.paymentMethods.length - 3}</span>
            )}
          </div>
        </div>

        {/* Promo code + expand toggle */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          {buyer.promoCode ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Promo:</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs font-mono font-bold text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {buyer.promoCode}
                {copied ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ) : <div />}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            Why this buyer?
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded: Why this buyer? */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in">
            <p className="text-sm text-slate-600 italic border-l-2 border-teal-300 pl-3">&ldquo;{buyer.tagline}&rdquo;</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-xs text-slate-400 mb-0.5">Experience</p>
                <p className="text-sm font-bold text-navy-800">{buyer.yearsActive} yrs</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <p className="text-xs text-slate-400 mb-0.5">Payment</p>
                <p className="text-sm font-bold text-navy-800">{buyer.paymentSpeedDays}d</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-xs text-slate-400 mb-0.5">Price Lock</p>
                <p className="text-sm font-bold text-navy-800">{lockDays}d</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Shield className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <p className="text-xs text-slate-400 mb-0.5">Reviews</p>
                <p className="text-sm font-bold text-navy-800">{(buyer.reviewCount / 1000).toFixed(1)}K</p>
              </div>
            </div>

            {/* Trust score bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500 font-medium">Trust Score</span>
                <span className="text-xs font-bold text-teal-600">{Math.round(buyer.rating * 20)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(buyer.rating * 20)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-teal-50 border border-teal-100 rounded-xl p-3">
              <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>This buyer is manually verified by Revend. Price is valid for {lockDays} days from today.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
