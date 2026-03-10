"use client"

import { useState } from "react"
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
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary transition-all duration-300 hover:scale-110 hover:rotate-3">
            <Crosshair className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Apex Chat Translator</h1>
            <p className="text-xs text-muted-foreground">Settings</p>
          </div>
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
          <ThemeToggle />
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
