'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface VineProps {
  className?: string
  direction?: 'left' | 'right' | 'center'
  color?: string
}

export default function VineDecoration({ className = '', direction = 'right', color = 'rgba(139, 157, 119, 0.2)' }: VineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const leafRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    if (!svg || !path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 90%',
        end: 'bottom 20%',
        scrub: 1,
      },
    })

    tl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' })

    // Animate leaf buds
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return
      tl.fromTo(leaf,
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.2 },
        0.2 + i * 0.15
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const isRight = direction === 'right'
  const isCenter = direction === 'center'

  // Different vine paths based on direction
  const vinePath = isCenter
    ? 'M 200 0 C 200 30 180 50 190 80 S 220 110 200 140 S 170 170 200 200'
    : isRight
    ? 'M 0 0 C 40 20 60 50 80 80 S 120 130 160 150 S 220 180 280 200 S 340 210 400 200'
    : 'M 400 0 C 360 20 340 50 320 80 S 280 130 240 150 S 180 180 120 200 S 60 210 0 200'

  // Leaf positions along the vine
  const leaves = isCenter
    ? [{ cx: 185, cy: 50 }, { cx: 215, cy: 110 }, { cx: 180, cy: 170 }]
    : isRight
    ? [{ cx: 60, cy: 50 }, { cx: 120, cy: 130 }, { cx: 220, cy: 180 }, { cx: 340, cy: 205 }]
    : [{ cx: 340, cy: 50 }, { cx: 280, cy: 130 }, { cx: 180, cy: 180 }, { cx: 60, cy: 205 }]

  return (
    <svg
      ref={svgRef}
      className={`w-full pointer-events-none ${className}`}
      viewBox={isCenter ? '0 0 400 200' : '0 0 400 220'}
      fill="none"
      preserveAspectRatio="none"
      style={{ height: isCenter ? '120px' : '80px' }}
    >
      <path
        ref={pathRef}
        d={vinePath}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {leaves.map((leaf, i) => (
        <circle
          key={i}
          ref={(el) => { leafRefs.current[i] = el }}
          cx={leaf.cx}
          cy={leaf.cy}
          r="4"
          fill={color.replace(/[\d.]+\)$/, '0.3)')}
        />
      ))}
    </svg>
  )
}
