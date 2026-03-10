"use client"

import { useState } from "react"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { GeneralSettings } from "@/components/settings/general-settings"
import { TranslationSettings } from "@/components/settings/translation-settings"
import { VoiceSettings } from "@/components/settings/voice-settings"
import { KeybindSettings } from "@/components/settings/keybind-settings"
import { AdvancedSettings } from "@/components/settings/advanced-settings"
import { BackgroundProvider, useBackground } from "@/components/background-provider"
import { FXProvider } from "@/components/fx-provider"

export type SettingsSection = 
  | "general" 
  | "translation" 
  | "voice"
  | "keybinds" 
  | "advanced"

function SettingsContent() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general")
  const { backgroundImage, blurAmount, opacity } = useBackground()

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />
      case "translation":
        return <TranslationSettings />
      case "voice":
        return <VoiceSettings />
      case "keybinds":
        return <KeybindSettings />
      case "advanced":
        return <AdvancedSettings />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image with Blur */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${blurAmount}px)`,
            transform: 'scale(1.1)',
            opacity: opacity,
          }}
        />
      )}
      <div className="relative z-10 flex">
        <SettingsSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <BackgroundProvider>
      <FXProvider>
        <SettingsContent />
      </FXProvider>
    </BackgroundProvider>
  )
}
