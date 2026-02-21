import { RefreshCw } from 'lucide-react'
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

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-800">{offers.length} offers found</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <RefreshCw className="w-3 h-3" />
            Prices updated at {timeStr}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
            Verified buyer
          </span>
          <span className="flex items-center gap-1">
            🚚 Free shipping included
          </span>
        </div>
      </div>

      {/* Offers */}
      <div className="space-y-3 pt-2">
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

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center pt-2">
        Revend earns a referral fee when you sell through our links. This never affects the offer you receive.{' '}
        <a href="/disclosure" className="text-teal-500 hover:underline">Learn more</a>
      </p>
    </div>
  )
}
