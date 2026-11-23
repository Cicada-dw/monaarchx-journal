import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { AppData, Certificate, JournalEntry, Trade, ThoughtEvaluation } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'app-data.json')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const DEFAULT_DATA: AppData = {
  trades: [],
  journal: [],
  certificate: {
    id: 'default',
    name: 'No certificate uploaded',
    link: '',
    fileBase64: null,
    uploadedAt: '',
  },
  thoughtEvaluations: [],
}

export function loadData(): AppData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return DEFAULT_DATA
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_DATA, ...parsed }
  } catch (err) {
    console.error('Failed to load data:', err)
    return DEFAULT_DATA
  }
}

export function saveData(data: AppData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save data:', err)
    throw err
  }
}

export function generateId(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase()
}

export function getTodaysDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addTrade(trade: Omit<Trade, 'id' | 'createdAt'>): Trade {
  const data = loadData()
  const now = new Date().toISOString()
  const t: Trade = { ...trade, id: generateId(), createdAt: now }
  data.trades.push(t)
  saveData(data)
  return t
}

export function updateTrade(id: string, updates: Partial<Trade>): Trade | null {
  const data = loadData()
  const idx = data.trades.findIndex((t) => t.id === id)
  if (idx === -1) return null
  data.trades[idx] = { ...data.trades[idx], ...updates }
  saveData(data)
  return data.trades[idx]
}

export function deleteTrade(id: string): boolean {
  const data = loadData()
  const idx = data.trades.findIndex((t) => t.id === id)
  if (idx === -1) return false
  data.trades.splice(idx, 1)
  saveData(data)
  return true
}

export function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
  const data = loadData()
  const now = new Date().toISOString()
  const e: JournalEntry = { ...entry, id: generateId(), createdAt: now, updatedAt: now }
  data.journal.push(e)
  saveData(data)
  return e
}

export function updateJournalEntry(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
  const data = loadData()
  const idx = data.journal.findIndex((j) => j.id === id)
  if (idx === -1) return null
  data.journal[idx] = { ...data.journal[idx], ...updates, updatedAt: new Date().toISOString() }
  saveData(data)
  return data.journal[idx]
}

export function deleteJournalEntry(id: string): boolean {
  const data = loadData()
  const idx = data.journal.findIndex((j) => j.id === id)
  if (idx === -1) return false
  data.journal.splice(idx, 1)
  saveData(data)
  return true
}

export function setCertificate(cert: Partial<Certificate>): Certificate {
  const data = loadData()
  data.certificate = { ...data.certificate, ...cert, id: 'default' }
  saveData(data)
  return data.certificate
}

export function addThoughtEvaluation(evalData: Omit<ThoughtEvaluation, 'id' | 'evaluatedAt'>): ThoughtEvaluation {
  const data = loadData()
  const now = new Date().toISOString()
  const e: ThoughtEvaluation = { ...evalData, id: generateId(), evaluatedAt: now, tradeId: evalData.tradeId ?? '' }
  data.thoughtEvaluations.push(e)
  saveData(data)
  return e
}

export function getTrades(options?: { startDate?: string; endDate?: string; pair?: string }): Trade[] {
  const data = loadData()
  let trades = [...data.trades]
  if (options?.startDate) {
    const start = options.startDate!
    trades = trades.filter((t) => t.date >= start)
  }
  if (options?.endDate) {
    const end = options.endDate!
    trades = trades.filter((t) => t.date <= end)
  }
  if (options?.pair) {
    trades = trades.filter((t) => t.pair === options.pair)
  }
  return trades.sort((a, b) => a.date.localeCompare(b.date))
}

export function getTrade(id: string): Trade | null {
  return loadData().trades.find((t) => t.id === id) ?? null
}

export function getJournalEntries(): JournalEntry[] {
  const data = loadData()
  return [...data.journal].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getCertificate(): Certificate | null {
  const data = loadData()
  return data.certificate.name !== 'No certificate uploaded' ? data.certificate : null
}

export function getThoughtEvaluations(): ThoughtEvaluation[] {
  const data = loadData()
  return [...data.thoughtEvaluations].sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt))
}
