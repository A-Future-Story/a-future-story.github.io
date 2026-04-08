'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import FlowPanel from '@/components/FlowPanel'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { title: 'Paste your URL', description: 'Drop in your landing page. AI extracts key details and forms your ad strategy.' },
  { title: 'AI generates everything', description: 'Headlines, descriptions, audience targeting — crafted for Google Ads and Meta simultaneously.' },
  { title: 'One click to publish', description: 'Your campaign goes live across platforms with smart budget distribution.' },
  { title: 'Watch it perform', description: 'Real-time analytics, AI-driven optimisations, and detailed performance reports.' },
]

export default function MarkitectFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const triggers: ScrollTrigger[] = []

    if (isMobile) {
      // MOBILE: each panel animates in as it enters viewport
      panelsRef.current.forEach((panel) => {
        if (!panel) return
        const tween = gsap.fromTo(panel,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      })
    } else {
      // DESKTOP: horizontal scroll with pin
      const totalScrollWidth = track.scrollWidth - window.innerWidth
      const breathingRoom = window.innerHeight * 0.6

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalScrollWidth + breathingRoom}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        duration: 1,
      })

      tl.to({}, { duration: 0.3 })

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
    }

    return () => {
      triggers.forEach(t => t.kill())
    }
  }, [isMobile])

  return (
    <section id="how-it-works" ref={containerRef} className="relative overflow-hidden bg-cream min-h-screen">
      <div
        ref={trackRef}
        className={isMobile ? 'flex flex-col px-0 py-8' : 'flex w-fit'}
      >
        {STEPS.map((step, i) => (
          <div key={i} ref={(el) => { panelsRef.current[i] = el }} className={isMobile ? 'opacity-0' : ''}>
            <FlowPanel step={i + 1} title={step.title} description={step.description} compact={isMobile} />
          </div>
        ))}
      </div>
    </section>
  )
}
