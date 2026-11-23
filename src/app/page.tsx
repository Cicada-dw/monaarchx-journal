import { Layout } from '@/components/Layout'
import { DashboardStats } from '@/components/DashboardStats'
import { WinRateChart } from '@/components/WinRateChart'
import { BestPairsTable } from '@/components/BestPairsTable'
import type { Analytics } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getAnalytics() {
  const analyticsUrl = new URL('/api/analytics', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const res = await fetch(analyticsUrl.href, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return (await res.json()).analytics as Analytics
}

export default async function DashboardPage() {
  const analytics = await getAnalytics()

  return (
    <Layout title="Dashboard">
      {!analytics ? (
        <p className="text-muted-foreground">Failed to load analytics. Please try again later.</p>
      ) : (
        <>
          <DashboardStats analytics={analytics} />

          <div className="card p-5 mb-6">
            <WinRateChart analytics={analytics} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BestPairsTable pairs={analytics.bestPairs} title="Top Pairs" emptyMessage="No trade data yet." />
            <BestPairsTable pairs={analytics.worstPairs} title="Pairs to Watch" emptyMessage="No trade data yet." />
          </div>
        </>
      )}
    </Layout>
  )
}
