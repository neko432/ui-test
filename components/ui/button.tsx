"use client"

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

// Particle burst effect for rare animations
function createParticleBurst(element: HTMLElement, isRare: boolean) {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const particleCount = isRare ? 12 : 6
  const colors = isRare 
    ? ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6', '#FBBF24']
    : ['var(--primary)', 'var(--accent)']

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = isRare ? 'button-star-particle' : 'button-particle'
    
    const angle = (360 / particleCount) * i
    const velocity = isRare ? 80 + Math.random() * 40 : 30 + Math.random() * 20
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${isRare ? '8px' : '4px'};
      height: ${isRare ? '8px' : '4px'};
      background: ${color};
      border-radius: ${isRare ? '2px' : '50%'};
      pointer-events: none;
      z-index: 9999;
      transform: rotate(${isRare ? angle : 0}deg);
      ${isRare ? 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);' : ''}
    `
    
    document.body.appendChild(particle)
    
    const radian = (angle * Math.PI) / 180
    const dx = Math.cos(radian) * velocity
    const dy = Math.sin(radian) * velocity
    
    particle.animate([
      { 
        transform: `translate(0, 0) scale(1) rotate(0deg)`,
        opacity: 1 
      },
      { 
        transform: `translate(${dx}px, ${dy}px) scale(0) rotate(${isRare ? 360 : 0}deg)`,
        opacity: 0 
      }
    ], {
      duration: isRare ? 800 : 400,
      easing: isRare ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'ease-out',
    }).onfinish = () => particle.remove()
  }
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current && !props.disabled) {
      // 2% chance for rare star burst animation
      const isRare = Math.random() < 0.02
      createParticleBurst(buttonRef.current, isRare)
    }
    onClick?.(e)
  }

  const handleMouseDown = () => {
    if (!props.disabled) setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
  }

  return (
    <Comp
      ref={buttonRef}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        "relative overflow-hidden",
        "transition-all duration-150 ease-out",
        "hover:scale-[1.02] hover:shadow-lg",
        "active:scale-[0.95] active:shadow-sm",
        isPressed && "scale-[0.95] shadow-sm"
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  )
}

export { Button, buttonVariants }
