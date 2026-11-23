// Shared types for the Monaarchx website

export type Direction = 'BUY' | 'SELL'

export interface Trade {
  id: string
  date: string
  pair: string
  direction: Direction
  entry: number | null
  exit: number | null
  profitLoss: number | null
  thoughtProcess: string
  outcome: 'win' | 'loss' | 'breakeven' | 'pending'
  tags: string[]
  notes: string
  createdAt: string
}

export interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Certificate {
  id: string
  name: string
  link: string
  fileBase64: string | null
  uploadedAt: string
}

export interface ThoughtEvaluation {
  id: string
  tradeId: string
  thoughtProcess: string
  outcome: 'win' | 'loss' | 'breakeven'
  wasThoughtCorrect: boolean | null
  explanation: string
  evaluatedAt: string
}

export interface AppData {
  trades: Trade[]
  journal: JournalEntry[]
  certificate: Certificate
  thoughtEvaluations: ThoughtEvaluation[]
}

export interface Analytics {
  totalTrades: number
  wins: number
  losses: number
  breakevens: number
  winRate: number
  totalProfit: number
  totalLoss: number
  profitFactor: number | null
  bestPairs: BestPair[]
  worstPairs: BestPair[]
  today: TodayStats
}

export interface BestPair {
  pair: string
  tradeCount: number
  winRate: number
  totalProfit: number
  avgProfit: number
  winningTrades: number
}

export interface TodayStats {
  trades: number
  wins: number
  losses: number
  winRate: number
  profit: number
}
