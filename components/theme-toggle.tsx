"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

// Create mini sparkle effect for theme change
function createThemeSparkles(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const sparkCount = 5
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA']
  
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div')
    const angle = (360 / sparkCount) * i + Math.random() * 30
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    spark.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: 4px;
      height: 4px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `
    
    document.body.appendChild(spark)
    
    const radian = (angle * Math.PI) / 180
    const distance = 20 + Math.random() * 15
    const dx = Math.cos(radian) * distance
    const dy = Math.sin(radian) * distance
    
    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
    ], {
      duration: 400,
      easing: 'ease-out',
    }).onfinish = () => spark.remove()
  }
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [pressedItem, setPressedItem] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const options = [
    { value: "light" as const, icon: Sun, label: "ライト" },
    { value: "dark" as const, icon: Moon, label: "ダーク" },
    { value: "system" as const, icon: Monitor, label: "システム" },
  ]

  const handleThemeChange = (value: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setPressedItem(value)
    
    // 10% chance for sparkle effect
    if (Math.random() < 0.1) {
      createThemeSparkles(e.currentTarget)
    }
    
    setTimeout(() => setPressedItem(null), 150)
    setTheme(value)
  }

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
            onClick={(e) => handleThemeChange(option.value, e)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
              "transition-all duration-200 ease-out",
              "hover:scale-[1.02]",
              "active:scale-[0.95]",
              theme === option.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              pressedItem === option.value && "scale-[0.95]"
            )}
            title={option.label}
          >
            <Icon className={cn(
              "h-4 w-4 transition-transform duration-300",
              theme === option.value && "scale-110"
            )} />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
