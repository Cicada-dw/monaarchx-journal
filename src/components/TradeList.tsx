'use client'

import React, { useEffect, useState } from 'react'
import type { Trade } from '@/lib/types'
import { TradeForm } from './TradeForm'

interface TradeListProps {
  onEdit?: (trade: Trade) => void
}

export function TradeList({ onEdit }: TradeListProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trades')
      .then((res) => res.json())
      .then((data) => {
        setTrades(data.trades || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trade record?')) return
    await fetch(`/api/trades?id=${id}`, { method: 'DELETE' })
    setTrades((prev) => prev.filter((t) => t.id !== id))
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading trades…</p>
  }

  return (
    <div className="space-y-4">
      <TradeForm onSubmitted={() => fetch('/api/trades').then((r) => r.json()).then((d) => setTrades(d.trades || []))} />
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Trade Records ({trades.length})
        </h3>
        {trades.length === 0 ? (
          <p className="text-muted-foreground text-sm">No trades logged yet. Log your first trade above.</p>
        ) : (
          <div className="table">
            <div className="flex rounded-t-lg bg-secondary/50">
              <div className="px-4 py-3 text-left">Date</div>
              <div className="px-4 py-3 text-left">Pair</div>
              <div className="px-4 py-3 text-center">Direction</div>
              <div className="px-4 py-3 text-center">Outcome</div>
              <div className="px-4 py-3 text-center">P&amp;L</div>
            </div>
            {trades.map((t) => (
              <div key={t.id} className="flex border-b border-border last:border-b-0">
                <div className="px-4 py-3 text-xs text-muted-foreground">{t.date}</div>
                <div className="px-4 py-3 font-medium">{t.pair}</div>
                <div className="px-4 py-3 text-center">
                  <span className={t.direction === 'BUY' ? 'text-success font-bold' : 'text-danger font-bold'}>
                    {t.direction}
                  </span>
                </div>
                <div className="px-4 py-3 text-center">
                  <span className={`badge-${t.outcome}`}>{t.outcome}</span>
                </div>
                <div className="px-4 py-3 text-center">
                  <span className={t.profitLoss !== null ? (t.profitLoss >= 0 ? 'text-success' : 'text-danger') : ''}>
                    {t.profitLoss !== null ? '$' + t.profitLoss.toFixed(2) : '-'}
                  </span>
                </div>
                <div className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-xs text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
