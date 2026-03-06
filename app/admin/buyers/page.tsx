'use client'

/**
 * Admin Buyers Page
 *
 * View and manage buyer integrations
 * - See all active buyers
 * - Check integration status
 * - View offer counts
 * - Last sync timestamps
 */

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Link from 'next/link'

interface BuyerIntegration {
  id: string
  buyer_id: string
  integration_type: string
  is_active: boolean
  last_sync_at: string | null
  next_sync_at: string | null
  sync_frequency_minutes: number
  sync_enabled: boolean
  buyers?: {
    id: string
    name: string
    slug: string
    website: string | null
    is_active: boolean
  }
}

interface BuyerStats {
  buyer_id: string
  offer_count: number
  last_price_update: string | null
}

export default function BuyersPage() {
  const [integrations, setIntegrations] = useState<BuyerIntegration[]>([])
  const [stats, setStats] = useState<Record<string, BuyerStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    // Load buyer integrations
    const { data: integrationData } = await supabase
      .from('buyer_integrations')
      .select(`
        *,
        buyers!inner(id, name, slug, website, is_active)
      `)
      .order('buyers(name)')

    setIntegrations(integrationData || [])

    // Load buyer stats (offer counts)
    const { data: offersData } = await supabase
      .from('offers')
      .select('buyer_id, offer_cents, last_updated_at')
      .eq('is_active', true)

    // Group by buyer
    const statsMap: Record<string, BuyerStats> = {}

    offersData?.forEach(offer => {
      if (!statsMap[offer.buyer_id]) {
        statsMap[offer.buyer_id] = {
          buyer_id: offer.buyer_id,
          offer_count: 0,
          last_price_update: null,
        }
      }

      statsMap[offer.buyer_id].offer_count++

      if (
        !statsMap[offer.buyer_id].last_price_update ||
        offer.last_updated_at > statsMap[offer.buyer_id].last_price_update!
      ) {
        statsMap[offer.buyer_id].last_price_update = offer.last_updated_at
      }
    })

    setStats(statsMap)
    setLoading(false)
  }

  function formatLastSync(timestamp: string | null) {
    if (!timestamp) return '—'

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  function getIntegrationBadge(type: string) {
    const badges: Record<string, { label: string; color: string }> = {
      csv_upload: { label: 'Manual CSV', color: 'bg-blue-500/20 text-blue-400' },
      csv_url: { label: 'Auto CSV', color: 'bg-green-500/20 text-green-400' },
      api: { label: 'API', color: 'bg-purple-500/20 text-purple-400' },
      manual: { label: 'Manual', color: 'bg-slate-500/20 text-slate-400' },
    }

    const badge = badges[type] || badges.manual

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1C2E' }}>
      <Header alwaysOpaque />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-24 pb-12 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Buyer Integrations</h1>
            <p className="text-slate-400">Manage buyer partnerships and pricing sync</p>
          </div>

          <Link
            href="/admin/imports"
            className="px-6 py-3 bg-[#00C4B4] text-white rounded-lg font-semibold hover:bg-[#00A89A] transition-colors"
          >
            📤 Import CSV
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-slate-400 text-sm mb-1">Active Buyers</div>
            <div className="text-3xl font-bold text-white">
              {integrations.filter(i => i.is_active).length}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-slate-400 text-sm mb-1">Total Offers</div>
            <div className="text-3xl font-bold text-white">
              {Object.values(stats).reduce((sum, s) => sum + s.offer_count, 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-slate-400 text-sm mb-1">Auto Syncing</div>
            <div className="text-3xl font-bold text-white">
              {integrations.filter(i => i.sync_enabled).length}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-slate-400 text-sm mb-1">API Integrations</div>
            <div className="text-3xl font-bold text-white">
              {integrations.filter(i => i.integration_type === 'api').length}
            </div>
          </div>
        </div>

        {/* Buyers Table */}
        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">All Buyers</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-slate-400">Loading buyers...</div>
          ) : integrations.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              No buyer integrations configured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Offers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Last Sync
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Next Sync
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {integrations.map(integration => {
                    const buyer = integration.buyers!
                    const buyerStats = stats[buyer.id]

                    return (
                      <tr key={integration.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium">{buyer.name}</div>
                            <div className="text-sm text-slate-400">{buyer.slug}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getIntegrationBadge(integration.integration_type)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                integration.is_active && buyer.is_active
                                  ? 'bg-green-500'
                                  : 'bg-slate-500'
                              }`}
                            />
                            <span className="text-sm text-slate-300">
                              {integration.is_active && buyer.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-mono">
                            {buyerStats?.offer_count.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatLastSync(integration.last_sync_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {integration.sync_enabled
                            ? formatLastSync(integration.next_sync_at)
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {integration.sync_enabled
                            ? `${integration.sync_frequency_minutes / 60}h`
                            : 'Manual'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Configure integrations via SQL: UPDATE buyer_integrations SET ...
        </p>
      </main>
    </div>
  )
}
