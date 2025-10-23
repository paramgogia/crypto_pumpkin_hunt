"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PumpkinComponent from "@/components/pumpkin"
import type { Difficulty } from "@/app/page"

interface GameBoardProps {
  difficulty: Difficulty
  onGameOver: (score: number) => void
  onBackToStart: () => void
}

interface Pumpkin {
  id: string
  x: number
  y: number
  type: "good" | "cursed"
  spawnTime: number
}

const GAME_CONFIG = {
  easy: {
    gridCols: 4,
    gridRows: 4,
    spawnInterval: 1500,
    pumpkinLifetime: 2000,
    totalTime: 45,
    cursedChance: 0.3
  },
  medium: {
    gridCols: 6,
    gridRows: 6,
    spawnInterval: 1000,
    pumpkinLifetime: 1500,
    totalTime: 45,
    cursedChance: 0.4
  },
  hard: {
    gridCols: 8,
    gridRows: 8,
    spawnInterval: 700,
    pumpkinLifetime: 1000,
    totalTime: 45,
    cursedChance: 0.5
  }
}

export default function GameBoard({ difficulty, onGameOver, onBackToStart }: GameBoardProps) {
  const config = GAME_CONFIG[difficulty]
  const [pumpkins, setPumpkins] = useState<Pumpkin[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.totalTime)
  const [gameActive, setGameActive] = useState(true)
  const [screenShake, setScreenShake] = useState(false)

  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  useEffect(() => {
    if (timeLeft === 0) {
      setGameActive(false)
      setTimeout(() => onGameOver(score), 500)
    }
  }, [timeLeft, score, onGameOver])

  useEffect(() => {
    if (!gameActive) return

    const spawnTimer = setInterval(() => {
      const newPumpkin: Pumpkin = {
        id: `${Date.now()}-${Math.random()}`,
        x: Math.floor(Math.random() * config.gridCols),
        y: Math.floor(Math.random() * config.gridRows),
        type: Math.random() > config.cursedChance ? "good" : "cursed",
        spawnTime: Date.now(),
      }
      setPumpkins((prev) => [...prev, newPumpkin])
    }, config.spawnInterval)

    return () => clearInterval(spawnTimer)
  }, [gameActive, config])

  useEffect(() => {
    const cleanupTimer = setInterval(() => {
      setPumpkins((prev) => prev.filter((p) => Date.now() - p.spawnTime < config.pumpkinLifetime))
    }, 100)
    return () => clearInterval(cleanupTimer)
  }, [config])

  const handlePumpkinClick = useCallback(
    (pumpkin: Pumpkin) => {
      if (!gameActive) return
      if (pumpkin.type === "good") setScore((prev) => prev + 10)
      else {
        setScore((prev) => Math.max(0, prev - 5))
        setScreenShake(true)
        setTimeout(() => setScreenShake(false), 300)
      }
      setPumpkins((prev) => prev.filter((p) => p.id !== pumpkin.id))
    },
    [gameActive],
  )

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-transform ${screenShake ? "animate-pulse" : ""}`}
    >
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <motion.button
          onClick={onBackToStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold shadow-lg border-2 border-purple-500"
        >
          🏠 Back to Start
        </motion.button>
      </div>

      {/* Header with score and timer */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 flex-wrap gap-4">
        <motion.div
          className="text-3xl font-bold text-orange-400"
          animate={{ scale: score > 0 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          Score: {score}
        </motion.div>

        <div className="text-2xl font-bold text-purple-300 capitalize">{difficulty}</div>

        <motion.div
          className={`text-3xl font-bold ${timeLeft > 10 ? "text-green-400" : "text-red-400"}`}
          animate={{ scale: timeLeft <= 10 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0 }}
        >
          Time: {timeLeft}s
        </motion.div>
      </div>

      {/* Game grid */}
      <div className="relative w-full max-w-4xl aspect-square bg-black/30 rounded-lg border-2 border-purple-500/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 grid gap-0" style={{ gridTemplateColumns: `repeat(${config.gridCols}, 1fr)` }}>
          {Array.from({ length: config.gridCols * config.gridRows }).map((_, i) => (
            <div key={i} className="border border-purple-500/20 hover:bg-purple-500/10 transition-colors" />
          ))}
        </div>

        {/* Pumpkins */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {pumpkins.map((pumpkin) => (
              <PumpkinComponent
                key={pumpkin.id}
                pumpkin={pumpkin}
                gridCols={config.gridCols}
                gridRows={config.gridRows}
                onClick={() => handlePumpkinClick(pumpkin)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
