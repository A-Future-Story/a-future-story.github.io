'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFlowerProps {
  className?: string
  color?: string
  size?: number
  side?: 'left' | 'right'
}

/**
 * A botanical flower/leaf that opens as you scroll into it
 * and closes as you scroll past. Creates liveliness throughout the page.
 */
export default function ScrollFlower({
  className = '',
  color = 'rgba(196, 112, 110, 0.25)',
  size = 60,
  side = 'right',
}: ScrollFlowerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const petalsRef = useRef<(SVGEllipseElement | null)[]>([])
  const centerRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1,
      },
    })

    // Petals open
    petalsRef.current.forEach((petal, i) => {
      if (!petal) return
      tl.fromTo(petal,
        { attr: { ry: 2 }, opacity: 0 },
        { attr: { ry: size * 0.35 }, opacity: 1, duration: 0.4, ease: 'power2.out' },
        i * 0.05,
      )
    })

    // Center blooms
    if (centerRef.current) {
      tl.fromTo(centerRef.current,
        { attr: { r: 0 }, opacity: 0 },
        { attr: { r: size * 0.08 }, opacity: 1, duration: 0.3 },
        0.1,
      )
    }

    // Petals close at end
    petalsRef.current.forEach((petal, i) => {
      if (!petal) return
      tl.to(petal,
        { attr: { ry: 2 }, opacity: 0, duration: 0.4 },
        0.6 + i * 0.03,
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [size])

  const cx = size / 2
  const cy = size / 2
  const petalCount = 6
  const petals = Array.from({ length: petalCount }, (_, i) => ({
    rotation: (i / petalCount) * 360,
  }))

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${side === 'left' ? 'mr-auto' : 'ml-auto'} ${className}`}
      style={{ width: size, height: size * 0.6 }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="overflow-visible"
      >
        {petals.map((petal, i) => (
          <ellipse
            key={i}
            ref={(el) => { petalsRef.current[i] = el }}
            cx={cx}
            cy={cy - size * 0.15}
            rx={size * 0.06}
            ry={2}
            fill={color}
            opacity={0}
            transform={`rotate(${petal.rotation} ${cx} ${cy})`}
          />
        ))}
        <circle
          ref={centerRef}
          cx={cx}
          cy={cy}
          r={0}
          fill={color.replace(/[\d.]+\)$/, '0.5)')}
          opacity={0}
        />
      </svg>
    </div>
  )
}
