"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  badge?: string
}

export function SettingsCard({ icon, title, description, children, badge }: SettingsCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocusWithin, setHasFocusWithin] = useState(false)

  // Keep highlight active when either hovered OR has focus within (e.g., dropdown open)
  const isActive = isHovered || hasFocusWithin

  return (
    <Card 
      className={cn(
        "settings-card overflow-hidden border-border/50 shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:border-primary/30",
        isActive && "shadow-lg border-primary/30 translate-y-[-2px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={(e) => {
        // Only remove focus state if focus is leaving the card entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHasFocusWithin(false)
        }
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center h-10 w-10 rounded-xl bg-secondary",
              "transition-all duration-300 ease-out",
              isActive && "scale-110 bg-primary/20"
            )}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {badge && (
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary",
              "transition-all duration-300",
              isActive && "bg-primary/20 scale-105"
            )}>
              {badge}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
