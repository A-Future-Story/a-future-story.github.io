'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// SVG paths for each creature type
const CREATURES = {
  bee: (color: string) => (
    <g>
      <ellipse cx="12" cy="12" rx="8" ry="6" fill={color} opacity="0.6" />
      <ellipse cx="12" cy="12" rx="5" ry="3.5" fill={color} opacity="0.8" />
      <line x1="7" y1="10" x2="7" y2="14" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="10" y1="9" x2="10" y2="15" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="14" y1="9" x2="14" y2="15" stroke={color} strokeWidth="1.5" opacity="0.4" />
      {/* Wings */}
      <ellipse cx="8" cy="7" rx="4" ry="3" fill={color} opacity="0.2" transform="rotate(-20 8 7)" />
      <ellipse cx="16" cy="7" rx="4" ry="3" fill={color} opacity="0.2" transform="rotate(20 16 7)" />
    </g>
  ),
  butterfly: (color: string) => (
    <g>
      {/* Body */}
      <line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* Wings */}
      <path d="M 12 10 C 6 4 2 8 4 12 C 2 16 6 18 12 14" fill={color} opacity="0.25" />
      <path d="M 12 10 C 18 4 22 8 20 12 C 22 16 18 18 12 14" fill={color} opacity="0.25" />
      {/* Inner wing patterns */}
      <circle cx="7" cy="10" r="2" fill={color} opacity="0.15" />
      <circle cx="17" cy="10" r="2" fill={color} opacity="0.15" />
    </g>
  ),
  bird: (color: string) => (
    <g>
      {/* Simple bird silhouette */}
      <path d="M 4 12 Q 8 6 12 10 Q 16 6 20 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" />
      <circle cx="12" cy="11" r="1" fill={color} opacity="0.4" />
    </g>
  ),
  leaf: (color: string) => (
    <g>
      <path d="M 12 4 C 6 8 6 16 12 20 C 18 16 18 8 12 4" fill={color} opacity="0.2" />
      <line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth="0.8" opacity="0.25" />
      <line x1="12" y1="10" x2="9" y2="8" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="12" y1="13" x2="15" y2="11" stroke={color} strokeWidth="0.5" opacity="0.2" />
    </g>
  ),
  vortex: (color: string) => (
    <g>
      {/* Tiny Skynift vortex logo */}
      <path d="M 12 4 C 16 4 18 6 18 8 C 18 10 16 11 14 11 C 12 11 11 10 11 9" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M 11 9 C 11 8 12 7 13 7.5 C 14 8 13.5 9 12 10" stroke={color} strokeWidth="0.8" fill="none" opacity="0.25" />
      <path d="M 12 10 L 12 18" stroke={color} strokeWidth="0.8" opacity="0.2" />
    </g>
  ),
  seedpod: (color: string) => (
    <g>
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.2" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.35" />
      {/* Wisps */}
      <path d="M 12 9 C 10 5 8 3 6 2" stroke={color} strokeWidth="0.5" opacity="0.15" fill="none" />
      <path d="M 13 9 C 15 6 17 5 19 4" stroke={color} strokeWidth="0.5" opacity="0.15" fill="none" />
      <path d="M 11 9 C 11 5 12 3 12 1" stroke={color} strokeWidth="0.5" opacity="0.15" fill="none" />
    </g>
  ),
}

type CreatureType = keyof typeof CREATURES

interface Creature {
  type: CreatureType
  x: number // percentage
  y: number // vh offset
  size: number
  color: string
  speed: number // parallax multiplier
  rotation: number
}

const PALETTE = [
  'rgba(139, 157, 119, 1)',  // sage
  'rgba(196, 112, 110, 1)',  // rose
  'rgba(220, 175, 55, 1)',   // gold (vibrant)
  'rgba(44, 24, 16, 1)',     // walnut
  'rgba(201, 150, 58, 1)',   // drac gold
]

const creatures: Creature[] = [
  // Bees
  { type: 'bee', x: 8, y: 15, size: 22, color: PALETTE[2], speed: 0.3, rotation: 15 },
  { type: 'bee', x: 85, y: 45, size: 18, color: PALETTE[2], speed: 0.5, rotation: -10 },
  { type: 'bee', x: 92, y: 72, size: 20, color: PALETTE[2], speed: 0.35, rotation: 20 },
  // Butterflies
  { type: 'butterfly', x: 12, y: 35, size: 28, color: PALETTE[1], speed: 0.4, rotation: 5 },
  { type: 'butterfly', x: 88, y: 25, size: 24, color: PALETTE[0], speed: 0.25, rotation: -8 },
  { type: 'butterfly', x: 6, y: 65, size: 26, color: PALETTE[1], speed: 0.45, rotation: 12 },
  { type: 'butterfly', x: 90, y: 85, size: 22, color: PALETTE[0], speed: 0.3, rotation: -5 },
  // Birds
  { type: 'bird', x: 15, y: 10, size: 24, color: PALETTE[3], speed: 0.6, rotation: 0 },
  { type: 'bird', x: 80, y: 30, size: 20, color: PALETTE[3], speed: 0.55, rotation: 5 },
  { type: 'bird', x: 20, y: 55, size: 22, color: PALETTE[3], speed: 0.5, rotation: -3 },
  // Leaves
  { type: 'leaf', x: 5, y: 20, size: 20, color: PALETTE[0], speed: 0.2, rotation: 30 },
  { type: 'leaf', x: 95, y: 40, size: 18, color: PALETTE[0], speed: 0.15, rotation: -45 },
  { type: 'leaf', x: 10, y: 60, size: 22, color: PALETTE[0], speed: 0.25, rotation: 60 },
  { type: 'leaf', x: 92, y: 75, size: 16, color: PALETTE[0], speed: 0.18, rotation: -30 },
  { type: 'leaf', x: 3, y: 90, size: 20, color: PALETTE[1], speed: 0.22, rotation: 45 },
  // Vortex logos
  { type: 'vortex', x: 7, y: 50, size: 24, color: PALETTE[3], speed: 0.35, rotation: 0 },
  { type: 'vortex', x: 93, y: 60, size: 20, color: PALETTE[4], speed: 0.4, rotation: 0 },
  // Seed pods
  { type: 'seedpod', x: 88, y: 15, size: 18, color: PALETTE[0], speed: 0.3, rotation: 0 },
  { type: 'seedpod', x: 4, y: 80, size: 20, color: PALETTE[1], speed: 0.2, rotation: 0 },
  { type: 'seedpod', x: 94, y: 55, size: 16, color: PALETTE[2], speed: 0.25, rotation: 0 },
  // Extra gold accents — evenly distributed
  { type: 'seedpod', x: 15, y: 5, size: 22, color: PALETTE[2], speed: 0.4, rotation: 0 },
  { type: 'seedpod', x: 82, y: 20, size: 18, color: PALETTE[4], speed: 0.35, rotation: 0 },
  { type: 'seedpod', x: 10, y: 40, size: 20, color: PALETTE[2], speed: 0.45, rotation: 0 },
  { type: 'seedpod', x: 90, y: 50, size: 16, color: PALETTE[4], speed: 0.4, rotation: 0 },
  { type: 'seedpod', x: 8, y: 70, size: 22, color: PALETTE[2], speed: 0.38, rotation: 0 },
  { type: 'seedpod', x: 85, y: 85, size: 18, color: PALETTE[4], speed: 0.42, rotation: 0 },
]

export default function FloatingCreatures() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Single rAF loop handles both scroll parallax + gentle float
    // No GSAP — avoids transform conflicts
    let rafId: number

    function animate() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      const time = Date.now() / 1000

      itemsRef.current.forEach((el, i) => {
        if (!el || !creatures[i]) return
        const c = creatures[i]
        // Scroll-driven Y offset (moves up as user scrolls down)
        const yOffset = -(progress * window.innerHeight * c.speed * 3)
        // Gentle floating X wobble
        const xFloat = Math.sin(time * 0.5 + i * 1.7) * 10
        // Gentle rotation wobble
        const rotFloat = c.rotation + Math.sin(time * 0.3 + i * 2.1) * 6
        el.style.transform = `translate(${xFloat}px, ${yOffset}px) rotate(${rotFloat}deg)`
      })

      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {creatures.map((c, i) => (
        <div
          key={i}
          ref={(el) => { itemsRef.current[i] = el }}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}vh`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        >
          <svg width={c.size} height={c.size} viewBox="0 0 24 24" className="overflow-visible">
            {CREATURES[c.type](c.color)}
          </svg>
        </div>
      ))}
    </div>
  )
}
