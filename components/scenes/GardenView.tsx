'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { name: 'Markitect', size: 'text-4xl sm:text-5xl md:text-7xl', color: 'text-drac-gold' },
  { name: 'SuperBot', size: 'text-2xl sm:text-3xl md:text-5xl', color: 'text-fig' },
  { name: 'Helpexa', size: 'text-xl sm:text-2xl md:text-4xl', color: 'text-rose' },
]

const TRUST = [
  {
    label: 'SOC 2 certified infrastructure',
    icon: (
      <svg className="w-8 h-8 mb-3 mx-auto text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: 'AES-256 encryption',
    icon: (
      <svg className="w-8 h-8 mb-3 mx-auto text-drac-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
  },
  {
    label: '50+ languages',
    icon: (
      <svg className="w-8 h-8 mb-3 mx-auto text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
  {
    label: 'Built for scale',
    icon: (
      <svg className="w-8 h-8 mb-3 mx-auto text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
]

export default function GardenView() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    trustRef.current.forEach((el) => {
      if (!el) return
      const tween = gsap.fromTo(el, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => {
      triggers.forEach(t => t.kill())
    }
  }, [])

  return (
    <section id="ecosystem" ref={sectionRef} className="relative min-h-screen w-full bg-ivory py-16 sm:py-32">
      <div className="text-center mb-12 sm:mb-24 space-y-4 sm:space-y-6">
        <p className="font-sans text-sm tracking-widest uppercase text-walnut/40 mb-12">The Ecosystem</p>
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`font-serif ${p.size} ${p.color} leading-none`}>
            {p.name}
          </div>
        ))}
      </div>

      <div className="w-px h-16 sm:h-24 bg-gradient-to-b from-walnut/10 to-walnut/3 mx-auto mb-12 sm:mb-24" />

      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 px-6 sm:px-8">
        {TRUST.map((signal, i) => (
          <div
            key={signal.label}
            ref={(el) => { trustRef.current[i] = el }}
            className="text-center py-8 opacity-0 rounded-2xl border border-walnut/5 bg-white/30 px-4"
          >
            {signal.icon}
            <span className="font-sans text-base text-walnut/50 tracking-wide">
              {signal.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
