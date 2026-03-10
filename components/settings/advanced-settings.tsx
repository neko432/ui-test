"use client"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AnimSwitch } from "@/components/ui/anim-switch"
import { AnimButton } from "@/components/ui/anim-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Wrench, Shield, Trash2, AlertTriangle, Monitor, Crosshair,
  Clock, FileText, Upload, Download,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { SettingsCard } from "@/components/settings/settings-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFX } from "@/components/fx-provider"

export function AdvancedSettings() {
  const { playSound } = useFX()
  const [debugMode, setDebugMode] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [currentResolution] = useState({ width: 1920, height: 1080 })
  // キャプチャ間隔は秒単位（初期値 5.0 秒）
  const [captureInterval, setCaptureInterval] = useState(5.0)
  const [ignorePatterns, setIgnorePatterns] = useState("^\\d+$\n^[A-Za-z]$\n^https?://.*")
  const importRef = useRef<HTMLInputElement>(null)

  const handleCalibration = () => {
    setIsCalibrating(true)
    playSound("click")
    setTimeout(() => {
      setIsCalibrating(false)
    }, 3000)
  }

  /* ---------- Import / Export ---------- */
  const handleExport = () => {
    playSound("save")
    const blob = new Blob([ignorePatterns], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ignore-patterns.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setIgnorePatterns(text)
      playSound("success")
    }
    reader.readAsText(file)
    // reset so same file can be re-imported
    e.target.value = ""
  }

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
            <AnimSwitch checked={debugMode} onCheckedChange={setDebugMode} />
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

          {/* Capture Interval — 解像度より上に移動 */}
          <div className="p-4 rounded-lg border border-border/50 bg-secondary/30">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">キャプチャ間隔</Label>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0.1"
                max="60"
                step="0.1"
                value={captureInterval}
                onChange={(e) => {
                  const raw = parseFloat(e.target.value)
                  const clamped = Math.max(0.1, Math.min(60, isNaN(raw) ? 5 : raw))
                  // 小数第一位まで
                  setCaptureInterval(Math.round(clamped * 10) / 10)
                }}
                className="w-28 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-sm text-muted-foreground">秒ごとにキャプチャ</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              値を小さくすると反応が速くなりますが、CPU負荷が高くなります（推奨: 5.0 秒）
            </p>
          </div>

          {/* Ignore Patterns — 解像度より上に移動 */}
          <div className="p-4 rounded-lg border border-border/50 bg-secondary/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">翻訳しないパターン</Label>
              </div>
              {/* Import / Export buttons */}
              <div className="flex items-center gap-2">
                <input
                  ref={importRef}
                  type="file"
                  accept=".txt,text/plain"
                  className="hidden"
                  onChange={handleImport}
                />
                <AnimButton
                  variant="outline"
                  size="sm"
                  onClick={() => importRef.current?.click()}
                  className="gap-1.5 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  インポート
                </AnimButton>
                <AnimButton
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  エクスポート
                </AnimButton>
              </div>
            </div>
            <Textarea
              value={ignorePatterns}
              onChange={(e) => setIgnorePatterns(e.target.value)}
              placeholder="正規表現パターンを1行に1つ入力"
              className="min-h-[120px] font-mono text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground mt-2">
              正規表現パターンを1行に1つ入力してください。マッチした文字列は翻訳されません。
            </p>
            <div className="mt-2 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
              <p className="font-medium mb-1">例:</p>
              <code className="block">{'^\d+$'} - 数字のみ</code>
              <code className="block">{'[A-Za-z]$'} - 英字1文字</code>
              <code className="block">{'https?://.*'} - URL</code>
            </div>
          </div>

          {/* Resolution Display */}
          <div className="p-4 rounded-lg border border-border/50 bg-secondary/30">
            <div className="flex items-center gap-3 mb-3">
              <Monitor className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">現在の解像度</Label>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 rounded-md bg-background border border-border/50 text-center">
                <p className="text-lg font-semibold text-foreground">{currentResolution.width}</p>
                <p className="text-xs text-muted-foreground">幅 (px)</p>
              </div>
              <span className="text-muted-foreground font-medium">x</span>
              <div className="flex-1 p-3 rounded-md bg-background border border-border/50 text-center">
                <p className="text-lg font-semibold text-foreground">{currentResolution.height}</p>
                <p className="text-xs text-muted-foreground">高さ (px)</p>
              </div>
            </div>
          </div>

          {/* Auto Calibration */}
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Crosshair className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">監視位置の自動キャリブレーション</Label>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              テストキャプチャを表示して監視位置を自動調整します。実行中は画面にオーバーレイが表示されます。
            </p>
            <AnimButton
              onClick={handleCalibration}
              disabled={isCalibrating}
              className="w-full"
              variant={isCalibrating ? "secondary" : "default"}
            >
              {isCalibrating ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  キャリブレーション中...
                </>
              ) : (
                <>
                  <Crosshair className="h-4 w-4 mr-2" />
                  テストキャプチャ表示を実行
                </>
              )}
            </AnimButton>
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
            <AnimButton variant="destructive" size="sm" soundType="error">リセット</AnimButton>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-destructive">キャッシュをクリア</Label>
              <p className="text-xs text-muted-foreground">一時ファイルとキャッシュを削除</p>
            </div>
            <AnimButton variant="destructive" size="sm" soundType="error">クリア</AnimButton>
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <AnimButton variant="outline">リセット</AnimButton>
        <AnimButton soundType="save">設定を保存</AnimButton>
      </div>
    </div>
  )
}
