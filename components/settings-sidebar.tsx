"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Settings, 
  Languages, 
  Volume2,
  Keyboard, 
  Wrench,
  Crosshair,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SettingsSection } from "@/app/page"

export type TranslatorStatus = "translating" | "paused" | "stopped"

// Default messages - can be replaced with custom file later
const defaultMessages = [
  "今日も頑張ろう！",
  "設定いじってる？",
  "Apex楽しんでね",
  "翻訳精度上げたい...",
  "お腹すいた",
  "眠い...",
  "いい試合だった？",
  "チャンピオン取れた？",
  "カスタム設定最高",
  "またね！",
]

interface SettingsSidebarProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
  status?: TranslatorStatus
}

const menuItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "一般設定", icon: <Settings className="h-5 w-5" /> },
  { id: "translation", label: "翻訳設定", icon: <Languages className="h-5 w-5" /> },
  { id: "voice", label: "音声設定", icon: <Volume2 className="h-5 w-5" /> },
  { id: "keybinds", label: "キーバインド", icon: <Keyboard className="h-5 w-5" /> },
  { id: "advanced", label: "詳細設定", icon: <Wrench className="h-5 w-5" /> },
]

const statusConfig = {
  translating: { label: "翻訳中", color: "bg-green-500" },
  paused: { label: "一時停止中", color: "bg-yellow-500" },
  stopped: { label: "停止中", color: "bg-muted-foreground" },
}

// Create ripple effect for menu items
function createRipple(element: HTMLElement, e: React.MouseEvent) {
  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('div')
  const size = Math.max(rect.width, rect.height)
  
  ripple.style.cssText = `
    position: absolute;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    background: var(--primary);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    opacity: 0.3;
  `
  
  element.style.position = 'relative'
  element.style.overflow = 'hidden'
  element.appendChild(ripple)
  
  ripple.animate([
    { transform: 'scale(0)', opacity: 0.3 },
    { transform: 'scale(2)', opacity: 0 }
  ], {
    duration: 500,
    easing: 'ease-out',
  }).onfinish = () => ripple.remove()
}

export function SettingsSidebar({ activeSection, onSectionChange, status = "stopped" }: SettingsSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [pressedItem, setPressedItem] = useState<string | null>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isIconPressed, setIsIconPressed] = useState(false)
  const [messageAnimation, setMessageAnimation] = useState<"enter" | "exit" | "idle">("idle")
  const [animationType, setAnimationType] = useState<number>(0)

  // Animation types for random selection
  const animationTypes = [
    "bounce-in",
    "spin-in", 
    "slide-diagonal",
    "elastic-pop",
    "wobble-in",
    "flip-in",
  ]

  // Handle icon click to show random message
  const handleIconClick = () => {
    setIsIconPressed(true)
    setTimeout(() => setIsIconPressed(false), 150)
    
    // Pick random message
    const randomIndex = Math.floor(Math.random() * defaultMessages.length)
    setCurrentMessage(defaultMessages[randomIndex])
    
    // Pick random animation type
    const randomAnimIndex = Math.floor(Math.random() * animationTypes.length)
    setAnimationType(randomAnimIndex)
    
    // Show message with animation
    setShowMessage(true)
    setMessageAnimation("enter")
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setMessageAnimation("exit")
      setTimeout(() => {
        setShowMessage(false)
        setMessageAnimation("idle")
      }, 300)
    }, 3000)
  }

  const handleItemClick = (item: typeof menuItems[0], e: React.MouseEvent<HTMLButtonElement>) => {
    setPressedItem(item.id)
    createRipple(e.currentTarget, e)
    setTimeout(() => setPressedItem(null), 150)
    onSectionChange(item.id)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border relative">
          <button
            onClick={handleIconClick}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-xl bg-primary",
              "transition-all duration-300 ease-out",
              "hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-primary/30",
              "active:scale-95",
              isIconPressed && "scale-90 rotate-12"
            )}
          >
            <Crosshair className={cn(
              "h-6 w-6 text-primary-foreground transition-transform duration-300",
              isIconPressed && "rotate-180"
            )} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Apex Chat Translator</h1>
            <p className="text-xs text-muted-foreground">Settings</p>
          </div>
          
          {/* Random Message Bubble - overlapping title with diagonal angle */}
          {showMessage && (
            <div 
              className={cn(
                "absolute left-14 -top-2 z-50",
                "max-w-[220px] px-4 py-2.5 rounded-2xl rounded-bl-sm",
                "bg-white/90 dark:bg-white/95 backdrop-blur-md",
                "text-gray-800 dark:text-gray-900 text-sm font-medium",
                "shadow-xl shadow-black/10 dark:shadow-black/20",
                "border border-white/50 dark:border-white/60",
                "rotate-[3deg] origin-bottom-left",
                // Random animation classes
                messageAnimation === "enter" && animationType === 0 && "animate-bubble-bounce-in",
                messageAnimation === "enter" && animationType === 1 && "animate-bubble-spin-in",
                messageAnimation === "enter" && animationType === 2 && "animate-bubble-slide-diagonal",
                messageAnimation === "enter" && animationType === 3 && "animate-bubble-elastic-pop",
                messageAnimation === "enter" && animationType === 4 && "animate-bubble-wobble-in",
                messageAnimation === "enter" && animationType === 5 && "animate-bubble-flip-in",
                messageAnimation === "exit" && "animate-bubble-exit"
              )}
            >
              {/* Tail pointing to icon */}
              <div className="absolute -bottom-2 left-3 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white/90 dark:border-t-white/95" />
              {currentMessage}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={(e) => handleItemClick(item, e)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  "sidebar-menu-item flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium",
                  "transition-all duration-200 ease-out",
                  "hover:scale-[1.02]",
                  "active:scale-[0.98]",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  pressedItem === item.id && "scale-[0.95]"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200",
                  activeSection === item.id && "scale-110"
                )}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="px-4 pt-4">
          <div className="mb-2 px-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">テーマ</span>
          </div>
          <div className="w-full">
            <ThemeToggle />
          </div>
        </div>

        {/* Footer with Version and Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary transition-all duration-300 hover:bg-secondary/80">
            <span className="text-sm font-medium text-muted-foreground">v1.0.0</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                statusConfig[status].color,
                status === "translating" && "animate-pulse"
              )} />
              <span className="text-sm text-muted-foreground">{statusConfig[status].label}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
