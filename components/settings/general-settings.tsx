"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Settings, Monitor } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"
import { BackgroundSettings } from "@/components/settings/background-settings"

export function GeneralSettings() {
  const [autoStart, setAutoStart] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">一般設定</h2>
          <p className="text-sm text-muted-foreground">アプリケーションの基本設定を管理します</p>
        </div>
      </div>

      {/* App Settings */}
      <SettingsCard
        icon={<Monitor className="h-5 w-5 text-primary" />}
        title="アプリケーション"
        description="起動と動作に関する設定"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Windows起動時に自動起動</Label>
            <p className="text-xs text-muted-foreground">PCを起動した際に自動的にアプリを起動します</p>
          </div>
          <Switch checked={autoStart} onCheckedChange={setAutoStart} />
        </div>
      </SettingsCard>

      {/* Background Settings */}
      <BackgroundSettings />

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">リセット</Button>
        <Button>設定を保存</Button>
      </div>
    </div>
  )
}
