import type { Difficulty } from "@/app/page"

export interface Score {
  name: string
  score: number
  difficulty: Difficulty
  timestamp: number
}

export async function saveScore(name: string, score: number, difficulty: Difficulty): Promise<void> {
  const scoreData: Score = {
    name,
    score,
    difficulty,
    timestamp: Date.now()
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const existingScores = getTopScores()
      const updatedScores = [...existingScores, scoreData]
        .sort((a, b) => b.score - a.score)
      
      localStorage.setItem('pumpkin-hunt-scores', JSON.stringify(updatedScores))
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }
}

export function getTopScores(): Score[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('pumpkin-hunt-scores')
      if (stored) {
        return JSON.parse(stored) as Score[]
      }
    } catch (error) {
      console.error('Error loading scores:', error)
    }
  }
  return []
}