import { Leaf, Info } from 'lucide-react'
import Link from 'next/link'
import { getCO2Savings } from '@/lib/data'

interface ImpactStripProps {
  categorySlug: string
  deviceName: string
}

export default function ImpactStrip({ categorySlug, deviceName }: ImpactStripProps) {
  const co2kg = getCO2Savings(categorySlug)

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
        <Leaf className="w-4.5 h-4.5 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-emerald-800">
          Selling this {deviceName.split(' ').slice(-2).join(' ')} keeps ~<strong>{co2kg} kg of CO₂</strong> out of the atmosphere
        </p>
        <p className="text-xs text-emerald-600 mt-0.5">
          Manufacturing a new phone emits ~{co2kg}kg CO₂. Reselling extends device life and prevents this.
        </p>
      </div>
      <Link
        href="/sustainability"
        className="shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors"
        title="How does this work?"
      >
        <Info className="w-4 h-4" />
      </Link>
    </div>
  )
}
