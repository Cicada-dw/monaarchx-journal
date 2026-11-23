'use client'

import React, { useEffect, useState } from 'react'
import type { ThoughtEvaluation } from '@/lib/types'
import { addThoughtEvaluation } from '@/lib/db'

interface ThoughtEvaluationComponentProps {
  tradeDirection: 'BUY' | 'SELL' | null
  outcome: 'win' | 'loss' | 'breakeven'
}

export function ThoughtEvaluationComponent({ tradeDirection, outcome }: ThoughtEvaluationComponentProps) {
  const [thought, setThought] = useState('')
  const [evaluated, setEvaluated] = useState<ThoughtEvaluation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const evalResult = addThoughtEvaluation({
        thoughtProcess: thought,
        outcome,
        wasThoughtCorrect: null,
        explanation: '',
        tradeId: '',
      })
      setEvaluated(evalResult)
      setThought('')
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Thought Process Evaluation</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Write down your thinking before a trade, then check whether your direction was right or wrong.
      </p>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          rows={3}
          placeholder="What was I thinking before this trade? What was my edge, timeline, invalidation?"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
        <div className="flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading || !thought.trim()}>
            {loading ? 'Evaluating…' : 'Evaluate'}
          </button>
        </div>
        {evaluated && (
          <div className={`p-3 rounded ${evaluated.wasThoughtCorrect === true ? 'bg-green-500/10' : evaluated.wasThoughtCorrect === false ? 'bg-red-500/10' : 'bg-neutral-500/10'}`}>
            <p className="text-sm">{evaluated.explanation}</p>
          </div>
        )}
        {!evaluated && !loading && thought && (
          <p className="text-xs text-muted-foreground">Enter your thought process and click Evaluate to see the result.</p>
        )}
      </form>
    </div>
  )
}
