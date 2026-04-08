'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'Multi-Platform Campaigns',
    desc: 'Google Search, Display, Facebook, Instagram — all created from a single interface. One campaign, every platform.',
    icon: '◎',
  },
  {
    title: 'AI-Generated Copy',
    desc: 'Multiple headline variations, compelling descriptions, and creative recommendations — crafted by AI, refined by you.',
    icon: '✦',
  },
  {
    title: 'Smart Budget Distribution',
    desc: 'AI allocates daily spend across platforms based on real-time performance. No upfront bulk spending required.',
    icon: '⟡',
  },
  {
    title: 'Landing Page Intelligence',
    desc: 'Paste a URL — AI extracts product details, generates ad copy, and suggests optimal targeting. Setup in minutes.',
    icon: '◈',
  },
  {
    title: 'Audience Targeting',
    desc: 'Demographics, interests, behaviours — AI finds your audience and continuously optimises reach.',
    icon: '◉',
  },
  {
    title: 'Performance Analytics',
    desc: 'Track campaign performance with detailed reports, insights, and AI-driven optimisation recommendations.',
    icon: '◐',
  },
]

export default function MarkitectImpact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridWrapRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const activeRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    // --- MOBILE: pin the whole grid section and reveal cards one by one ---
    if (isMobile) {
      // Header fade-in (not pinned on mobile — just a reveal)
      if (headerRef.current) {
        const tween = gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        )
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      }

      // Pin the grid area and scrub-reveal each card
      if (gridWrapRef.current && itemsRef.current.length) {
        const cards = itemsRef.current.filter(Boolean) as HTMLDivElement[]
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridWrapRef.current,
            start: 'top 15%',
            end: () => `+=${cards.length * 45}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        cards.forEach((card, i) => {
          // Fade in + slide up
          tl.fromTo(card,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
            i * 0.35,
          )
          // Highlight the active card's icon
          const icon = card.querySelector('.feature-icon') as HTMLElement
          if (icon) {
            tl.fromTo(icon,
              { scale: 0.5, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' },
              i * 0.35,
            )
          }
          // Hold so user can read
          tl.to({}, { duration: 0.15 }, i * 0.35 + 0.3)
        })

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      }
    } else {
      // --- DESKTOP: pin header, scrub-stagger cards in grid ---
      if (headerRef.current) {
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 20%',
            end: '+=80%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
        headerTl.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        )
        headerTl.to({}, { duration: 0.6 })
        if (headerTl.scrollTrigger) triggers.push(headerTl.scrollTrigger)
      }

      // Scrub-based card reveal: pin the grid and stagger cards in
      if (gridWrapRef.current && itemsRef.current.length) {
        const cards = itemsRef.current.filter(Boolean) as HTMLDivElement[]
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridWrapRef.current,
            start: 'top 25%',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        // Reveal cards in pairs (rows of 3 on lg, 2 on md)
        cards.forEach((card, i) => {
          const row = Math.floor(i / 3)
          const offset = row * 0.3 + (i % 3) * 0.05
          tl.fromTo(card,
            { opacity: 0, y: 40, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' },
            offset,
          )
          const icon = card.querySelector('.feature-icon') as HTMLElement
          if (icon) {
            tl.fromTo(icon,
              { scale: 0.5, opacity: 0, rotate: -15 },
              { scale: 1, opacity: 1, rotate: 0, duration: 0.2, ease: 'back.out(2)' },
              offset + 0.05,
            )
          }
        })

        // Hold at end so user absorbs all cards
        tl.to({}, { duration: 0.3 })

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      }
    }

    // Preview section — pinned so the screenshot anchors properly
    if (previewRef.current) {
      const previewTl = gsap.timeline({
        scrollTrigger: {
          trigger: previewRef.current,
          start: 'top 15%',
          end: '+=80%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
      previewTl.fromTo(previewRef.current.querySelector('.preview-inner'),
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
        0,
      )
      // Hold so user can view it
      previewTl.to({}, { duration: 0.6 })
      if (previewTl.scrollTrigger) triggers.push(previewTl.scrollTrigger)
    }

    return () => { triggers.forEach(t => t.kill()) }
  }, [isMobile])

  return (
    <section id="features" ref={sectionRef} className="bg-cream overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        {/* Section header */}
        <div
          ref={headerRef}
          className="text-center py-16 sm:py-24 md:py-32 opacity-0"
        >
          <span className="font-sans text-sm tracking-widest uppercase text-drac-amber/50 block mb-3">What Markitect does</span>
          <h2 className="font-serif text-3xl md:text-5xl text-walnut mb-3">
            Everything you need to launch campaigns
          </h2>
          <p className="font-sans text-base md:text-lg text-walnut/50 max-w-2xl mx-auto">
            From URL to live ads in minutes. No agency required.
          </p>
        </div>

        {/* Feature grid — pinned with scrub reveal */}
        <div ref={gridWrapRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-6 sm:py-8 md:py-16">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => { if (el) itemsRef.current[i] = el }}
                className="p-6 rounded-2xl bg-white/40 border border-walnut/5 opacity-0 hover:bg-white/60 transition-colors"
              >
                <span className="feature-icon text-2xl text-drac-gold block mb-3 opacity-0">{f.icon}</span>
                <h3 className="font-serif text-lg text-walnut mb-2">{f.title}</h3>
                <p className="font-sans text-sm text-walnut/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual divider */}
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-drac-gold/20" />
          <span className="text-drac-gold/30 text-lg">◈</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-drac-gold/20" />
        </div>

        {/* Drac AI site preview — pinned for anchor */}
        <div ref={previewRef} className="pb-32 pt-8">
          <div className="preview-inner opacity-0">
            <p className="font-sans text-sm tracking-widest uppercase text-walnut/30 text-center mb-6">Visit drac.ai</p>
            <a href="https://drac.ai" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.08)] hover:shadow-[0_12px_80px_rgba(44,24,16,0.12)] transition-shadow">
              <Image src="/previews/drac-ai.png" alt="Drac AI landing page" width={1440} height={900} className="w-full h-auto" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
