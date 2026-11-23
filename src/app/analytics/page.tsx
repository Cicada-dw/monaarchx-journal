import { Layout } from '@/components/Layout'
import { DashboardStats } from '@/components/DashboardStats'
import { WinRateChart } from '@/components/WinRateChart'
import { BestPairsTable } from '@/components/BestPairsTable'
import type { Analytics } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getAnalytics() {
  const analyticsUrl = new URL('/api/analytics', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const res = await fetch(analyticsUrl.href)
  if (!res.ok) return null
  return (await res.json()).analytics as Analytics
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <Layout title="Analytics">
      {!analytics ? (
        <p className="text-muted-foreground">Failed to load analytics. Please try again later.</p>
      ) : (
        <div className="space-y-6">
          <DashboardStats analytics={analytics} />

          <div className="card p-5">
            <WinRateChart analytics={analytics} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BestPairsTable pairs={analytics.bestPairs} title="Top Pairs" emptyMessage="No trade data yet." />
            <BestPairsTable pairs={analytics.worstPairs} title="Pairs to Watch" emptyMessage="No trade data yet." />
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Win Rate Calculation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-4">
                <p className="text-xs text-muted-foreground">Wins</p>
                <p className="text-2xl font-bold text-success">{analytics.wins}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-muted-foreground">Losses</p>
                <p className="text-2xl font-bold text-danger">{analytics.losses}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{analytics.winRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
