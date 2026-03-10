"use client"

import * as React from "react"
import { useState } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { playSound } from "@/hooks/use-interaction-effects"

interface AnimatedSwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  onCheckedChange?: (checked: boolean) => void
}

function AnimatedSwitch({
  className,
  onCheckedChange,
  ...props
}: AnimatedSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showArrow, setShowArrow] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleCheckedChange = (checked: boolean) => {
    playSound(checked ? "toggle-on" : "toggle-off")
    setIsAnimating(true)
    setShowArrow(true)
    
    // アニメーション終了後にリセット
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
    
    setTimeout(() => {
      setShowArrow(false)
    }, 500)
    
    onCheckedChange?.(checked)
  }

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* 矢印エフェクト */}
      {showArrow && (
        <span 
          className={cn(
            "absolute text-primary font-bold text-xs transition-all duration-500 pointer-events-none",
            props.checked ? "right-[-20px] animate-slide-right" : "left-[-20px] animate-slide-left"
          )}
          style={{
            opacity: showArrow ? 1 : 0,
            transform: showArrow ? "translateX(0)" : props.checked ? "translateX(-10px)" : "translateX(10px)",
          }}
        >
          {props.checked ? "→" : "←"}
        </span>
      )}
      
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          isAnimating && "scale-110 shadow-lg shadow-primary/30",
          className
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-all data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
            isAnimating && "scale-90"
          )}
        />
      </SwitchPrimitive.Root>
      
      {/* 枠の伸び縮みエフェクト用のオーバーレイ */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full border-2 border-primary/50 pointer-events-none transition-all duration-200",
          isAnimating ? "scale-125 opacity-100" : "scale-100 opacity-0"
        )}
      />
    </div>
  )
}

export { AnimatedSwitch }
