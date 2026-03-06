'use client'

/**
 * Admin Imports Page
 *
 * Allows admins to:
 * - Upload CSV files for buyer pricing
 * - View import history
 * - Trigger manual syncs
 * - See import success/failure rates
 */

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import type { Metadata } from 'next'

interface ImportLog {
  id: string
  buyer_id: string
  buyers?: { name: string; slug: string }
  import_type: string
  file_name: string | null
  status: string
  rows_processed: number
  rows_failed: number
  error_message: string | null
  started_at: string
  completed_at: string | null
  created_by: string | null
}

interface Buyer {
  id: string
  name: string
  slug: string
}

export default function ImportsPage() {
  const [imports, setImports] = useState<ImportLog[]>([])
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState('')
  const [syncingAll, setSyncingAll] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    // Load import logs
    const { data: importData } = await supabase
      .from('import_logs')
      .select(`
        *,
        buyers!inner(name, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    setImports(importData || [])

    // Load buyers
    const { data: buyerData } = await supabase
      .from('buyers')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name')

    setBuyers(buyerData || [])

    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!selectedBuyer) {
      alert('Please select a buyer first')
      e.target.value = ''
      return
    }

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      e.target.value = ''
      return
    }

    setUploading(true)

    try {
      // Read file content
      const fileContent = await file.text()

      // Call import API
      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: selectedBuyer,
          fileName: file.name,
          csvContent: fileContent,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      alert(`Import started!\n\nProcessed: ${result.processed}\nFailed: ${result.failed}`)
      loadData() // Refresh imports list
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  async function handleSyncAll() {
    if (!confirm('Trigger sync for all active buyer integrations?')) {
      return
    }

    setSyncingAll(true)

    try {
      const response = await fetch('/api/admin/sync-all-buyers', {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Sync failed')
      }

      alert(
        `Sync completed!\n\n` +
          `Success: ${result.summary?.succeeded || 0}\n` +
          `Failed: ${result.summary?.failed || 0}`
      )
      loadData()
    } catch (err) {
      console.error('Sync failed:', err)
      alert('Sync failed: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSyncingAll(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  function formatDuration(startedAt: string, completedAt: string | null) {
    if (!completedAt) return '—'

    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const durationMs = end.getTime() - start.getTime()
    const seconds = Math.round(durationMs / 1000)

    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F1C2E' }}>
      <Header alwaysOpaque />

      <main className="flex-1 max-w-7xl mx-auto px-4 pt-24 pb-12 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">CSV Imports</h1>
            <p className="text-slate-400">Upload buyer pricing data and view import history</p>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-6 py-3 bg-[#00C4B4] text-white rounded-lg font-semibold hover:bg-[#00A89A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncingAll ? '🔄 Syncing...' : '🔄 Sync All Buyers'}
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Upload CSV</h2>

          <div className="flex gap-4 items-end">
            {/* Buyer Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Buyer
              </label>
              <select
                value={selectedBuyer}
                onChange={e => setSelectedBuyer(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"
              >
                <option value="">— Select a buyer —</option>
                {buyers.map(buyer => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label
                className={`cursor-pointer px-6 py-3 rounded-lg font-semibold transition-colors inline-block ${
                  selectedBuyer && !uploading
                    ? 'bg-[#00C4B4] text-white hover:bg-[#00A89A]'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {uploading ? '⏳ Uploading...' : '📤 Upload CSV'}
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={!selectedBuyer || uploading}
                />
              </label>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Expected CSV format: device_name, storage_gb, carrier, condition, price_usd
          </p>
        </div>

        {/* Import History */}
        <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Import History</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-slate-400">Loading imports...</div>
          ) : imports.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              No imports yet. Upload your first CSV above.
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
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Processed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Failed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {imports.map(log => (
                    <tr
                      key={log.id}
                      className="hover:bg-white/5 transition-colors"
                      title={log.error_message || undefined}
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {log.buyers?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm">
                        {log.file_name || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {log.import_type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-mono text-sm">
                        {log.rows_processed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-red-400 font-mono text-sm">
                        {log.rows_failed > 0 ? log.rows_failed.toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {formatDuration(log.started_at, log.completed_at)}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(log.started_at).toLocaleDateString()} <br />
                        <span className="text-xs text-slate-500">
                          {new Date(log.started_at).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          🔒 Protected by HTTP Basic Auth. For CLI import, use:{' '}
          <code className="bg-white/10 px-2 py-1 rounded">
            npx tsx scripts/import-buyer-csv.ts [buyer_slug] [csv_file]
          </code>
        </p>
      </main>
    </div>
  )
}
