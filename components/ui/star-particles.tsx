"use client"

import { useEffect, useState } from "react"
import { StarParticle } from "@/hooks/use-interaction-effects"

interface StarParticlesProps {
  stars: StarParticle[]
}

export function StarParticles({ stars }: StarParticlesProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {stars.map((star) => (
        <Star key={star.id} {...star} />
      ))}
    </div>
  )
}

function Star({ x, y, size, rotation, color }: StarParticle) {
  const [style, setStyle] = useState({
    left: x,
    top: y,
    opacity: 1,
    transform: `rotate(${rotation}deg) scale(0)`,
  })

  useEffect(() => {
    // 初期アニメーション
    requestAnimationFrame(() => {
      setStyle({
        left: x + (Math.random() - 0.5) * 150,
        top: y + (Math.random() - 0.5) * 150 - 50,
        opacity: 0,
        transform: `rotate(${rotation + 360}deg) scale(1.5)`,
      })
    })
  }, [x, y, rotation])

  return (
    <svg
      className="absolute transition-all duration-1000 ease-out"
      style={{
        left: style.left,
        top: style.top,
        opacity: style.opacity,
        transform: style.transform,
        width: size,
        height: size,
      }}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  )
}
