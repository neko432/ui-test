"use client"

/**
 * AnimSlider - サウンド + thumb ポップ付きスライダー
 */

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { useFX } from "@/components/fx-provider"

interface AnimSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {}

export function AnimSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: AnimSliderProps) {
  const { playSound } = useFX()
  const [active, setActive] = React.useState(false)
  const [thumbPop, setThumbPop] = React.useState(false)

  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const handleValueChange = (v: number[]) => {
    playSound("slider")
    if (!thumbPop) {
      setThumbPop(true)
      setTimeout(() => setThumbPop(false), 350)
    }
    onValueChange?.(v)
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        active && "slider-active",
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
          "transition-all duration-150",
          active && "bg-primary/20"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "transition-all duration-75"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm",
            "transition-all duration-200",
            "hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden",
            "disabled:pointer-events-none disabled:opacity-50",
            // active時にglowとscale
            active && "ring-4 ring-primary/30 scale-125",
            thumbPop && "animate-[btn-press_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
          )}
          style={
            active
              ? { boxShadow: "0 0 12px 4px color-mix(in oklch, var(--color-primary) 50%, transparent)" }
              : {}
          }
        />
      ))}
    </SliderPrimitive.Root>
  )
}
