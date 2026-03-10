import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface SettingsCardProps {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  badge?: string
}

export function SettingsCard({ icon, title, description, children, badge }: SettingsCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-secondary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          {badge && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {badge}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
