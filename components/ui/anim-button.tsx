"use client"

/**
 * AnimButton - FXProviderと連携したアニメーション付きボタン
 * 全ボタンをこれに統一することで一貫したアニメーションを提供
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { useFX } from "@/components/fx-provider"

interface AnimButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  soundType?: "click" | "save" | "error"
  noParticle?: boolean
}

export function AnimButton({
  className,
  variant,
  size,
  soundType = "click",
  noParticle = false,
  onClick,
  children,
  ...props
}: AnimButtonProps) {
  const { playSound, triggerParticle, rareChance } = useFX()
  const btnRef = React.useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const isRare = rareChance()
      if (!noParticle) {
        triggerParticle(x, y, isRare ? "rare" : "normal")
      }
      if (!isRare) {
        playSound(soundType)
      }
    }
    onClick?.(e)
  }

  return (
    <button
      ref={btnRef}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        "btn-animate relative overflow-hidden",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
