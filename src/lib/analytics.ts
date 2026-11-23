import crypto from 'crypto'
import type {
  Trade,
  Analytics,
  BestPair,
  TodayStats,
  ThoughtEvaluation,
} from './types'

export function computeAnalytics(trades: Trade[]): Analytics {
  const totalTrades = trades.length
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      profitFactor: null,
      bestPairs: [],
      worstPairs: [],
      today: {
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        profit: 0,
      },
    }
  }

  const wins = trades.filter((t) => t.outcome === 'win').length
  const losses = trades.filter((t) => t.outcome === 'loss').length
  const breakevens = trades.filter((t) => t.outcome === 'breakeven').length
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0

  const totalProfit = trades
    .filter((t) => t.profitLoss !== null && t.profitLoss > 0)
    .reduce((sum, t) => sum + t.profitLoss!, 0)
  const totalLoss = trades
    .filter((t) => t.profitLoss !== null && t.profitLoss < 0)
    .reduce((sum, t) => sum + Math.abs(t.profitLoss!), 0)

  const profitFactor =
    totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : null

  const pairMap = new Map<string, Trade[]>()
  for (const t of trades) {
    if (!pairMap.has(t.pair)) {
      pairMap.set(t.pair, [])
    }
    pairMap.get(t.pair)!.push(t)
  }

  const bestPairs: BestPair[] = Array.from(pairMap.entries())
    .map(([pair, pts]) => {
      const winsP = pts.filter((pt) => pt.outcome === 'win').length
      const winRateP = pts.length > 0 ? (winsP / pts.length) * 100 : 0
      const profitP = pts
        .filter((pt) => pt.profitLoss !== null && pt.profitLoss > 0)
        .reduce((sum, pt) => sum + pt.profitLoss!, 0)
      const avgProfit =
        pts.filter((pt) => pt.profitLoss !== null).length > 0
          ? profitP / pts.filter((pt) => pt.profitLoss !== null).length
          : 0
      return {
        pair,
        tradeCount: pts.length,
        winRate: winRateP,
        totalProfit: profitP,
        avgProfit,
        winningTrades: winsP,
      }
    })
    .sort((a, b) => b.tradeCount - a.tradeCount)
    .slice(0, 5)

  const worstPairs: BestPair[] = Array.from(pairMap.entries())
    .map(([pair, pts]) => {
      const winsP = pts.filter((pt) => pt.outcome === 'win').length
      const winRateP = pts.length > 0 ? (winsP / pts.length) * 100 : 0
      const profitP = pts
        .filter((pt) => pt.profitLoss !== null && pt.profitLoss > 0)
        .reduce((sum, pt) => sum + pt.profitLoss!, 0)
      const avgProfit =
        pts.filter((pt) => pt.profitLoss !== null).length > 0
          ? profitP / pts.filter((pt) => pt.profitLoss !== null).length
          : 0
      return {
        pair,
        tradeCount: pts.length,
        winRate: winRateP,
        totalProfit: profitP,
        avgProfit,
        winningTrades: winsP,
      }
    })
    .sort((a, b) => a.tradeCount - b.tradeCount)
    .slice(0, 5)

  const today = new Date().toISOString().slice(0, 10)
  const todayTrades = trades.filter((t) => t.date === today)
  const todayWins = todayTrades.filter((t) => t.outcome === 'win').length
  const todayLosses = todayTrades.filter((t) => t.outcome === 'loss').length
  const todayWinRate = todayTrades.length > 0 ? (todayWins / todayTrades.length) * 100 : 0
  const todayProfit = todayTrades
    .filter((t) => t.profitLoss !== null)
    .reduce((sum, t) => sum + t.profitLoss!, 0)

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    totalProfit,
    totalLoss,
    profitFactor,
    bestPairs,
    worstPairs,
    today: {
      trades: todayTrades.length,
      wins: todayWins,
      losses: todayLosses,
      winRate: todayWinRate,
      profit: todayProfit,
    },
  }
}

export function getBestPairs(trades: Trade[], options?: { limit?: number }): BestPair[] {
  const map = new Map<string, Trade[]>()
  for (const t of trades) {
    if (!map.has(t.pair)) {
      map.set(t.pair, [])
    }
    map.get(t.pair)!.push(t)
  }
  const limit = options?.limit ?? 5
  return Array.from(map.entries())
    .map(([pair, pts]) => {
      const winsP = pts.filter((pt) => pt.outcome === 'win').length
      const winRateP = pts.length > 0 ? (winsP / pts.length) * 100 : 0
      const profitP = pts
        .filter((pt) => pt.profitLoss !== null && pt.profitLoss > 0)
        .reduce((sum, pt) => sum + pt.profitLoss!, 0)
      const avgProfit =
        pts.filter((pt) => pt.profitLoss !== null).length > 0
          ? profitP / pts.filter((pt) => pt.profitLoss !== null).length
          : 0
      return {
        pair,
        tradeCount: pts.length,
        winRate: winRateP,
        totalProfit: profitP,
        avgProfit,
        winningTrades: winsP,
      }
    })
    .sort((a, b) => b.tradeCount - a.tradeCount || b.winRate - a.winRate)
    .slice(0, limit)
}

export function evaluateThoughtProcess(
  thought: string,
  outcome: 'win' | 'loss' | 'breakeven',
  tradeDirection: 'BUY' | 'SELL' | null
): ThoughtEvaluation {
  const lowerThought = thought.toLowerCase()

  const buyCues = ['buy', 'long', 'go long', 'bullish', 'bull', 'up', 'breakout', 'momentum', 'rally']
  const sellCues = ['sell', 'short', 'go short', 'bearish', 'bear', 'down', 'drop', 'fall']

  let predictedDirection: 'BUY' | 'SELL' | null = null
  if (buyCues.some((w) => lowerThought.includes(w))) {
    predictedDirection = 'BUY'
  } else if (sellCues.some((w) => lowerThought.includes(w))) {
    predictedDirection = 'SELL'
  }

  const wasCorrect =
    predictedDirection !== null
      ? (predictedDirection === 'BUY' && outcome === 'win') ||
          (predictedDirection === 'SELL' && outcome === 'loss')
      : null

  let explanation: string
  if (predictedDirection === 'BUY') {
    explanation =
      `You thought the pair would rally. It closed ${outcome} (${outcome}). Your bullish bias was ${outcome === 'win' ? 'right' : 'wrong'}.`
  } else if (predictedDirection === 'SELL') {
    explanation =
      `You thought the pair would drop. It closed ${outcome} (${outcome}). Your bearish bias was ${outcome === 'loss' ? 'right' : 'wrong'}.`
  } else {
    explanation =
      'Your thought process shows no strong directional bias, so this outcome neither strongly validates nor invalidates your thinking. Try adding directional clarity next time.'
  }

  return {
    id: crypto.randomBytes(8).toString('hex').toUpperCase(),
    thoughtProcess: thought,
    outcome,
    wasThoughtCorrect: wasCorrect,
    explanation,
    evaluatedAt: new Date().toISOString(),
    tradeId: '',
  }
}
