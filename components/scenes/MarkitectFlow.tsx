'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import FlowPanel from '@/components/FlowPanel'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { title: 'Paste your URL', description: 'Drop in your landing page and let AI understand your product.' },
  { title: 'AI analyses everything', description: 'Key details extracted. Ad strategy formed. Automatically.' },
  { title: 'Headlines generated', description: 'Multiple variations, optimised for each platform.' },
  { title: 'Choose your platforms', description: 'Google Ads, Meta, Instagram — all from one place.' },
  { title: 'One click to publish', description: 'Your campaign goes live across every selected platform.' },
  { title: 'Smart targeting', description: 'AI finds your audience by demographics, interests, and behaviour.' },
  { title: 'AI Budget Flow', description: 'Spend distributed intelligently based on real-time performance.' },
  { title: 'Watch it perform', description: 'Track results with detailed analytics and AI recommendations.' },
]

export default function MarkitectFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const totalScrollWidth = track.scrollWidth - window.innerWidth

    const tween = gsap.to(track, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [isMobile])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-cream">
      <div
        ref={trackRef}
        className={isMobile ? 'flex flex-col gap-6 px-6 py-12' : 'flex w-fit'}
      >
        {STEPS.map((step, i) => (
          <FlowPanel key={i} step={i + 1} title={step.title} description={step.description} />
        ))}
      </div>
    </section>
  )
}
