"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveToastProps {
  show: boolean
  className?: string
}

export function SaveToast({ show, className }: SaveToastProps) {
  if (!show) return null
  
  return (
    <div 
      className={cn(
        "absolute -top-14 right-0 flex items-center gap-2 px-4 py-2.5 rounded-xl",
        "bg-emerald-500 dark:bg-emerald-600",
        "text-white text-sm font-semibold",
        "shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30",
        "animate-save-toast",
        className
      )}
    >
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/25">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </div>
      <span>保存しました</span>
    </div>
  )
}
