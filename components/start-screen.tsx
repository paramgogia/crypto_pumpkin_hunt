"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Difficulty } from "@/app/page"

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void
  onViewLeaderboard: () => void
}

export default function StartScreen({ onStart, onViewLeaderboard }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl w-full"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-4 text-orange-400 drop-shadow-lg"
          animate={{
            textShadow: [
              "0 0 10px rgba(251, 146, 60, 0.5)",
              "0 0 20px rgba(251, 146, 60, 0.8)",
              "0 0 10px rgba(251, 146, 60, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          🎃
        </motion.h1>

        <h1 className="text-5xl md:text-6xl font-bold mb-2 text-orange-300 drop-shadow-lg">
          The Haunted Pumpkin Hunt
        </h1>

        <p className="text-xl md:text-2xl text-purple-200 mb-8 mt-6 max-w-2xl mx-auto">
          Dare to collect glowing pumpkins before midnight? Beware the cursed ones...
        </p>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 mb-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">How to Play:</h2>
          <ul className="text-left text-purple-100 space-y-2 mb-4">
            <li>✨ Click glowing orange pumpkins: +10 points</li>
            <li>💀 Avoid cursed skull pumpkins: -5 points</li>
            <li>⏱️ You have 60 seconds to score as much as possible</li>
            <li>🎯 Reach the top 10 leaderboard!</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-orange-300 mb-4">Choose Difficulty:</h2>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onStart("easy")}
              className="w-full max-w-md mx-auto block px-8 py-6 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg"
            >
              🟢 Easy - 4x4 Grid
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onStart("medium")}
              className="w-full max-w-md mx-auto block px-8 py-6 text-xl font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-lg"
            >
              🟠 Medium - 6x6 Grid
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onStart("hard")}
              className="w-full max-w-md mx-auto block px-8 py-6 text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg"
            >
              🔴 Hard - 8x8 Grid
            </Button>
          </motion.div>

          {/* 👇 View Leaderboard Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onViewLeaderboard}
              className="w-full max-w-md mx-auto block px-8 py-6 text-xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg mt-6"
            >
              🏆 View Leaderboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
