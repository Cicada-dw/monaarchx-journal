import { NextRequest, NextResponse } from 'next/server'
import { loadData, saveData, getTrades } from '@/lib/db'
import { computeAnalytics } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') ?? undefined
    const endDate = searchParams.get('endDate') ?? undefined
    const pair = searchParams.get('pair') ?? undefined

    const trades = getTrades({ startDate, endDate, pair })

    let analytics
    if (pair) {
      const filtered = trades.filter((t) => t.pair === pair.toUpperCase())
      analytics = computeAnalytics(filtered)
    } else {
      analytics = computeAnalytics(trades)
    }

    return NextResponse.json({ analytics, trades })
  } catch (err) {
    console.error('GET /api/analytics error:', err)
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 })
  }
}
