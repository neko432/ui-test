"use client"

import { useCallback, useState } from "react"

// 音声ファイルのURL（Web Audio API で生成）
const audioContext = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

export type SoundType = "click" | "toggle-on" | "toggle-off" | "success" | "error" | "slide" | "rare"

const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  click: { frequency: 600, duration: 0.05, type: "sine", gain: 0.1 },
  "toggle-on": { frequency: 880, duration: 0.08, type: "sine", gain: 0.12 },
  "toggle-off": { frequency: 440, duration: 0.06, type: "sine", gain: 0.1 },
  success: { frequency: 1200, duration: 0.15, type: "sine", gain: 0.1 },
  error: { frequency: 200, duration: 0.2, type: "square", gain: 0.08 },
  slide: { frequency: 500, duration: 0.03, type: "sine", gain: 0.05 },
  rare: { frequency: 1500, duration: 0.3, type: "sine", gain: 0.15 },
}

export function playSound(type: SoundType) {
  if (!audioContext) return
  
  const config = soundConfigs[type]
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.type = config.type
  oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime)
  
  if (type === "rare") {
    // レア音声は上昇音
    oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + config.duration)
  }
  
  gainNode.gain.setValueAtTime(config.gain, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + config.duration)
}

// レアアニメーション発生確率（1%）
const RARE_ANIMATION_CHANCE = 0.01

export interface StarParticle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  color: string
}

export function useInteractionEffects() {
  const [stars, setStars] = useState<StarParticle[]>([])
  const [isRareAnimation, setIsRareAnimation] = useState(false)

  const triggerStarBurst = useCallback((x: number, y: number) => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6"]
    const newStars: StarParticle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      size: Math.random() * 12 + 8,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    
    setStars(prev => [...prev, ...newStars])
    playSound("rare")
    
    // 1秒後に消す
    setTimeout(() => {
      setStars(prev => prev.filter(star => !newStars.find(ns => ns.id === star.id)))
    }, 1000)
  }, [])

  const handleButtonClick = useCallback((e: React.MouseEvent, callback?: () => void) => {
    playSound("click")
    
    // レアアニメーションチェック
    if (Math.random() < RARE_ANIMATION_CHANCE) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      triggerStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
      setIsRareAnimation(true)
      setTimeout(() => setIsRareAnimation(false), 500)
    }
    
    callback?.()
  }, [triggerStarBurst])

  const handleToggle = useCallback((checked: boolean, callback?: (checked: boolean) => void) => {
    playSound(checked ? "toggle-on" : "toggle-off")
    callback?.(checked)
  }, [])

  const handleSlide = useCallback(() => {
    playSound("slide")
  }, [])

  return {
    stars,
    isRareAnimation,
    handleButtonClick,
    handleToggle,
    handleSlide,
    triggerStarBurst,
  }
}
