import React from 'react'
import type { Analytics } from '@/lib/types'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

const accentColors = {
  primary: 'bg-blue-500/10 text-blue-600',
  success: 'bg-green-500/10 text-green-600',
  warning: 'bg-yellow-500/10 text-yellow-600',
  danger: 'bg-red-500/10 text-red-600',
  neutral: 'bg-neutral-500/10 text-neutral-600',
}

export function StatCard({ label, value, sub, accent = 'primary' }: StatCardProps) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      <div className={`mt-3 w-full h-2 rounded-full ${accentColors[accent]}`} />
    </div>
  )
}

interface DashboardStatsProps {
  analytics: Analytics
}

export function DashboardStats({ analytics }: DashboardStatsProps) {
  const parts: { label: string; value: string; sub?: string; accent: 'primary' | 'success' | 'danger' }[] = [
    { label: 'Total Trades', value: analytics.totalTrades.toString(), sub: 'Across all time', accent: 'primary' },
    { label: 'Win Rate', value: `${analytics.winRate.toFixed(1)}%`, sub: 'Wins ÷ total trades', accent: 'success' },
    { label: 'Net P&L', value: `$${analytics.totalProfit.toFixed(2)}`, sub: analytics.totalLoss > 0 ? `Loss: $${analytics.totalLoss.toFixed(2)}` : undefined, accent: analytics.totalProfit >= 0 ? 'success' : 'danger' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {parts.map((p) => (
        <StatCard key={p.label} {...p} />
      ))}
    </div>
  )
}
