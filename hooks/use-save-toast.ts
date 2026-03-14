"use client"

import { useState, useCallback } from "react"

export function useSaveToast(duration = 2500) {
  const [showSaveToast, setShowSaveToast] = useState(false)

  const handleSave = useCallback(() => {
    setShowSaveToast(true)
    setTimeout(() => {
      setShowSaveToast(false)
    }, duration)
  }, [duration])

  return { showSaveToast, handleSave }
}
