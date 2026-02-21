'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, TrendingUp } from 'lucide-react'
import { searchDevices, popularDevices, type Device } from '@/lib/data'
import { cn } from '@/lib/cn'

const POPULAR = popularDevices.slice(0, 6)

interface DeviceSearchProps {
  placeholder?: string
  large?: boolean
  className?: string
}

export default function DeviceSearch({ placeholder = 'Search any phone, tablet, or laptop...', large = false, className }: DeviceSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Device[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [selected, setSelected] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search on query change
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const r = searchDevices(query)
    setResults(r)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showDropdown = focused && (results.length > 0 || query.length < 2)

  const navigateToDevice = useCallback((device: Device) => {
    setOpen(false)
    setQuery('')
    router.push(`/sell/${device.categorySlug}/${device.brandSlug}/${device.slug}`)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : POPULAR
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selected >= 0 && items[selected]) {
        navigateToDevice(items[selected])
      } else if (query.length >= 2 && results.length > 0) {
        navigateToDevice(results[0])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Input */}
      <div className={cn(
        'flex items-center gap-3 bg-white rounded-2xl transition-all duration-200',
        large ? 'px-5 py-4 shadow-2xl' : 'px-4 py-3 shadow-lg',
        focused ? 'ring-2 ring-teal-400 shadow-teal-100' : 'ring-1 ring-slate-200 hover:ring-slate-300'
      )}>
        <Search className={cn('shrink-0 text-teal-500', large ? 'w-5 h-5' : 'w-4 h-4')} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setSelected(-1) }}
          onFocus={() => { setFocused(true); setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent outline-none text-navy-800 placeholder:text-slate-400 min-w-0',
            large ? 'text-lg' : 'text-sm'
          )}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        )}
        {large && (
          <button
            onClick={() => results.length > 0 && navigateToDevice(results[0])}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/30"
          >
            Compare
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-2">
                Results
              </p>
              {results.map((device, i) => (
                <button
                  key={device.id}
                  onClick={() => navigateToDevice(device)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                    selected === i && 'bg-teal-50'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-base">
                      {device.category === 'Phones' ? '📱' : device.category === 'Tablets' ? '💻' : device.category === 'Laptops' ? '🖥️' : device.category === 'Smartwatches' ? '⌚' : '📦'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{device.name}</p>
                    <p className="text-xs text-slate-400">{device.brand} · {device.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-teal-600">Up to ${device.maxOffer}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Popular Right Now
                </p>
              </div>
              {POPULAR.map((device, i) => (
                <button
                  key={device.id}
                  onClick={() => navigateToDevice(device)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                    selected === i && 'bg-teal-50'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-base">
                      {device.category === 'Phones' ? '📱' : device.category === 'Tablets' ? '💻' : device.category === 'Laptops' ? '🖥️' : '📦'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{device.name}</p>
                    <p className="text-xs text-slate-400">{device.brand}</p>
                  </div>
                  <p className="text-sm font-semibold text-teal-600 shrink-0">Up to ${device.maxOffer}</p>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <p className="text-xs text-slate-400 text-center">
              {results.length > 0 ? `${results.length} results found` : '600+ devices available'}
              {' · '}
              <span className="text-teal-500">Free to compare</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
