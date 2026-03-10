'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  const [isDragging, setIsDragging] = React.useState(false)
  const [showRipple, setShowRipple] = React.useState(false)
  const sliderRef = React.useRef<HTMLSpanElement>(null)

  // Create trail particles while dragging (rare effect)
  const createTrailParticle = (thumb: HTMLElement) => {
    if (Math.random() > 0.3) return // 30% chance per movement
    
    const rect = thumb.getBoundingClientRect()
    const particle = document.createElement('div')
    
    particle.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `
    
    document.body.appendChild(particle)
    
    particle.animate([
      { transform: 'scale(1)', opacity: 0.8 },
      { transform: 'scale(0) translateY(-10px)', opacity: 0 }
    ], {
      duration: 400,
      easing: 'ease-out',
    }).onfinish = () => particle.remove()
  }

  const handleValueChange = (newValue: number[]) => {
    // 3% chance for ripple effect
    if (Math.random() < 0.03) {
      setShowRipple(true)
      setTimeout(() => setShowRipple(false), 600)
    }
    
    // Create trail particle when dragging
    if (isDragging && sliderRef.current) {
      const thumb = sliderRef.current.querySelector('[data-slot="slider-thumb"]') as HTMLElement
      if (thumb) createTrailParticle(thumb)
    }
    
    onValueChange?.(newValue)
  }

  return (
    <SliderPrimitive.Root
      ref={sliderRef}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        'group',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
          'transition-all duration-200',
          'group-hover:data-[orientation=horizontal]:h-2',
          isDragging && 'data-[orientation=horizontal]:h-2.5'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
            'transition-all duration-150',
            showRipple && 'animate-slider-ripple'
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm outline-hidden disabled:pointer-events-none disabled:opacity-50",
            "transition-all duration-200 ease-out",
            "hover:ring-4 hover:scale-110 hover:shadow-lg",
            "focus-visible:ring-4 focus-visible:scale-110",
            "active:scale-125 active:shadow-xl",
            isDragging && "scale-125 shadow-xl ring-4"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
