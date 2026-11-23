'use client'

import React, { useState } from 'react'
import type { Trade } from '@/lib/types'

interface TradeFormProps {
  onSubmitted?: () => void
  initial?: Trade | null
}

export function TradeForm({ onSubmitted, initial }: TradeFormProps) {
  const [pair, setPair] = useState(initial?.pair ?? '')
  const [direction, setDirection] = useState<'BUY' | 'SELL'>(initial?.direction ?? 'BUY')
  const [entry, setEntry] = useState(initial?.entry?.toFixed(5) ?? '')
  const [exit, setExit] = useState(initial?.exit?.toFixed(5) ?? '')
  const [profitLoss, setProfitLoss] = useState(initial?.profitLoss?.toFixed(2) ?? '')
  const [outcome, setOutcome] = useState<'win' | 'loss' | 'breakeven' | 'pending'>(initial?.outcome ?? 'pending')
  const [thoughtProcess, setThoughtProcess] = useState(initial?.thoughtProcess ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          pair,
          direction,
          entry: entry ? parseFloat(entry) : null,
          exit: exit ? parseFloat(exit) : null,
          profitLoss: profitLoss ? parseFloat(profitLoss) : null,
          thoughtProcess,
          outcome,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create trade')
      setPair('')
      setDirection('BUY')
      setEntry('')
      setExit('')
      setProfitLoss('')
      setThoughtProcess('')
      setNotes('')
      setTags('')
      onSubmitted?.()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Log a Trade</h3>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Date</label>
        <input className="input" value={new Date().toISOString().slice(0, 10)} readOnly />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Pair</label>
        <input
          className="input"
          placeholder="e.g. EURUSD"
          value={pair}
          onChange={(e) => setPair(e.target.value.toUpperCase())}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Direction</label>
          <select className="input" value={direction} onChange={(e) => setDirection(e.target.value as 'BUY' | 'SELL')}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Outcome</label>
          <select className="input" value={outcome} onChange={(e) => setOutcome(e.target.value as any)}>
            <option value="pending">Pending</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Entry Price</label>
          <input className="input" placeholder="1.0850" value={entry} onChange={(e) => setEntry(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Exit Price</label>
          <input className="input" placeholder="1.0870" value={exit} onChange={(e) => setExit(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Profit / Loss ($)</label>
        <input className="input" placeholder="150.00" value={profitLoss} onChange={(e) => setProfitLoss(e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Thought Process</label>
        <textarea
          className="textarea"
          rows={3}
          placeholder="What was I thinking before this trade? What was my edge, timeline, invalidation?"
          value={thoughtProcess}
          onChange={(e) => setThoughtProcess(e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Notes (optional)</label>
        <input className="input" placeholder="e.g. Broke out of a range, rode the trend" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Tags (comma-separated)</label>
        <input className="input" placeholder="trend, breakout, support" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save Trade'}
      </button>
    </form>
  )
}
