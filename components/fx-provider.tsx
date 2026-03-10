"use client"

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react"

/* ============================================================
   SOUND ENGINE
   Web Audio API を使ってプログラム生成の効果音を鳴らす
   ============================================================ */

type SoundType =
  | "click"       // 汎用ボタン押下
  | "switch_on"   // スイッチON
  | "switch_off"  // スイッチOFF
  | "slider"      // スライダー変化
  | "save"        // 保存ボタン
  | "error"       // エラー
  | "success"     // 成功
  | "rare"        // レアアニメーション

interface FXContextValue {
  playSound: (type: SoundType) => void
  triggerParticle: (x: number, y: number, type?: "normal" | "rare") => void
  rareChance: () => boolean
}

const FXContext = createContext<FXContextValue>({
  playSound: () => {},
  triggerParticle: () => {},
  rareChance: () => false,
})

export function useFX() {
  return useContext(FXContext)
}

/* ---------- Particle types ---------- */
interface Particle {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
  rotation: number
  rotSpeed: number
  life: number
  maxLife: number
  shape: "star" | "circle" | "diamond" | "sparkle"
  rare: boolean
}

let particleId = 0

const RARE_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#c77dff", "#ff9f1c", "#ff006e", "#00f5d4",
]
const NORMAL_COLORS = [
  "oklch(0.7 0.2 25)",
  "oklch(0.8 0.18 35)",
  "oklch(0.75 0.15 45)",
  "oklch(0.9 0.1 20)",
]

function createParticles(
  x: number,
  y: number,
  rare: boolean,
  count: number
): Particle[] {
  const particles: Particle[] = []
  const shapes: Particle["shape"][] = rare
    ? ["star", "star", "sparkle", "diamond", "star", "circle"]
    : ["circle", "star", "diamond"]

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
    const speed = rare ? 4 + Math.random() * 9 : 2 + Math.random() * 5
    const maxLife = rare ? 900 + Math.random() * 400 : 500 + Math.random() * 300

    particles.push({
      id: particleId++,
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed - (rare ? 3 : 1.5),
      size: rare ? 8 + Math.random() * 14 : 4 + Math.random() * 8,
      color: rare
        ? RARE_COLORS[Math.floor(Math.random() * RARE_COLORS.length)]
        : NORMAL_COLORS[Math.floor(Math.random() * NORMAL_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      life: maxLife,
      maxLife,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rare,
    })
  }
  return particles
}

/* ---------- SVG shape paths ---------- */
function StarPath({ size }: { size: number }) {
  const r = size / 2
  const ir = r * 0.45
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const radius = i % 2 === 0 ? r : ir
    pts.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`)
  }
  return <polygon points={pts.join(" ")} />
}

function SparkleShape({ size }: { size: number }) {
  const r = size / 2
  return (
    <g>
      <line x1={-r} y1={0} x2={r} y2={0} strokeWidth={r * 0.35} stroke="currentColor" />
      <line x1={0} y1={-r} x2={0} y2={r} strokeWidth={r * 0.35} stroke="currentColor" />
      <line
        x1={-r * 0.7}
        y1={-r * 0.7}
        x2={r * 0.7}
        y2={r * 0.7}
        strokeWidth={r * 0.2}
        stroke="currentColor"
      />
      <line
        x1={r * 0.7}
        y1={-r * 0.7}
        x2={-r * 0.7}
        y2={r * 0.7}
        strokeWidth={r * 0.2}
        stroke="currentColor"
      />
    </g>
  )
}

/* ---------- RARE TEXT BANNER ---------- */
const RARE_MESSAGES = ["✦ RARE ✦", "★ LUCKY ★", "✸ WOW ✸", "◈ LEGEND ◈", "⬡ ULTRA ⬡"]

function RareBanner({ onDone }: { onDone: () => void }) {
  const msg = RARE_MESSAGES[Math.floor(Math.random() * RARE_MESSAGES.length)]
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center"
      style={{ animation: "rare-flash 1.8s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 8vw, 6rem)",
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          background: "linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #c77dff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 30px rgba(255,200,0,0.8))",
          animation: "rainbow-shimmer 0.5s linear infinite",
          textShadow: "none",
        }}
      >
        {msg}
      </div>
    </div>
  )
}

/* ---------- Particle Canvas ---------- */
function ParticleCanvas({
  particles,
  onUpdate,
}: {
  particles: Particle[]
  onUpdate: (updated: Particle[]) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef(particles)

  useEffect(() => {
    particlesRef.current = particles
  }, [particles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")!

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      rotation: number
    ) => {
      const ir = r * 0.45
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.beginPath()
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2
        const radius = i % 2 === 0 ? r : ir
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.restore()
    }

    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      rotation: number
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.lineWidth = r * 0.35
      ctx.lineCap = "round"
      ctx.beginPath()
      ctx.moveTo(-r, 0)
      ctx.lineTo(r, 0)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -r)
      ctx.lineTo(0, r)
      ctx.stroke()
      ctx.lineWidth = r * 0.2
      ctx.beginPath()
      ctx.moveTo(-r * 0.7, -r * 0.7)
      ctx.lineTo(r * 0.7, r * 0.7)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(r * 0.7, -r * 0.7)
      ctx.lineTo(-r * 0.7, r * 0.7)
      ctx.stroke()
      ctx.restore()
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alive: Particle[] = []

      for (const p of particlesRef.current) {
        if (p.life <= 0) continue
        const progress = 1 - p.life / p.maxLife
        const alpha = Math.max(0, 1 - progress * 1.2)

        p.x += p.dx
        p.y += p.dy + 0.08 * progress * 60 * (1 / 60) // gravity
        p.dy += 0.12
        p.rotation += p.rotSpeed
        p.life -= 16

        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.strokeStyle = p.color

        if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size / 2, p.rotation)
          ctx.fill()
        } else if (p.shape === "diamond") {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.beginPath()
          ctx.moveTo(0, -p.size / 2)
          ctx.lineTo(p.size / 2, 0)
          ctx.lineTo(0, p.size / 2)
          ctx.lineTo(-p.size / 2, 0)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        } else if (p.shape === "sparkle") {
          drawSparkle(ctx, p.x, p.y, p.size / 2, p.rotation)
        }

        ctx.globalAlpha = 1
        alive.push(p)
      }

      if (alive.length !== particlesRef.current.length) {
        onUpdate(alive)
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ width: "100vw", height: "100vh" }}
    />
  )
}

/* ============================================================
   SOUND SYNTH
   ============================================================ */
function createAudioCtx() {
  if (typeof window === "undefined") return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

function playClick(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = "triangle"
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06)
  gain.gain.setValueAtTime(0.18, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.08)
}

function playSwitchOn(ctx: AudioContext) {
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(ctx.destination)
  osc1.type = "square"
  osc2.type = "sine"
  osc1.frequency.setValueAtTime(300, ctx.currentTime)
  osc1.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12)
  osc2.frequency.setValueAtTime(600, ctx.currentTime)
  osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
  osc1.start(ctx.currentTime)
  osc1.stop(ctx.currentTime + 0.18)
  osc2.start(ctx.currentTime)
  osc2.stop(ctx.currentTime + 0.18)
}

function playSwitchOff(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = "square"
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.12)
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.14)
}

function playSliderSound(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = "sine"
  osc.frequency.setValueAtTime(660, ctx.currentTime)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.05)
}

function playSave(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    const t = ctx.currentTime + i * 0.07
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.15, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    osc.start(t)
    osc.stop(t + 0.15)
  })
}

function playError(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.25)
}

function playSuccess(ctx: AudioContext) {
  const notes = [784, 1047]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    const t = ctx.currentTime + i * 0.1
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
    osc.start(t)
    osc.stop(t + 0.18)
  })
}

function playRare(ctx: AudioContext) {
  // 8-bit fanfare
  const melody = [523, 659, 784, 1047, 784, 1047, 1319]
  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = i % 2 === 0 ? "square" : "triangle"
    const t = ctx.currentTime + i * 0.08
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.start(t)
    osc.stop(t + 0.12)
  })
}

/* ============================================================
   FX PROVIDER
   ============================================================ */
export function FXProvider({ children }: { children: React.ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [showRareBanner, setShowRareBanner] = useState(false)
  const sliderThrottleRef = useRef<number>(0)

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioCtx()
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playSound = useCallback(
    (type: SoundType) => {
      const ctx = getAudioCtx()
      if (!ctx) return
      try {
        switch (type) {
          case "click":       playClick(ctx); break
          case "switch_on":   playSwitchOn(ctx); break
          case "switch_off":  playSwitchOff(ctx); break
          case "slider": {
            const now = Date.now()
            if (now - sliderThrottleRef.current < 80) return
            sliderThrottleRef.current = now
            playSliderSound(ctx)
            break
          }
          case "save":    playSave(ctx); break
          case "error":   playError(ctx); break
          case "success": playSuccess(ctx); break
          case "rare":    playRare(ctx); break
        }
      } catch (e) {
        // Ignore audio errors silently
      }
    },
    [getAudioCtx]
  )

  const triggerParticle = useCallback(
    (x: number, y: number, type: "normal" | "rare" = "normal") => {
      const count = type === "rare" ? 24 : 8
      const newParticles = createParticles(x, y, type === "rare", count)
      setParticles((prev) => [...prev.slice(-80), ...newParticles])

      if (type === "rare") {
        setShowRareBanner(true)
        playSound("rare")
      }
    },
    [playSound]
  )

  const rareChance = useCallback(() => {
    return Math.random() < 0.04 // 4% chance
  }, [])

  return (
    <FXContext.Provider value={{ playSound, triggerParticle, rareChance }}>
      {children}
      {particles.length > 0 && (
        <ParticleCanvas
          particles={particles}
          onUpdate={setParticles}
        />
      )}
      {showRareBanner && (
        <RareBanner onDone={() => setShowRareBanner(false)} />
      )}
    </FXContext.Provider>
  )
}
