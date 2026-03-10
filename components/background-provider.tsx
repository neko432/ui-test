"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface BackgroundContextType {
  backgroundImage: string | null
  setBackgroundImage: (image: string | null) => void
  blurAmount: number
  setBlurAmount: (amount: number) => void
  opacity: number
  setOpacity: (opacity: number) => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [blurAmount, setBlurAmount] = useState(40)
  const [opacity, setOpacity] = useState(0.4)

  return (
    <BackgroundContext.Provider value={{ 
      backgroundImage, 
      setBackgroundImage, 
      blurAmount, 
      setBlurAmount,
      opacity,
      setOpacity
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
}
