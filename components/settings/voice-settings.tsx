"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Volume2, Mic, Play, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"

export function VoiceSettings() {
  const [ttsEngine, setTtsEngine] = useState("edge-tts")
  const [edgeVoice, setEdgeVoice] = useState("nanami")
  const [voicevoxSpeaker, setVoicevoxSpeaker] = useState("zundamon")
  const [speed, setSpeed] = useState([1.0])
  const [voicevoxStatus, setVoicevoxStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [isPlaying, setIsPlaying] = useState(false)
  const [minSpeakCharacters, setMinSpeakCharacters] = useState(5)

  const testVoicevox = () => {
    setVoicevoxStatus("testing")
    setTimeout(() => {
      setVoicevoxStatus(Math.random() > 0.3 ? "success" : "error")
    }, 1500)
  }

  const playTestAudio = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 2000)
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
          <Volume2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">音声設定</h2>
          <p className="text-sm text-muted-foreground">読み上げエンジンと音声の設定</p>
        </div>
      </div>

      {/* TTS Engine */}
      <SettingsCard
        icon={<Mic className="h-5 w-5 text-primary" />}
        title="TTSエンジン"
        description="テキスト読み上げエンジンの選択"
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium">エンジン</Label>
          <Select value={ttsEngine} onValueChange={setTtsEngine}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="エンジンを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edge-tts">Edge-TTS（推奨）</SelectItem>
              <SelectItem value="voicevox">VOICEVOX</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {ttsEngine === "edge-tts" 
              ? "Microsoft Edgeの音声合成を使用します。追加インストール不要です。" 
              : "VOICEVOXを使用します。VOICEVOXアプリが起動している必要があります。"}
          </p>
        </div>
      </SettingsCard>

      {/* Voice Selection */}
      <SettingsCard
        icon={<Volume2 className="h-5 w-5 text-primary" />}
        title="音声選択"
        description={ttsEngine === "edge-tts" ? "Edge-TTSの音声を選択" : "VOICEVOXの話者を選択"}
      >
        {ttsEngine === "edge-tts" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">音声</Label>
              <Select value={edgeVoice} onValueChange={setEdgeVoice}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="音声を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nanami">Nanami（女性）</SelectItem>
                  <SelectItem value="keita">Keita（男性）</SelectItem>
                  <SelectItem value="aoi">Aoi（女性2）</SelectItem>
                  <SelectItem value="daichi">Daichi（男性2）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={playTestAudio}
              disabled={isPlaying}
              className="gap-2"
            >
              <Play className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
              {isPlaying ? "再生中..." : "テスト再生"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">話者</Label>
              <Select value={voicevoxSpeaker} onValueChange={setVoicevoxSpeaker}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="話者を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zundamon">ずんだもん</SelectItem>
                  <SelectItem value="shikoku-metan">四国めたん</SelectItem>
                  <SelectItem value="kasukabe-tsumugi">春日部つむぎ</SelectItem>
                  <SelectItem value="nemo">九州そら</SelectItem>
                  <SelectItem value="mochiko">もち子さん</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={playTestAudio}
              disabled={isPlaying}
              className="gap-2"
            >
              <Play className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
              {isPlaying ? "再生中..." : "テスト再生"}
            </Button>
            {voicevoxStatus === "error" && (
              <p className="text-xs text-destructive">
                VOICEVOXに接続できません。アプリが起動しているか確認してください。
              </p>
            )}
          </div>
        )}
      </SettingsCard>

      {/* Speech Speed */}
      <SettingsCard
        icon={<Volume2 className="h-5 w-5 text-primary" />}
        title="読み上げ速度"
        description="音声の再生速度を調整"
      >
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">速度</Label>
            <span className="text-sm font-medium text-primary">{speed[0].toFixed(1)}x</span>
          </div>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={0.5}
            max={2.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
      </SettingsCard>

      {/* Speech Conditions */}
      <SettingsCard
        icon={<Volume2 className="h-5 w-5 text-primary" />}
        title="読み上げ条件"
        description="どのくらいの長さから読み上げるかを設定します"
      >
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label className="text-sm font-medium">読み上げの最小文字数</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="100"
                value={minSpeakCharacters}
                onChange={(e) => setMinSpeakCharacters(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">文字以上のメッセージだけ読み上げる</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            この文字数未満の短いメッセージは読み上げをスキップします。
          </p>
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
