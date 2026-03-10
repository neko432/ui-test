"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

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

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={onValueChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onLostPointerCapture={() => setIsDragging(false)}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        "group cursor-pointer",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          // yui540風のふわっとした変化
          "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDragging && "data-[orientation=horizontal]:h-2.5 shadow-inner"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            // 重要: transition を削除して即座に追従させる
            isDragging && "bg-primary/90"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border bg-white shadow-sm",
            "border-primary ring-ring/50",
            // yui540風のふわっとしたホバーとドラッグ
            "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "hover:scale-125 hover:shadow-md hover:shadow-primary/20",
            "focus-visible:ring-4 focus-visible:outline-hidden",
            "active:scale-110",
            "disabled:pointer-events-none disabled:opacity-50",
            isDragging && "scale-125 shadow-lg shadow-primary/30 ring-4 ring-primary/20"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { AnimatedSlider }
