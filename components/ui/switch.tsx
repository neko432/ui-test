'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [stretchDirection, setStretchDirection] = React.useState<'left' | 'right' | null>(null)
  const switchRef = React.useRef<HTMLButtonElement>(null)

  // Create spark particles for rare animation
  const createSparkEffect = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const sparkCount = 8
    
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div')
      const angle = (360 / sparkCount) * i
      const startX = rect.left + rect.width / 2
      const startY = rect.top + rect.height / 2
      
      spark.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #FFD700, #FF6B6B);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 6px #FFD700;
      `
      
      document.body.appendChild(spark)
      
      const radian = (angle * Math.PI) / 180
      const distance = 40 + Math.random() * 20
      const dx = Math.cos(radian) * distance
      const dy = Math.sin(radian) * distance
      
      spark.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
      ], {
        duration: 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }).onfinish = () => spark.remove()
    }
  }

  const handleCheckedChange = (checked: boolean) => {
    setIsAnimating(true)
    setStretchDirection(checked ? 'right' : 'left')
    
    // 5% chance for rare spark effect
    if (Math.random() < 0.05 && switchRef.current) {
      createSparkEffect(switchRef.current)
    }
    
    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false)
      setStretchDirection(null)
    }, 300)
    
    onCheckedChange?.(checked)
  }

  return (
    <SwitchPrimitive.Root
      ref={switchRef}
      data-slot="switch"
      onCheckedChange={handleCheckedChange}
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200 ease-out',
        'hover:shadow-md hover:scale-105',
        'active:scale-95',
        // Stretch animation on toggle - the container stretches and bounces
        isAnimating && stretchDirection === 'right' && 'animate-switch-stretch-right',
        isAnimating && stretchDirection === 'left' && 'animate-switch-stretch-left',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0',
          'transition-all duration-200',
          'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
          // Bounce effect for the thumb
          isAnimating && 'animate-switch-thumb-bounce'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
