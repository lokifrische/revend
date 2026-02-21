import { RefreshCw, Shield, Lock, Clock } from 'lucide-react'
import type { BuyerOffer } from '@/lib/data'
import BuyerCard from './BuyerCard'

interface ComparisonTableProps {
  offers: BuyerOffer[]
  deviceSlug: string
  conditionSlug: string
}

export default function ComparisonTable({ offers, deviceSlug, conditionSlug }: ComparisonTableProps) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">No offers available for this condition. Try a different condition.</p>
      </div>
    )
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // Lock expiry date (30 days from now)
  const lockExpiry = new Date(now)
  lockExpiry.setDate(lockExpiry.getDate() + 30)
  const lockExpiryStr = lockExpiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const bestOffer = offers[0]

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold text-navy-800">{offers.length} offers found</p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <RefreshCw className="w-3 h-3" />
            Prices updated {timeStr} · {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-500" />
            Verified buyers
          </span>
          <span className="flex items-center gap-1">
            🚚 Free shipping
          </span>
        </div>
      </div>

      {/* Best offer highlight */}
      {bestOffer && (
        <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">↑</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-teal-800">{bestOffer.buyer.name}</span>
            <span className="text-teal-700"> is paying the most — </span>
            <span className="font-bold text-teal-600 text-base">${bestOffer.offerPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Offers */}
      <div className="space-y-4 pt-2">
        {offers.map((offer, i) => (
          <BuyerCard
            key={offer.buyer.id}
            offer={offer}
            rank={i + 1}
            deviceSlug={deviceSlug}
            conditionSlug={conditionSlug}
          />
        ))}
      </div>

      {/* Trust signals footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span>Prices valid until <strong>{lockExpiryStr}</strong></span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span><strong>30-day price lock</strong> from all buyers</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
          <Shield className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span>All buyers <strong>verified & BBB-rated</strong></span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center pt-1">
        Revend earns a referral fee when you sell through our links. This never affects the offer you receive.{' '}
        <a href="/disclosure" className="text-teal-500 hover:underline">Learn more</a>
      </p>
    </div>
  )
}
