"use client"

/**
 * AnimSwitch - カチッ感 + 枠伸び + 星エフェクト付きスイッチ
 */

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { useFX } from "@/components/fx-provider"

interface AnimSwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {}

export function AnimSwitch({ className, onCheckedChange, checked, ...props }: AnimSwitchProps) {
  const { playSound, triggerParticle, rareChance } = useFX()
  const rootRef = React.useRef<HTMLButtonElement>(null)
  const [animClass, setAnimClass] = React.useState("")
  const [sparkles, setSparkles] = React.useState<
    { id: number; x: number; y: number; angle: number }[]
  >([])
  let sparkleId = 0

  const handleCheckedChange = (val: boolean) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) {
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const isRare = rareChance()
      triggerParticle(x, y, isRare ? "rare" : "normal")

      if (val) {
        playSound("switch_on")
        setAnimClass("switch-on-anim")
        // sparkles around the switch
        const newSparkles = Array.from({ length: 5 }, (_, i) => ({
          id: sparkleId++,
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          angle: (360 / 5) * i,
        }))
        setSparkles(newSparkles)
        setTimeout(() => setSparkles([]), 700)
      } else {
        playSound("switch_off")
        setAnimClass("switch-off-anim")
      }

      setTimeout(() => setAnimClass(""), 500)
    }
    onCheckedChange?.(val)
  }

  return (
    <>
      {/* Fixed sparkles overlay */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="fixed pointer-events-none z-[9990]"
          style={{
            left: s.x,
            top: s.y,
            fontSize: "12px",
            color: "oklch(0.85 0.2 50)",
            animation: "sparkle-spin 0.6s ease-out forwards",
            transformOrigin: "center",
          }}
        >
          ★
        </span>
      ))}

      <SwitchPrimitive.Root
        ref={rootRef}
        data-slot="switch"
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          "focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80",
          "inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent",
          "shadow-xs transition-all outline-none focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          animClass,
          className
        )}
        style={{
          // checked状態で光を追加
          ...(checked
            ? { boxShadow: "0 0 8px 2px color-mix(in oklch, var(--color-primary) 40%, transparent)" }
            : {}),
        }}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
            "pointer-events-none block size-4 rounded-full ring-0",
            "transition-all duration-200",
            "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
            // checked時にthumbをわずかに大きく
            "data-[state=checked]:scale-110"
          )}
        />
      </SwitchPrimitive.Root>
    </>
  )
}
