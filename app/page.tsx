"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StartScreen from "@/components/start-screen"
import GameBoard from "@/components/game-board"
import GameOverScreen from "@/components/game-over-screen"
import Leaderboard from "@/components/leaderboard"

export type GameScreen = "start" | "game" | "gameOver" | "leaderboard"
export type Difficulty = "easy" | "medium" | "hard"

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>("start")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [finalScore, setFinalScore] = useState(0)

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty)
    setScreen("game")
  }

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    setScreen("gameOver")
  }

  const handleSaveScore = () => {
    setScreen("leaderboard")
  }

  const handlePlayAgain = () => {
    setScreen("start")
  }

  const handleBackToStart = () => {
    setScreen("start")
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-4xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          👻
        </motion.div>
        <motion.div
          className="absolute top-32 right-20 text-3xl opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        >
          🦇
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-3xl opacity-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        >
          🦇
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {screen === "start" && (
  <motion.div
    key="start"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <StartScreen 
      onStart={handleStartGame} 
      onViewLeaderboard={() => setScreen("leaderboard")} 
    />
  </motion.div>
)}


        {screen === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameBoard difficulty={difficulty} onGameOver={handleGameOver} />
          </motion.div>
        )}

        {screen === "gameOver" && (
          <motion.div
            key="gameOver"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <GameOverScreen 
              score={finalScore} 
              difficulty={difficulty}
              onSaveScore={handleSaveScore} 
              onPlayAgain={handlePlayAgain} 
            />
          </motion.div>
        )}

        {screen === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Leaderboard onPlayAgain={handlePlayAgain} onBackToStart={handleBackToStart} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}