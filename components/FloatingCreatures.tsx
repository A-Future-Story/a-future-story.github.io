'use client'

import { useEffect, useRef, useState } from 'react'

// SVG paths for each creature type
const CREATURES = {
  bee: (color: string, accent: string) => (
    <g>
      <ellipse cx="12" cy="12" rx="8" ry="6" fill={color} opacity="0.55" />
      <ellipse cx="12" cy="12" rx="5" ry="3.5" fill={accent} opacity="0.7" />
      <line x1="7" y1="10" x2="7" y2="14" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <line x1="10" y1="9" x2="10" y2="15" stroke={accent} strokeWidth="1.5" opacity="0.5" />
      <line x1="14" y1="9" x2="14" y2="15" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="8" cy="7" rx="4" ry="3" fill={accent} opacity="0.3" transform="rotate(-20 8 7)" />
      <ellipse cx="16" cy="7" rx="4" ry="3" fill={color} opacity="0.3" transform="rotate(20 16 7)" />
    </g>
  ),
  butterfly: (color: string, accent: string) => (
    <g>
      <line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <path d="M 12 10 C 6 4 2 8 4 12 C 2 16 6 18 12 14" fill={color} opacity="0.35" />
      <path d="M 12 10 C 18 4 22 8 20 12 C 22 16 18 18 12 14" fill={accent} opacity="0.35" />
      <circle cx="7" cy="10" r="2.5" fill={accent} opacity="0.25" />
      <circle cx="17" cy="10" r="2.5" fill={color} opacity="0.25" />
      <circle cx="6" cy="14" r="1" fill={accent} opacity="0.3" />
      <circle cx="18" cy="14" r="1" fill={color} opacity="0.3" />
    </g>
  ),
  bird: (color: string, accent: string) => (
    <g>
      <path d="M 4 12 Q 8 6 12 10 Q 16 6 20 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M 6 11 Q 9 7 12 10" stroke={accent} strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
      <circle cx="12" cy="11" r="1.2" fill={accent} opacity="0.5" />
    </g>
  ),
  leaf: (color: string, accent: string) => (
    <g>
      <path d="M 12 4 C 6 8 6 16 12 20 C 18 16 18 8 12 4" fill={color} opacity="0.3" />
      <path d="M 12 4 C 9 10 9 16 12 20" fill={accent} opacity="0.15" />
      <line x1="12" y1="6" x2="12" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.35" />
      <line x1="12" y1="10" x2="9" y2="8" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="12" y1="13" x2="15" y2="11" stroke={color} strokeWidth="0.6" opacity="0.25" />
    </g>
  ),
  flower: (color: string, accent: string) => (
    <g>
      <ellipse cx="12" cy="7" rx="3" ry="4" fill={color} opacity="0.3" />
      <ellipse cx="7" cy="12" rx="4" ry="3" fill={accent} opacity="0.25" />
      <ellipse cx="17" cy="12" rx="4" ry="3" fill={color} opacity="0.25" />
      <ellipse cx="12" cy="17" rx="3" ry="4" fill={accent} opacity="0.3" />
      <circle cx="12" cy="12" r="2.5" fill={accent} opacity="0.5" />
    </g>
  ),
  seedpod: (color: string, accent: string) => (
    <g>
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.25" />
      <circle cx="12" cy="12" r="1.5" fill={accent} opacity="0.45" />
      <path d="M 12 9 C 10 5 8 3 6 2" stroke={accent} strokeWidth="0.6" opacity="0.2" fill="none" />
      <path d="M 13 9 C 15 6 17 5 19 4" stroke={color} strokeWidth="0.6" opacity="0.2" fill="none" />
      <path d="M 11 9 C 11 5 12 3 12 1" stroke={color} strokeWidth="0.6" opacity="0.2" fill="none" />
    </g>
  ),
  dot: (color: string, accent: string) => (
    <g>
      <circle cx="12" cy="12" r="3.5" fill={color} opacity="0.2" />
      <circle cx="12" cy="12" r="1.8" fill={accent} opacity="0.35" />
    </g>
  ),
  spore: (color: string, accent: string) => (
    <g>
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.18" />
      <path d="M 12 10 L 12 4" stroke={accent} strokeWidth="0.5" opacity="0.15" />
      <path d="M 10 11 L 6 7" stroke={color} strokeWidth="0.5" opacity="0.12" />
      <path d="M 14 11 L 18 7" stroke={color} strokeWidth="0.5" opacity="0.12" />
    </g>
  ),
}

type CreatureType = keyof typeof CREATURES

interface Creature {
  type: CreatureType
  x: number
  y: number
  size: number
  color: string
  accent: string
  speed: number
  rotation: number
}

const PALETTE = {
  sage: 'rgba(139, 157, 119, 1)',
  rose: 'rgba(196, 112, 110, 1)',
  gold: 'rgba(220, 175, 55, 1)',
  walnut: 'rgba(44, 24, 16, 1)',
  dracGold: 'rgba(201, 150, 58, 1)',
  coral: 'rgba(228, 132, 102, 1)',
  lavender: 'rgba(167, 139, 186, 1)',
  teal: 'rgba(112, 178, 165, 1)',
  peach: 'rgba(235, 180, 148, 1)',
  sky: 'rgba(140, 175, 210, 1)',
}

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function generateCreatures(mobile = false): Creature[] {
  const rng = seeded(42)
  const types: CreatureType[] = ['bee', 'butterfly', 'bird', 'leaf', 'flower', 'seedpod', 'dot', 'spore']
  const colorPairs: [string, string][] = [
    [PALETTE.gold, PALETTE.coral],
    [PALETTE.dracGold, PALETTE.peach],
    [PALETTE.rose, PALETTE.lavender],
    [PALETTE.teal, PALETTE.sage],
    [PALETTE.coral, PALETTE.gold],
    [PALETTE.lavender, PALETTE.rose],
    [PALETTE.sage, PALETTE.teal],
    [PALETTE.peach, PALETTE.coral],
    [PALETTE.sky, PALETTE.lavender],
    [PALETTE.gold, PALETTE.rose],
    [PALETTE.walnut, PALETTE.coral],
    [PALETTE.rose, PALETTE.gold],
  ]

  const result: Creature[] = []

  // Massive density: 120 bands desktop (~4800), 50 bands mobile (~1200)
  const bands = mobile ? 50 : 120
  const perBand = mobile ? [20, 30] : [35, 50]

  for (let band = 0; band < bands; band++) {
    const bandY = band / bands
    const countInBand = perBand[0] + Math.floor(rng() * (perBand[1] - perBand[0] + 1))

    for (let j = 0; j < countInBand; j++) {
      const type = types[Math.floor(rng() * types.length)]
      const [color, accent] = colorPairs[Math.floor(rng() * colorPairs.length)]

      // Edges only — left 0-20% or right 80-100%
      const onLeft = rng() > 0.5
      const x = onLeft
        ? 1 + rng() * 19
        : 80 + rng() * 19

      const y = bandY + (rng() * 0.025 - 0.003)
      const size = 10 + rng() * 18
      const speed = 0.1 + rng() * 0.5
      const rotation = (rng() - 0.5) * 70

      result.push({ type, x, y, size, color, accent, speed, rotation })
    }
  }

  return result
}

const desktopCreatures = generateCreatures(false)

export default function FloatingCreatures() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const creaturesRef = useRef(desktopCreatures)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    if (mobile) {
      creaturesRef.current = generateCreatures(true)
      forceUpdate(n => n + 1)
    }
  }, [])

  useEffect(() => {
    let rafId: number
    const activeCreatures = creaturesRef.current

    function animate() {
      const scrollY = window.scrollY
      const time = Date.now() / 1000
      const pageHeight = document.body.scrollHeight
      const vh = window.innerHeight

      itemsRef.current.forEach((el, i) => {
        if (!el || !activeCreatures[i]) return
        const c = activeCreatures[i]

        // Creatures scroll at 1/5th of page speed — suspended, dreamy
        // speed 0.1–0.6 → scrollRate 0.03–0.08
        const scrollRate = 0.03 + c.speed * 0.08
        const pageY = c.y * pageHeight
        const viewportY = pageY - scrollY * scrollRate

        // Very slow ambient drift
        const xFloat = Math.sin(time * 0.15 + i * 1.7) * 8
        const yFloat = Math.cos(time * 0.12 + i * 2.3) * 4
        const rotFloat = c.rotation + Math.sin(time * 0.1 + i * 2.1) * 5

        el.style.transform = `translate(${xFloat}px, ${viewportY + yFloat}px) rotate(${rotFloat}deg)`

        if (viewportY < -80 || viewportY > vh + 80) {
          el.style.visibility = 'hidden'
        } else {
          el.style.visibility = 'visible'
        }
      })

      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {creaturesRef.current.map((c, i) => (
        <div
          key={i}
          ref={(el) => { itemsRef.current[i] = el }}
          className="absolute left-0 top-0"
          style={{ left: `${c.x}%` }}
        >
          <svg width={c.size} height={c.size} viewBox="0 0 24 24" className="overflow-visible">
            {CREATURES[c.type](c.color, c.accent)}
          </svg>
        </div>
      ))}
    </div>
  )
}
