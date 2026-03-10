"use client"

import { useCallback, useState } from "react"

// レアアニメーション発生確率（1%）
const RARE_ANIMATION_CHANCE = 0.01

export interface StarParticle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  color: string
  delay: number
}

export function useInteractionEffects() {
  const [stars, setStars] = useState<StarParticle[]>([])
  const [isRareAnimation, setIsRareAnimation] = useState(false)

  const triggerStarBurst = useCallback((x: number, y: number) => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6", "#34D399", "#60A5FA"]
    const newStars: StarParticle[] = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 150,
      y: y + (Math.random() - 0.5) * 150,
      size: Math.random() * 16 + 10,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.2,
    }))
    
    setStars(prev => [...prev, ...newStars])
    
    // 1.5秒後に消す
    setTimeout(() => {
      setStars(prev => prev.filter(star => !newStars.find(ns => ns.id === star.id)))
    }, 1500)
  }, [])

  const checkRareAnimation = useCallback((e: React.MouseEvent) => {
    if (Math.random() < RARE_ANIMATION_CHANCE) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      triggerStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
      setIsRareAnimation(true)
      setTimeout(() => setIsRareAnimation(false), 800)
      return true
    }
    return false
  }, [triggerStarBurst])

  return {
    stars,
    isRareAnimation,
    checkRareAnimation,
    triggerStarBurst,
  }
}
