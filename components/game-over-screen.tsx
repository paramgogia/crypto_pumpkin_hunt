"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { connectWallet, submitScore } from "@/lib/contract" // ✅ using your helper file
import type { Difficulty } from "@/app/page"

interface GameOverScreenProps {
  score: number
  difficulty: Difficulty
  onSaveScore: () => void
  onPlayAgain: () => void
}

export default function GameOverScreen({
  score,
  difficulty,
  onSaveScore,
  onPlayAgain
}: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!playerName.trim()) return
    setLoading(true)

    try {
      console.log("🚀 Starting score submission...")
      console.log("Player Name:", playerName)
      console.log("Score:", score)
      console.log("Difficulty:", difficulty)

      // ✅ Connect wallet
      const wallet = await connectWallet()
      console.log("🦊 Wallet connected:", wallet)

      // 🔹 Map difficulty string to number
      const difficultyMap: Record<Difficulty, number> = {
        easy: 0,
        medium: 1,
        hard: 2,
      }
      const difficultyNumber = difficultyMap[difficulty]
      console.log("Mapped Difficulty Number:", difficultyNumber)

      // ✅ Submit on-chain score
      console.log("Submitting to contract...")
      const receipt = await submitScore(score, difficultyNumber, playerName)
      console.log("✅ Transaction receipt:", receipt)
      console.log("Transaction Hash:", receipt.transactionHash)

      setSubmitted(true)
      setTimeout(onSaveScore, 1200)
    } catch (err: any) {
      console.error("❌ Error submitting score:", err)
      alert(err.reason || err.message || "Error submitting score on-chain.")
    } finally {
      setLoading(false)
    }
  }

  const difficultyColors = {
    easy: "text-green-400",
    medium: "text-orange-400",
    hard: "text-red-400"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl w-full"
      >
        <motion.div 
          animate={{ rotate: [0, -5, 5, -5, 0] }} 
          transition={{ duration: 0.5 }} 
          className="text-5xl md:text-7xl mb-4 md:mb-6"
        >
          🩸
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-bold text-red-400 mb-4 px-4">
          The Night Claims Another Hunter...
        </h1>

        <motion.div
          className="bg-black/50 backdrop-blur-sm rounded-lg p-6 md:p-8 mb-6 border border-red-500/30"
          animate={{ 
            borderColor: [
              "rgba(239, 68, 68, 0.3)", 
              "rgba(239, 68, 68, 0.6)", 
              "rgba(239, 68, 68, 0.3)"
            ] 
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <p className={`text-2xl font-bold mb-2 capitalize ${difficultyColors[difficulty]}`}>
            Difficulty: {difficulty}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-orange-400 mb-6">
            Your Score: {score}
          </p>

          {!submitted ? (
            <div className="space-y-4">
              <p className="text-purple-200 mb-4">Enter your name to save your score on-chain:</p>
              <Input
                type="text"
                placeholder="Your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="bg-slate-800 border-purple-500 text-white placeholder-purple-300"
                maxLength={20}
              />
              <Button
                onClick={handleSubmit}
                disabled={!playerName.trim() || loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
              >
                {loading ? "Saving on-chain..." : "Save Score"}
              </Button>
            </div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-green-400 font-bold text-lg"
            >
              Score saved on-chain! Redirecting to leaderboard...
            </motion.p>
          )}
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onPlayAgain}
            className="w-full md:w-auto px-8 py-4 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            🎃 Play Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
