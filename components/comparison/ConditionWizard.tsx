'use client'

import { conditions, type Condition } from '@/lib/data'
import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

interface ConditionWizardProps {
  selected?: string
  deviceMaxOffer: number
  onSelect: (slug: string) => void
}

const colorMap: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  teal:  { bg: 'bg-teal-50',  border: 'border-teal-400',  badge: 'bg-teal-500 text-white',  text: 'text-teal-700' },
  blue:  { bg: 'bg-blue-50',  border: 'border-blue-400',  badge: 'bg-blue-500 text-white',  text: 'text-blue-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-400', badge: 'bg-amber-500 text-white', text: 'text-amber-700' },
  red:   { bg: 'bg-red-50',   border: 'border-red-400',   badge: 'bg-red-500 text-white',   text: 'text-red-700' },
}

export default function ConditionWizard({ selected, deviceMaxOffer, onSelect }: ConditionWizardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-navy-800 mb-1">What condition is your device?</h3>
        <p className="text-sm text-slate-500">Be honest — buyers verify condition on arrival. Select the closest match.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {conditions.map((cond) => {
          const isSelected = selected === cond.slug
          const price = Math.round(deviceMaxOffer * cond.priceMultiplier)
          const colors = colorMap[cond.color]

          return (
            <button
              key={cond.id}
              onClick={() => onSelect(cond.slug)}
              className={cn(
                'relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-200',
                'hover:shadow-md hover:-translate-y-0.5',
                isSelected
                  ? `${colors.bg} ${colors.border} shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              {/* Selected check */}
              {isSelected && (
                <div className={cn('absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center', colors.badge)}>
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Icon */}
              <span className="text-2xl mb-2">{cond.icon}</span>

              {/* Name */}
              <p className={cn(
                'text-sm font-semibold mb-1',
                isSelected ? colors.text : 'text-navy-800'
              )}>
                {cond.name}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{cond.description}</p>

              {/* Price preview */}
              <div className="mt-auto">
                <p className={cn('text-xs font-medium', isSelected ? colors.text : 'text-slate-400')}>
                  Up to
                </p>
                <p className={cn(
                  'text-lg font-bold',
                  isSelected ? colors.text : 'text-slate-600'
                )}>
                  ${price}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
