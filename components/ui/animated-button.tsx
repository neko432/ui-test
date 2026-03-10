"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { playSound, StarParticle } from "@/hooks/use-interaction-effects"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// レアアニメーション確率
const RARE_CHANCE = 0.01

interface AnimatedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  onStarBurst?: (stars: StarParticle[]) => void
}

function AnimatedButton({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  onStarBurst,
  ...props
}: AnimatedButtonProps) {
  const Comp = asChild ? Slot : "button"
  const [isPressed, setIsPressed] = React.useState(false)
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound("click")
    
    // リップルエフェクト
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)

    // レアアニメーションチェック
    if (Math.random() < RARE_CHANCE && onStarBurst) {
      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6"]
      const stars: StarParticle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: Math.random() * 12 + 8,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
      playSound("rare")
      onStarBurst(stars)
    }
    
    onClick?.(e)
  }

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        "relative overflow-hidden",
        "transition-all duration-150 ease-out",
        "hover:scale-[1.02] hover:shadow-md",
        "active:scale-[0.96] active:shadow-sm",
        isPressed && "scale-[0.96]",
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      {...props}
    >
      {/* リップルエフェクト */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {props.children}
    </Comp>
  )
}

export { AnimatedButton, buttonVariants }
