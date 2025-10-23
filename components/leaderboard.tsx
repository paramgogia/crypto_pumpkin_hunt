"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getTopScores, type Score } from "@/lib/leaderboard"
import type { Difficulty } from "@/app/page"

interface LeaderboardProps {
  onPlayAgain: () => void
  onBackToStart: () => void
}

export default function Leaderboard({ onPlayAgain, onBackToStart }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([])
  const [filter, setFilter] = useState<Difficulty | "all">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    setLoading(true)
    const allScores = await getTopScores()
    setScores(allScores)
    setLoading(false)
  }

  const filteredScores = filter === "all" 
    ? scores.slice(0, 10)
    : scores.filter(s => s.difficulty === filter).slice(0, 10)

  const difficultyColors = {
    easy: "bg-green-600",
    medium: "bg-orange-600",
    hard: "bg-red-600"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-5xl font-bold text-center text-orange-400 mb-8 drop-shadow-lg">
          🏆 Leaderboard
        </h1>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          <Button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-bold ${filter === "all" ? "bg-purple-600" : "bg-slate-700"} text-white`}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("easy")}
            className={`px-4 py-2 rounded-lg font-bold ${filter === "easy" ? "bg-green-600" : "bg-slate-700"} text-white`}
          >
            Easy
          </Button>
          <Button
            onClick={() => setFilter("medium")}
            className={`px-4 py-2 rounded-lg font-bold ${filter === "medium" ? "bg-orange-600" : "bg-slate-700"} text-white`}
          >
            Medium
          </Button>
          <Button
            onClick={() => setFilter("hard")}
            className={`px-4 py-2 rounded-lg font-bold ${filter === "hard" ? "bg-red-600" : "bg-slate-700"} text-white`}
          >
            Hard
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center border border-purple-500/30"
            >
              <p className="text-purple-200 text-lg">Loading scores...</p>
            </motion.div>
          ) : filteredScores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center border border-purple-500/30"
            >
              <p className="text-purple-200 text-lg">No scores yet. Be the first to hunt!</p>
            </motion.div>
          ) : (
            filteredScores.map((score, index) => (
              <motion.div
                key={`${score.name}-${score.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-900/50 to-orange-900/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 flex items-center justify-between hover:border-orange-500/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-3xl font-bold text-orange-400 w-12 text-center"
                    animate={{ scale: index === 0 ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 1, repeat: index === 0 ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    {index === 0 ? "👑" : `#${index + 1}`}
                  </motion.div>
                  <div>
                    <p className="text-xl font-bold text-white">{score.name}</p>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded ${difficultyColors[score.difficulty]} text-white font-bold uppercase`}>
                        {score.difficulty}
                      </span>
                      <p className="text-sm text-purple-300">{new Date(score.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="text-3xl font-bold text-orange-400"
                  animate={{ scale: index === 0 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 1, repeat: index === 0 ? Number.POSITIVE_INFINITY : 0 }}
                >
                  {score.score}
                </motion.div>
              </motion.div>
            ))
          )}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onPlayAgain}
              className="px-8 py-6 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
            >
              Hunt Again
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onBackToStart}
              className="px-8 py-6 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Back to Start
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}