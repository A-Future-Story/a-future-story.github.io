'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface VineProps {
  className?: string
  variant?: 'wide' | 'tall' | 'sprawl'
  color?: string
}

export default function VineDecoration({ className = '', variant = 'wide', color = 'rgba(139, 157, 119, 0.25)' }: VineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<(SVGPathElement | null)[]>([])
  const leavesRef = useRef<(SVGElement | null)[]>([])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 95%',
        end: 'bottom 10%',
        scrub: 1,
      },
    })

    // Draw all vine paths
    pathsRef.current.forEach((path, i) => {
      if (!path) return
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'none' }, i * 0.1)
    })

    // Pop in leaves/buds
    leavesRef.current.forEach((leaf, i) => {
      if (!leaf) return
      tl.fromTo(leaf,
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 0.15 },
        0.15 + i * 0.06
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const darkerColor = color.replace(/[\d.]+\)$/, '0.4)')
  const lighterColor = color.replace(/[\d.]+\)$/, '0.15)')

  if (variant === 'tall') {
    return (
      <svg ref={svgRef} className={`w-full pointer-events-none ${className}`} viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none" style={{ height: '250px' }}>
        {/* Main flowing vine from left */}
        <path ref={el => { pathsRef.current[0] = el }} d="M -20 150 C 100 120 150 180 250 140 S 400 100 500 130 S 650 180 750 140 S 900 90 1000 120 S 1100 160 1220 130" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {/* Secondary tendril branching up */}
        <path ref={el => { pathsRef.current[1] = el }} d="M 250 140 C 280 100 310 70 350 50" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Secondary tendril branching down */}
        <path ref={el => { pathsRef.current[2] = el }} d="M 500 130 C 520 170 550 200 600 220" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Third tendril */}
        <path ref={el => { pathsRef.current[3] = el }} d="M 750 140 C 770 100 800 80 840 60" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Another tendril */}
        <path ref={el => { pathsRef.current[4] = el }} d="M 1000 120 C 1020 160 1040 200 1070 230" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Leaf buds — small teardrop/circle clusters */}
        <circle ref={el => { leavesRef.current[0] = el }} cx="350" cy="48" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[1] = el }} cx="340" cy="55" r="4" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[2] = el }} cx="600" cy="222" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[3] = el }} cx="610" cy="215" r="4" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[4] = el }} cx="840" cy="58" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[5] = el }} cx="830" cy="65" r="4" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[6] = el }} cx="1070" cy="232" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[7] = el }} cx="1060" cy="225" r="4" fill={lighterColor} />
        {/* Mid-vine buds */}
        <circle ref={el => { leavesRef.current[8] = el }} cx="150" cy="168" r="5" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[9] = el }} cx="400" cy="108" r="5" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[10] = el }} cx="650" cy="172" r="5" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[11] = el }} cx="900" cy="98" r="5" fill={darkerColor} />
      </svg>
    )
  }

  if (variant === 'sprawl') {
    return (
      <svg ref={svgRef} className={`w-full pointer-events-none ${className}`} viewBox="0 0 1200 200" fill="none" preserveAspectRatio="none" style={{ height: '160px' }}>
        {/* Two intertwining vines */}
        <path ref={el => { pathsRef.current[0] = el }} d="M -20 100 C 80 60 160 140 300 80 S 500 40 650 100 S 850 160 1000 80 S 1150 40 1220 100" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path ref={el => { pathsRef.current[1] = el }} d="M -20 120 C 100 160 200 60 350 120 S 550 180 700 100 S 880 40 1050 120 S 1180 160 1220 110" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Buds at intersections */}
        <circle ref={el => { leavesRef.current[0] = el }} cx="180" cy="100" r="5" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[1] = el }} cx="420" cy="70" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[2] = el }} cx="580" cy="90" r="4" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[3] = el }} cx="760" cy="130" r="6" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[4] = el }} cx="940" cy="80" r="5" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[5] = el }} cx="1100" cy="115" r="4" fill={lighterColor} />
        {/* Tiny flower-like clusters */}
        <circle ref={el => { leavesRef.current[6] = el }} cx="300" cy="78" r="3" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[7] = el }} cx="305" cy="85" r="2.5" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[8] = el }} cx="295" cy="83" r="2" fill={color} />
        <circle ref={el => { leavesRef.current[9] = el }} cx="700" cy="98" r="3" fill={darkerColor} />
        <circle ref={el => { leavesRef.current[10] = el }} cx="705" cy="105" r="2.5" fill={lighterColor} />
        <circle ref={el => { leavesRef.current[11] = el }} cx="695" cy="103" r="2" fill={color} />
      </svg>
    )
  }

  // Default 'wide' variant
  return (
    <svg ref={svgRef} className={`w-full pointer-events-none ${className}`} viewBox="0 0 1200 180" fill="none" preserveAspectRatio="none" style={{ height: '140px' }}>
      <path ref={el => { pathsRef.current[0] = el }} d="M -20 90 C 150 40 250 140 450 80 S 700 30 900 100 S 1100 50 1220 90" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path ref={el => { pathsRef.current[1] = el }} d="M 450 80 C 470 40 500 20 540 15" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
      <path ref={el => { pathsRef.current[2] = el }} d="M 900 100 C 920 140 950 160 990 170" stroke={lighterColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle ref={el => { leavesRef.current[0] = el }} cx="540" cy="13" r="5" fill={darkerColor} />
      <circle ref={el => { leavesRef.current[1] = el }} cx="530" cy="20" r="3.5" fill={lighterColor} />
      <circle ref={el => { leavesRef.current[2] = el }} cx="990" cy="172" r="5" fill={darkerColor} />
      <circle ref={el => { leavesRef.current[3] = el }} cx="980" cy="165" r="3.5" fill={lighterColor} />
      <circle ref={el => { leavesRef.current[4] = el }} cx="200" cy="68" r="4" fill={darkerColor} />
      <circle ref={el => { leavesRef.current[5] = el }} cx="680" cy="50" r="4" fill={darkerColor} />
      <circle ref={el => { leavesRef.current[6] = el }} cx="1050" cy="72" r="4" fill={darkerColor} />
    </svg>
  )
}
