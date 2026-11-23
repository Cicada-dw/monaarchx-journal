'use client'

import React, { useEffect, useState } from 'react'
import type { JournalEntry } from '@/lib/types'
import { JournalForm } from './JournalForm'

interface JournalListProps {
  onEdit?: (entry: JournalEntry) => void
}

export function JournalList({ onEdit }: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/journal')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this journal entry?')) return
    await fetch(`/api/journal?id=${id}`, { method: 'DELETE' })
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading journal…</p>
  }

  return (
    <div className="space-y-4">
      <JournalForm onSubmitted={() => fetch('/api/journal').then((r) => r.json()).then((d) => setEntries(d.entries || []))} />
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Recent Entries ({entries.length})
        </h3>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No journal entries yet. Start writing one above.</p>
        ) : (
          <div className="table">
            <div className="flex rounded-t-lg bg-secondary/50">
              <div className="px-4 py-3 text-left">Date</div>
              <div className="px-4 py-3 text-left">Title</div>
            </div>
            {entries.map((e) => (
              <div key={e.id} className="flex border-b border-border last:border-b-0">
                <div className="px-4 py-3 text-xs text-muted-foreground">{e.date}</div>
                <div className="px-4 py-3">
                  <button
                    onClick={() => onEdit?.(e)}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    {e.title}
                  </button>
                </div>
                <div className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-xs text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
