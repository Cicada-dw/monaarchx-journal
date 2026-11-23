'use client'

import React, { useState } from 'react'
import type { JournalEntry } from '@/lib/types'

interface JournalFormProps {
  onSubmitted?: () => void
  initial?: JournalEntry | null
}

export function JournalForm({ onSubmitted, initial }: JournalFormProps) {
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [tags, setTags] = useState(initial?.tags?.join(', ') ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, title, content, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create entry')
      setTitle('')
      setContent('')
      setTags('')
      onSubmitted?.()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (initial && initial.id) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-foreground">Editing entry</h3>
        <p className="text-xs text-muted-foreground mt-1">Updated entries are saved automatically.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">New Journal Entry</h3>
      {error && <p className="text-sm text-danger">{error}</p>}
      <input
        className="input"
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea"
        rows={4}
        placeholder="What did you experience, what did you learn, what would you do differently?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="input"
        placeholder="Tags (comma-separated, e.g. trend, support, news)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save Entry'}
      </button>
    </form>
  )
}
