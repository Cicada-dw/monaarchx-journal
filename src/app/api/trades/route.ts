import { NextRequest, NextResponse } from 'next/server'
import { loadData, saveData, getTrades, addTrade, updateTrade, deleteTrade } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') ?? undefined
    const endDate = searchParams.get('endDate') ?? undefined
    const pair = searchParams.get('pair') ?? undefined

    const trades = getTrades({ startDate, endDate, pair })
    return NextResponse.json({ trades })
  } catch (err) {
    console.error('GET /api/trades error:', err)
    return NextResponse.json({ error: 'Failed to load trades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, pair, direction, entry, exit, profitLoss, thoughtProcess, outcome, tags, notes } = body

    if (!pair || !direction || !outcome) {
      return NextResponse.json({ error: 'Pair, direction, and outcome are required' }, { status: 400 })
    }

    const trade = addTrade({
      date: date || new Date().toISOString().slice(0, 10),
      pair: pair.toUpperCase(),
      direction: direction.toUpperCase() as 'BUY' | 'SELL',
      entry: entry ?? null,
      exit: exit ?? null,
      profitLoss: profitLoss ?? null,
      thoughtProcess: thoughtProcess ?? '',
      outcome: outcome as 'win' | 'loss' | 'breakeven' | 'pending',
      tags: tags || [],
      notes: notes ?? '',
    })

    return NextResponse.json({ trade }, { status: 201 })
  } catch (err) {
    console.error('POST /api/trades error:', err)
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing trade id' }, { status: 400 })
    }

    const body = await request.json()
    const { pair, direction, entry, exit, profitLoss, thoughtProcess, outcome, tags, notes } = body

    const trade = updateTrade(id, {
      pair: pair?.toUpperCase() ?? undefined,
      direction: direction?.toUpperCase() ?? undefined,
      entry: entry ?? undefined,
      exit: exit ?? undefined,
      profitLoss: profitLoss ?? undefined,
      thoughtProcess: thoughtProcess ?? undefined,
      outcome: outcome ?? undefined,
      tags: tags ?? undefined,
      notes: notes ?? undefined,
    })

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json({ trade })
  } catch (err) {
    console.error('PUT /api/trades error:', err)
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing trade id' }, { status: 400 })
    }

    const ok = deleteTrade(id)
    if (!ok) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/trades error:', err)
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 })
  }
}
