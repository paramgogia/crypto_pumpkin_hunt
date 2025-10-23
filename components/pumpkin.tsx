"use client"

import { motion } from "framer-motion"

interface PumpkinProps {
  pumpkin: {
    id: string
    x: number
    y: number
    type: "good" | "cursed"
    spawnTime: number
  }
  gridCols: number
  gridRows: number
  onClick: () => void
}

export default function Pumpkin({ pumpkin, gridCols, gridRows, onClick }: PumpkinProps) {
  const cellWidth = 100 / gridCols
  const cellHeight = 100 / gridRows

  const left = pumpkin.x * cellWidth + cellWidth / 2
  const top = pumpkin.y * cellHeight + cellHeight / 2

  const isGood = pumpkin.type === "good"

  return (
    <motion.button
      onClick={onClick}
      className={`absolute w-12 h-12 rounded-full cursor-pointer font-bold text-2xl transition-all hover:scale-110 ${
        isGood
          ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/80"
          : "bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/50 hover:shadow-green-500/80"
      }`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {isGood ? "🎃" : "💀"}
    </motion.button>
  )
}
