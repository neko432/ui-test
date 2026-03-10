"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Trash2, Upload } from "lucide-react"
import { SettingsCard } from "@/components/settings/settings-card"
import { useBackground } from "@/components/background-provider"
import { cn } from "@/lib/utils"

export function BackgroundSettings() {
  const { backgroundImage, setBackgroundImage, blurAmount, setBlurAmount, opacity, setOpacity } = useBackground()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBackground = () => {
    setBackgroundImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <SettingsCard
      icon={<ImageIcon className="h-5 w-5 text-primary" />}
      title="背景画像"
      description="カスタム背景画像を設定"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">画像をアップロード</Label>
          <p className="text-xs text-muted-foreground">
            画像はぼかされて背景に表示されます
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {backgroundImage ? (
          <div className="space-y-6">
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <img
                src={backgroundImage}
                alt="背景プレビュー"
                className="h-full w-full object-cover transition-all duration-300"
                style={{
                  filter: `blur(${blurAmount / 4}px)`,
                  opacity: opacity,
                }}
              />
            </div>

            {/* Blur Amount Slider */}
            <div className="space-y-3 max-w-sm">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">ぼかし度</Label>
                <span className="text-sm text-muted-foreground">{blurAmount}px</span>
              </div>
              <Slider
                value={[blurAmount]}
                onValueChange={(value) => setBlurAmount(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-3 max-w-sm">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">透明度</Label>
                <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                value={[opacity * 100]}
                onValueChange={(value) => setOpacity(value[0] / 100)}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 max-w-sm">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                変更
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveBackground}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "w-full max-w-sm aspect-video rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer",
              "hover:border-primary/50 hover:bg-secondary/50 hover:scale-[1.02]",
              "active:scale-[0.98]",
              isDragOver 
                ? "border-primary bg-primary/10 scale-[1.02]" 
                : "border-border"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-full bg-secondary flex items-center justify-center transition-all duration-300",
              isDragOver && "bg-primary/20 scale-110"
            )}>
              <Upload className={cn(
                "h-6 w-6 text-muted-foreground transition-all duration-300",
                isDragOver && "text-primary"
              )} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">クリックして画像を選択</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF に対応</p>
            </div>
          </button>
        )}
      </div>
    </SettingsCard>
  )
}
