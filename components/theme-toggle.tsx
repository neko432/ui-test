"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options = [
    { value: "light" as const, icon: Sun, label: "ライト" },
    { value: "dark" as const, icon: Moon, label: "ダーク" },
    { value: "system" as const, icon: Monitor, label: "システム" },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl h-11 w-[200px] animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              theme === option.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={option.label}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
