import React from 'react'
import type { Analytics } from '@/lib/types'

interface WinRateChartProps {
  analytics: Analytics
}

export function WinRateChart({ analytics }: WinRateChartProps) {
  const maxBar = 100
  const winRatePct = Math.min(analytics.winRate, 100)
  const isGood = analytics.winRate >= 50

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Win Rate</h3>
        <span className={`text-sm font-bold ${isGood ? 'text-success' : 'text-danger'}`}>
          {analytics.winRate.toFixed(1)}%
        </span>
      </div>
      <div className="relative w-full" style={{ height: 48 }}>
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${maxBar - winRatePct}%`,
            backgroundColor: 'rgba(226, 232, 240, 0.6)',
          }}
        />
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${winRatePct}%`,
            backgroundColor: isGood ? 'rgba(22, 163, 74, 0.8)' : 'rgba(220, 38, 38, 0.8)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: isGood ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)',
            color: isGood ? 'rgba(22, 163, 74)' : 'rgba(220, 38, 38)',
          }}
        >
          {analytics.winRate.toFixed(0)}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {analytics.wins} wins out of {analytics.totalTrades} trades
      </p>
    </div>
  )
}
