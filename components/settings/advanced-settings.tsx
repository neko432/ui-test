"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wrench, Database, Cpu, Shield, Trash2, Download, AlertTriangle } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdvancedSettings() {
  const [hardwareAccel, setHardwareAccel] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const [analytics, setAnalytics] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10">
          <Wrench className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">詳細設定</h2>
          <p className="text-sm text-muted-foreground">高度な設定とシステムオプション</p>
        </div>
      </div>

      {/* Warning */}
      <Alert className="border-primary/50 bg-primary/5">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">注意</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          これらの設定は上級ユーザー向けです。変更を行う前に各設定の影響を理解してください。
        </AlertDescription>
      </Alert>

      {/* Performance */}
      <SettingsCard
        icon={<Cpu className="h-5 w-5 text-primary" />}
        title="パフォーマンス"
        description="パフォーマンス関連の設定"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">ハードウェアアクセラレーション</Label>
            <p className="text-xs text-muted-foreground">GPUを使用してパフォーマンスを向上</p>
          </div>
          <Switch checked={hardwareAccel} onCheckedChange={setHardwareAccel} />
        </div>
      </SettingsCard>

      {/* Data */}
      <SettingsCard
        icon={<Database className="h-5 w-5 text-primary" />}
        title="データ管理"
        description="データの保存とエクスポート"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">使用状況分析</Label>
              <p className="text-xs text-muted-foreground">匿名の使用データを送信して改善に貢献</p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">データ保存先</Label>
            <div className="flex gap-2">
              <Input 
                value="C:\Users\Player\ApexTools" 
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              設定をエクスポート
            </Button>
            <Button variant="outline" className="flex-1">
              設定をインポート
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Developer */}
      <SettingsCard
        icon={<Shield className="h-5 w-5 text-primary" />}
        title="開発者オプション"
        description="デバッグとテスト用の設定"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">デバッグモード</Label>
              <p className="text-xs text-muted-foreground">詳細なログを出力します</p>
            </div>
            <Switch checked={debugMode} onCheckedChange={setDebugMode} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">ログレベル</Label>
            <Select defaultValue="error" disabled={!debugMode}>
              <SelectTrigger>
                <SelectValue placeholder="レベルを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error">エラーのみ</SelectItem>
                <SelectItem value="warn">警告以上</SelectItem>
                <SelectItem value="info">情報以上</SelectItem>
                <SelectItem value="debug">すべて</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      {/* Danger Zone */}
      <SettingsCard
        icon={<Trash2 className="h-5 w-5 text-destructive" />}
        title="危険ゾーン"
        description="取り消しできない操作"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-destructive">すべての設定をリセット</Label>
              <p className="text-xs text-muted-foreground">すべての設定を初期状態に戻します</p>
            </div>
            <Button variant="destructive" size="sm">リセット</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-destructive">キャッシュをクリア</Label>
              <p className="text-xs text-muted-foreground">一時ファイルとキャッシュを削除</p>
            </div>
            <Button variant="destructive" size="sm">クリア</Button>
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">リセット</Button>
        <Button>設定を保存</Button>
      </div>
    </div>
  )
}
