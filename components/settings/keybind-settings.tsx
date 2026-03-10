"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Keyboard, RotateCcw } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"
import { cn } from "@/lib/utils"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useEffects } from "@/components/effects-provider"
import { playSound } from "@/hooks/use-interaction-effects"

interface Keybind {
  ctrl: boolean
  alt: boolean
  shift: boolean
  key: string
}

interface KeybindItemProps {
  label: string
  description: string
  defaultKeybind: Keybind
}

function parseKeybindString(str: string): Keybind {
  const parts = str.toUpperCase().split("+").map(s => s.trim())
  return {
    ctrl: parts.includes("CTRL"),
    alt: parts.includes("ALT"),
    shift: parts.includes("SHIFT"),
    key: parts.filter(p => !["CTRL", "ALT", "SHIFT"].includes(p))[0] || ""
  }
}

function formatKeybind(keybind: Keybind): string {
  const parts: string[] = []
  if (keybind.ctrl) parts.push("Ctrl")
  if (keybind.alt) parts.push("Alt")
  if (keybind.shift) parts.push("Shift")
  if (keybind.key) parts.push(keybind.key)
  return parts.join(" + ")
}

function KeybindItem({ label, description, defaultKeybind }: KeybindItemProps) {
  const [keybind, setKeybind] = useState<Keybind>(defaultKeybind)
  const [isListening, setIsListening] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()
    if (!isListening) return

    if (e.key === "Escape") {
      setIsListening(false)
      return
    }

    if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
      return
    }

    let keyName = e.key
    if (keyName === " ") keyName = "Space"
    
    setKeybind({
      ctrl: e.ctrlKey || e.metaKey,
      alt: e.altKey,
      shift: e.shiftKey,
      key: keyName.toUpperCase()
    })
    setIsListening(false)
    playSound("success")
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleClick = () => {
    setIsListening(true)
    playSound("click")
  }

  const handleReset = () => {
    setKeybind(defaultKeybind)
    playSound("click")
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const displayText = formatKeybind(keybind)

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsListening(false)}
          className={cn(
            "min-w-[100px] px-4 py-2 rounded-lg text-sm font-mono font-medium border transition-all duration-200",
            isListening 
              ? "border-primary bg-primary/10 text-primary animate-pulse" 
              : "border-border bg-secondary text-foreground hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]",
            isAnimating && "animate-bounce-scale"
          )}
        >
          {isListening ? "キーを入力..." : displayText}
        </button>
        <AnimatedButton 
          variant="ghost" 
          size="icon"
          onClick={handleReset}
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </AnimatedButton>
      </div>
    </div>
  )
}

export function KeybindSettings() {
  const { addStars } = useEffects()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10">
          <Keyboard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">キーバインド</h2>
          <p className="text-sm text-muted-foreground">ショートカットキーのカスタマイズ</p>
        </div>
      </div>

      {/* Translation Keybinds */}
      <SettingsCard
        icon={<Keyboard className="h-5 w-5 text-primary" />}
        title="翻訳操作"
        description="翻訳機能のショートカット"
      >
        <div>
          <KeybindItem 
            label="翻訳の一時停止/再開" 
            description="翻訳機能を一時的に停止または再開します"
            defaultKeybind={{ ctrl: false, alt: false, shift: false, key: "F8" }}
          />
          <KeybindItem 
            label="設定を開く" 
            description="設定画面を表示"
            defaultKeybind={{ ctrl: false, alt: false, shift: false, key: "F10" }}
          />
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <AnimatedButton variant="outline" onStarBurst={addStars}>すべてリセット</AnimatedButton>
        <AnimatedButton onStarBurst={addStars}>設定を保存</AnimatedButton>
      </div>
    </div>
  )
}
