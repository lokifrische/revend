import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type ClickRow = {
  id: string
  device_id: string | null
  buyer_id: string | null
  condition_id: string | null
  offer_cents: number | null
  session_id: string | null
  clicked_at: string
  // joined
  buyer_name?: string | null
  buyer_slug?: string | null
  device_name?: string | null
  device_slug?: string | null
  condition_name?: string | null
  condition_slug?: string | null
}

async function getRecentClicks(): Promise<ClickRow[]> {
  const supabase = createServiceClient()

  // Fetch last 50 clicks with joined buyer/device/condition
  const { data, error } = await supabase
    .from('affiliate_clicks')
    .select(`
      id,
      device_id,
      buyer_id,
      condition_id,
      offer_cents,
      session_id,
      clicked_at,
      buyers(name, slug),
      devices(device_families(name, slug)),
      conditions(name, slug)
    `)
    .order('clicked_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[admin/clicks] fetch error:', error.message)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    device_id: row.device_id,
    buyer_id: row.buyer_id,
    condition_id: row.condition_id,
    offer_cents: row.offer_cents,
    session_id: row.session_id,
    clicked_at: row.clicked_at,
    buyer_name: row.buyers?.name ?? null,
    buyer_slug: row.buyers?.slug ?? null,
    device_name: row.devices?.device_families?.name ?? null,
    device_slug: row.devices?.device_families?.slug ?? null,
    condition_name: row.conditions?.name ?? null,
    condition_slug: row.conditions?.slug ?? null,
  }))
}

function formatOffer(cents: number | null): string {
  if (cents === null) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  } catch {
    return iso
  }
}

export default async function AdminClicksPage() {
  const clicks = await getRecentClicks()

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Attribution Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Last 50 affiliate clicks — real-time from Supabase
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Live
            </span>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Total shown</p>
            <p className="text-2xl font-bold text-slate-900">{clicks.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Unique sessions</p>
            <p className="text-2xl font-bold text-slate-900">
              {new Set(clicks.map(c => c.session_id).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Avg offer</p>
            <p className="text-2xl font-bold text-slate-900">
              {clicks.filter(c => c.offer_cents).length > 0
                ? formatOffer(
                    Math.round(
                      clicks.filter(c => c.offer_cents).reduce((s, c) => s + (c.offer_cents ?? 0), 0) /
                      clicks.filter(c => c.offer_cents).length
                    )
                  )
                : '—'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Unique buyers</p>
            <p className="text-2xl font-bold text-slate-900">
              {new Set(clicks.map(c => c.buyer_id).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {clicks.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-4xl mb-3">📊</p>
              <p className="font-medium text-slate-600">No clicks logged yet</p>
              <p className="text-sm mt-1">Clicks will appear here as users sell through Revend.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Device</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Buyer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Condition</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Offer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Session</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Click ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clicks.map((click) => (
                    <tr key={click.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-600 whitespace-nowrap text-xs">
                        {formatTime(click.clicked_at)}
                      </td>
                      <td className="px-5 py-3">
                        {click.device_name ? (
                          <span className="font-medium text-slate-800">{click.device_name}</span>
                        ) : click.device_id ? (
                          <span className="text-slate-400 font-mono text-xs">{click.device_id.slice(0, 8)}…</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {click.buyer_name ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-md bg-navy-800 text-white text-[9px] font-bold flex items-center justify-center">
                              {click.buyer_name.slice(0, 3).toUpperCase()}
                            </span>
                            <span className="font-medium text-slate-800">{click.buyer_name}</span>
                          </span>
                        ) : click.buyer_id ? (
                          <span className="text-slate-400 font-mono text-xs">{click.buyer_id.slice(0, 8)}…</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {click.condition_name ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            click.condition_slug === 'flawless' ? 'bg-teal-100 text-teal-700' :
                            click.condition_slug === 'good' ? 'bg-blue-100 text-blue-700' :
                            click.condition_slug === 'fair' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {click.condition_name}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="font-semibold text-slate-800">{formatOffer(click.offer_cents)}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        {click.session_id ? (
                          <span className="font-mono text-xs text-slate-400">{click.session_id.slice(0, 12)}…</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden xl:table-cell">
                        <span className="font-mono text-xs text-slate-400">{click.id.slice(0, 12)}…</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          ⚠️ No auth — internal use only. Add authentication before deploying to production.
        </p>
      </div>
    </div>
  )
}
