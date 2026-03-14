"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Keyboard, RotateCcw } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"
import { SaveToast } from "@/components/ui/save-toast"
import { useSaveToast } from "@/hooks/use-save-toast"
import { cn } from "@/lib/utils"

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

// Create sparkle effect
function createSparkles(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const sparkCount = 6
  
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div')
    const angle = (360 / sparkCount) * i + Math.random() * 30
    const startX = rect.left + rect.width / 2
    const startY = rect.top + rect.height / 2
    
    spark.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
    `
    
    document.body.appendChild(spark)
    
    const radian = (angle * Math.PI) / 180
    const distance = 25 + Math.random() * 15
    const dx = Math.cos(radian) * distance
    const dy = Math.sin(radian) * distance
    
    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
    ], {
      duration: 400,
      easing: 'ease-out',
    }).onfinish = () => spark.remove()
  }
}

function KeybindItem({ label, description, defaultKeybind }: KeybindItemProps) {
  const [keybind, setKeybind] = useState<Keybind>(defaultKeybind)
  const [isListening, setIsListening] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isListening) return

    // Escape to cancel
    if (e.key === "Escape") {
      setIsListening(false)
      return
    }

    // Wait for non-modifier key
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
    
    // Create sparkle effect on successful keybind capture
    if (e.currentTarget) {
      createSparkles(e.currentTarget)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsListening(true)
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
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
            "keybind-button min-w-[100px] px-4 py-2 rounded-lg text-sm font-mono font-medium border transition-all duration-200",
            isListening 
              ? "border-primary bg-primary/10 text-primary animate-pulse" 
              : "border-border bg-secondary text-foreground hover:border-primary/50",
            isPressed && "scale-95"
          )}
        >
          {isListening ? "キーを入力..." : displayText}
        </button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setKeybind(defaultKeybind)}
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function KeybindSettings() {
  const { showSaveToast, handleSave } = useSaveToast()
  
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
      <div className="flex justify-end gap-3 relative">
        <Button variant="outline">すべてリセット</Button>
        <Button onClick={handleSave}>設定を保存</Button>
        <SaveToast show={showSaveToast} />
      </div>
    </div>
  )
}
