import React from 'react'
import type { BestPair } from '@/lib/types'

interface BestPairsTableProps {
  pairs: BestPair[]
  title?: string
  emptyMessage?: string
}

export function BestPairsTable({ pairs, title = 'Best Pairs (by trade count)', emptyMessage = 'No trade data yet.' }: BestPairsTableProps) {
  if (pairs.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="table">
        <div className="flex rounded-t-lg bg-secondary/50">
          <div className="px-4 py-3 text-left">Pair</div>
          <div className="px-4 py-3 text-left text-center"># Trades</div>
          <div className="px-4 py-3 text-left text-center">Win Rate</div>
          <div className="px-4 py-3 text-left text-center">Total Profit</div>
        </div>
        {pairs.map((p) => (
          <div key={p.pair} className="flex border-b border-border last:border-b-0">
            <div className="px-4 py-3 font-medium text-foreground">{p.pair}</div>
            <div className="px-4 py-3 text-center">{p.tradeCount}</div>
            <div className="px-4 py-3 text-center">
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${p.winRate >= 50 ? 'text-success' : 'text-danger'}`}>
                {p.winRate.toFixed(0)}%
                <span className="text-[10px] opacity-60">({p.winningTrades})</span>
              </span>
            </div>
            <div className="px-4 py-3 text-center">
              <span className={p.totalProfit >= 0 ? 'text-success' : 'text-danger'}>
                ${p.totalProfit.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
