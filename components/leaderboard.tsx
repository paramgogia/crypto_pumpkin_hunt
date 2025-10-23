"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { connectWallet, fetchLeaderboard } from "@/lib/contract"

interface LeaderboardProps {
  onPlayAgain: () => void
  onBackToStart: () => void
}

export default function Leaderboard({ onPlayAgain, onBackToStart }: LeaderboardProps) {
  const [scores, setScores] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">("all")
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState<string | null>(null)

  const DIFFICULTY_MAP = { easy: 0, medium: 1, hard: 2 }
  const DIFFICULTY_LABELS = ["easy", "medium", "hard"]
  

  useEffect(() => {
    loadScores()
  }, [filter])

  const connect = async () => {
    try {
      const acc = await connectWallet()
      setWallet(acc)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const loadScores = async () => {
    setLoading(true)
    try {
      let list: any[] = []
      if (filter === "all") {
        const easy = (await fetchLeaderboard(0)).map(s => ({ ...s, difficulty: 0 }))
        const medium = (await fetchLeaderboard(1)).map(s => ({ ...s, difficulty: 1 }))
        const hard = (await fetchLeaderboard(2)).map(s => ({ ...s, difficulty: 2 }))
        list = [...easy, ...medium, ...hard]
      } else {
        const diffNum = DIFFICULTY_MAP[filter]
        list = (await fetchLeaderboard(diffNum)).map(s => ({ ...s, difficulty: diffNum }))
      }
      setScores(list.sort((a, b) => b.score - a.score))
    } catch (err) {
      console.error("Error loading scores", err)
    }
    setLoading(false)
  }

  

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
          🏆 On-Chain Leaderboard
        </h1>

        {!wallet ? (
          <div className="text-center mb-8">
            <Button onClick={connect} className="bg-purple-600 text-white text-lg font-bold px-6 py-4 rounded-lg">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <p className="text-purple-300 text-center mb-4">
            Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </p>
        )}

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {["all", "easy", "medium", "hard"].map((d) => (
            <Button
              key={d}
              onClick={() => setFilter(d as any)}
              className={`px-4 py-2 rounded-lg font-bold ${
                filter === d ? "bg-purple-600" : "bg-slate-700"
              } text-white`}
            >
              {d.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          {loading ? (
            <div className="bg-black/40 rounded-lg p-8 text-center border border-purple-500/30">
              <p className="text-purple-200 text-lg">Fetching on-chain scores...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="bg-black/40 rounded-lg p-8 text-center border border-purple-500/30">
              <p className="text-purple-200 text-lg">No scores yet. Be the first to hunt!</p>
            </div>
          ) : (
            scores.map((score, index) => {
              const diffLabel = DIFFICULTY_LABELS[score.difficulty]
              const nameOrWallet = score.name && score.name.trim() !== "" ? score.name : `${score.player.slice(0,6)}...${score.player.slice(-4)}`
              return (
                <motion.div
                  key={`${score.player}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-purple-900/50 to-orange-900/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 flex items-center justify-between hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-orange-400 w-12 text-center">
                      {index === 0 ? "👑" : `#${index + 1}`}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{nameOrWallet}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${difficultyColors[diffLabel]} text-white font-bold uppercase`}
                        >
                          {diffLabel}
                        </span>
                        <p className="text-sm text-purple-300">
                          {score.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-400">{score.score}</div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Back to Start / Play Again Buttons */}
        <div className="flex gap-4 justify-center mt-4">
          
          <Button
            onClick={onPlayAgain}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            🎮 Let's Play
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
