import { NextRequest, NextResponse } from 'next/server'
import { loadData, saveData, getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/db'

export async function GET() {
  try {
    const entries = getJournalEntries()
    return NextResponse.json({ entries })
  } catch (err) {
    console.error('GET /api/journal error:', err)
    return NextResponse.json({ error: 'Failed to load journal' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const entry = addJournalEntry({
      date: date || new Date().toISOString().slice(0, 10),
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (err) {
    console.error('POST /api/journal error:', err)
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, tags } = body

    const entry = updateJournalEntry(id, {
      title: title?.trim() ?? undefined,
      content: content?.trim() ?? undefined,
      tags: tags ?? undefined,
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json({ entry })
  } catch (err) {
    console.error('PUT /api/journal error:', err)
    return NextResponse.json({ error: 'Failed to update journal entry' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 })
    }

    const ok = deleteJournalEntry(id)
    if (!ok) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/journal error:', err)
    return NextResponse.json({ error: 'Failed to delete journal entry' }, { status: 500 })
  }
}
