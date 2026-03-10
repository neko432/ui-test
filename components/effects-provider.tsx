"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { StarParticle } from "@/hooks/use-interaction-effects"
import { StarParticles } from "@/components/ui/star-particles"

interface EffectsContextType {
  addStars: (stars: StarParticle[]) => void
}

const EffectsContext = createContext<EffectsContextType | null>(null)

export function useEffects() {
  const context = useContext(EffectsContext)
  if (!context) {
    throw new Error("useEffects must be used within an EffectsProvider")
  }
  return context
}

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [stars, setStars] = useState<StarParticle[]>([])

  const addStars = useCallback((newStars: StarParticle[]) => {
    setStars(prev => [...prev, ...newStars])
    
    // 1秒後に削除
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.find(ns => ns.id === s.id)))
    }, 1000)
  }, [])

  return (
    <EffectsContext.Provider value={{ addStars }}>
      {children}
      <StarParticles stars={stars} />
    </EffectsContext.Provider>
  )
}
