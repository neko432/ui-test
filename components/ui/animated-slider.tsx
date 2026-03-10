"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { playSound } from "@/hooks/use-interaction-effects"

interface AnimatedSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  onValueChange?: (value: number[]) => void
}

function AnimatedSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: AnimatedSliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const [isDragging, setIsDragging] = React.useState(false)
  const lastSoundTime = React.useRef(0)

  const handleValueChange = (newValue: number[]) => {
    const now = Date.now()
    // 50ms間隔で音を鳴らす
    if (now - lastSoundTime.current > 50) {
      playSound("slide")
      lastSoundTime.current = now
    }
    onValueChange?.(newValue)
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          "transition-all duration-200",
          isDragging && "data-[orientation=horizontal]:h-2"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "transition-all duration-200",
            isDragging && "bg-primary/80"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-all hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            "hover:scale-110 active:scale-95",
            isDragging && "scale-125 shadow-lg shadow-primary/30 ring-4"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { AnimatedSlider }
