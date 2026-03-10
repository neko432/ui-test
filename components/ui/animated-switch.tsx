"use client"

import * as React from "react"
import { useState, useRef } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface AnimatedSwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  onCheckedChange?: (checked: boolean) => void
}

function AnimatedSwitch({
  className,
  onCheckedChange,
  checked,
  ...props
}: AnimatedSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const switchRef = useRef<HTMLButtonElement>(null)

  const handleCheckedChange = (newChecked: boolean) => {
    setIsAnimating(true)
    setShowPulse(true)
    
    // ふわっとしたアニメーション終了
    setTimeout(() => {
      setIsAnimating(false)
    }, 400)
    
    setTimeout(() => {
      setShowPulse(false)
    }, 600)
    
    onCheckedChange?.(newChecked)
  }

  return (
    <div className="relative inline-flex items-center">
      {/* パルスエフェクト - yui540風の柔らかい光 */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500 ease-out pointer-events-none",
          showPulse && checked 
            ? "scale-[2] opacity-0 bg-primary/30" 
            : showPulse && !checked
            ? "scale-[2] opacity-0 bg-muted-foreground/20"
            : "scale-100 opacity-0"
        )}
        style={{
          filter: "blur(8px)",
        }}
      />
      
      <SwitchPrimitive.Root
        ref={switchRef}
        data-slot="switch"
        checked={checked}
        className={cn(
          "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none",
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:data-[state=unchecked]:bg-input/80",
          // yui540風のスムーズなトランジション
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isAnimating && "scale-110 shadow-lg",
          isAnimating && checked && "shadow-primary/40",
          className
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none block size-4 rounded-full ring-0",
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
            // yui540風の弾むようなアニメーション
            "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
            isAnimating && "scale-110"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  )
}

export { AnimatedSwitch }
