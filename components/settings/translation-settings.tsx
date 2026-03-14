"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Languages, Key, ScanText, RefreshCw, Eye, EyeOff, CheckCircle2, XCircle, Check } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"

export function TranslationSettings() {
  const [groqKey, setGroqKey] = useState("")
  const [geminiKey, setGeminiKey] = useState("")
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [groqStatus, setGroqStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [geminiStatus, setGeminiStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [ocrEngine, setOcrEngine] = useState("rapidocr")
  const [primaryEngine, setPrimaryEngine] = useState("groq")
  const [autoFallback, setAutoFallback] = useState(true)
  const [translationShortness, setTranslationShortness] = useState([1])
  const [showSaveToast, setShowSaveToast] = useState(false)

  const handleSave = () => {
    setShowSaveToast(true)
    setTimeout(() => {
      setShowSaveToast(false)
    }, 2500)
  }

  const testConnection = (type: "groq" | "gemini") => {
    const setStatus = type === "groq" ? setGroqStatus : setGeminiStatus
    setStatus("testing")
    // Simulate API test
    setTimeout(() => {
      setStatus(Math.random() > 0.3 ? "success" : "error")
    }, 1500)
  }

  const getShortnessLabel = (value: number) => {
    switch (value) {
      case 0:
        return "弱"
      case 1:
        return "標準"
      case 2:
        return "強"
      default:
        return "標準"
    }
  }

  const getShortnessDescription = (value: number) => {
    switch (value) {
      case 0:
        return "元の意味を保ちつつ、ほんの少しだけ短くします。"
      case 1:
        return "読み上げ向けにバランスよく短くします（おすすめ）。"
      case 2:
        return "できるだけ短く要約して翻訳します。"
      default:
        return "読み上げ向けにバランスよく短くします（おすすめ）。"
    }
  }

  const renderStatusIcon = (status: "idle" | "testing" | "success" | "error") => {
    switch (status) {
      case "testing":
        return <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10">
          <Languages className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">翻訳設定</h2>
          <p className="text-sm text-muted-foreground">翻訳エンジンとAPIの設定</p>
        </div>
      </div>

      {/* API Keys */}
      <SettingsCard
        icon={<Key className="h-5 w-5 text-primary" />}
        title="APIキー"
        description="翻訳サービスのAPIキーを設定"
      >
        <div className="space-y-6">
          {/* Groq API Key */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Groq API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGroqKey ? "text" : "password"}
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_xxxxxxxxxxxxxxxx"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90"
                >
                  {showGroqKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => testConnection("groq")}
                disabled={!groqKey || groqStatus === "testing"}
                className="gap-2"
              >
                {renderStatusIcon(groqStatus)}
                接続テスト
              </Button>
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gemini API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaxxxxxxxxxxxxxxxx"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-90"
                >
                  {showGeminiKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => testConnection("gemini")}
                disabled={!geminiKey || geminiStatus === "testing"}
                className="gap-2"
              >
                {renderStatusIcon(geminiStatus)}
                接続テスト
              </Button>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* OCR Engine */}
      <SettingsCard
        icon={<ScanText className="h-5 w-5 text-primary" />}
        title="OCRエンジン"
        description="画面テキスト認識エンジンの選択"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium">OCRエンジン</Label>
          <Select value={ocrEngine} onValueChange={setOcrEngine}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="エンジンを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rapidocr">RapidOCR（推奨）</SelectItem>
              <SelectItem value="windows">Windows OCR</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {ocrEngine === "rapidocr" 
              ? "RapidOCRを使用します。高精度で高速です。" 
              : "Windowsの標準OCR機能を使用します。軽量ですが精度は控えめです。"}
          </p>
        </div>
      </SettingsCard>

      {/* Translation Length */}
      <SettingsCard
        icon={<Languages className="h-5 w-5 text-primary" />}
        title="翻訳の長さ"
        description="翻訳結果の文章量を調整します"
      >
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">短く翻訳</Label>
            <span className="text-sm font-medium text-primary">{getShortnessLabel(translationShortness[0])}</span>
          </div>
          <Slider
            value={translationShortness}
            onValueChange={setTranslationShortness}
            min={0}
            max={2}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-0.5">
            <span>弱</span>
            <span>標準</span>
            <span>強</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {getShortnessDescription(translationShortness[0])}
          </p>
        </div>
      </SettingsCard>

      {/* Translation Engine */}
      <SettingsCard
        icon={<Languages className="h-5 w-5 text-primary" />}
        title="翻訳エンジン"
        description="プライマリ翻訳エンジンとフォールバック設定"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">プライマリエンジン</Label>
            <Select value={primaryEngine} onValueChange={setPrimaryEngine}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="エンジンを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groq">Groq（推奨）</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {primaryEngine === "groq" 
                ? "Groqは高速なレスポンスが特徴です。" 
                : "Geminiは高精度な翻訳が可能です。"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">自動フォールバック</Label>
              <p className="text-xs text-muted-foreground">プライマリエンジン失敗時に自動で切り替え</p>
            </div>
            <Switch checked={autoFallback} onCheckedChange={setAutoFallback} />
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex justify-end gap-3 relative">
        <Button variant="outline">リセット</Button>
        <Button onClick={handleSave}>設定を保存</Button>
        
        {/* Save Toast */}
        {showSaveToast && (
          <div 
            className="absolute -top-16 right-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/90 dark:bg-green-600/90 backdrop-blur-md text-white text-sm font-medium shadow-lg shadow-green-500/25 animate-save-toast"
          >
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/20">
              <Check className="h-3 w-3" />
            </div>
            保存しました
          </div>
        )}
      </div>
    </div>
  )
}
