'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { Device } from '@/lib/data'
import { cn } from '@/lib/cn'

interface DeviceCardProps {
  device: Device
  variant?: 'default' | 'compact'
}

const categoryEmoji: Record<string, string> = {
  Phones: '📱',
  Tablets: '💻',
  Laptops: '🖥️',
  Smartwatches: '⌚',
  Consoles: '🎮',
  Headphones: '🎧',
}

// Brand accent colors for image backgrounds
const brandBg: Record<string, string> = {
  Apple: 'from-slate-100 to-slate-200',
  Samsung: 'from-blue-50 to-slate-100',
  Google: 'from-slate-50 to-blue-50',
  Sony: 'from-slate-800 to-slate-900',
  Nintendo: 'from-red-50 to-slate-100',
  OnePlus: 'from-slate-900 to-red-900',
  Microsoft: 'from-blue-50 to-slate-100',
}

export default function DeviceCard({ device, variant = 'default' }: DeviceCardProps) {
  const href = `/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}`
  const emoji = categoryEmoji[device.category] ?? '📦'
  const [imgError, setImgError] = useState(false)
  const bgGradient = brandBg[device.brand] ?? 'from-slate-50 to-slate-100'

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
          {!imgError && device.image ? (
            <Image
              src={device.image}
              alt={device.name}
              width={40}
              height={40}
              className="object-contain w-full h-full"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xl">{emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy-800 truncate">{device.name}</p>
          <p className="text-xs text-slate-400">{device.brand}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-teal-600">${device.maxOffer}</p>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 transition-colors ml-auto mt-0.5" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-lg hover:shadow-teal-50 hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      {/* Image area */}
      <div className={cn(
        'aspect-square bg-gradient-to-br flex items-center justify-center p-4 relative',
        bgGradient
      )}>
        {!imgError && device.image ? (
          <Image
            src={device.image}
            alt={device.name}
            width={220}
            height={220}
            className="object-contain w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-6xl">{emoji}</span>
        )}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            {device.releaseYear}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-slate-400 mb-1">{device.brand}</p>
        <p className="text-sm font-semibold text-navy-800 leading-tight mb-auto">{device.name}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Up to</p>
            <p className="text-lg font-bold text-teal-600">${device.maxOffer}</p>
          </div>
          <div className={cn(
            'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
            'bg-slate-100 text-slate-600 group-hover:bg-teal-500 group-hover:text-white'
          )}>
            Compare
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}
