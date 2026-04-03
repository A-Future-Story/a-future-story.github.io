'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { name: 'Markitect', size: 'text-5xl md:text-7xl', color: 'text-drac-gold' },
  { name: 'SuperBot', size: 'text-3xl md:text-5xl', color: 'text-fig' },
  { name: 'Helpexa', size: 'text-2xl md:text-4xl', color: 'text-rose' },
]

const TRUST = [
  'SOC 2 certified infrastructure',
  'AES-256 encryption',
  '50+ languages',
  '99.9% uptime',
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
    <section ref={sectionRef} className="relative min-h-screen w-full bg-ivory py-32">
      <div className="text-center mb-24 space-y-6">
        <p className="font-sans text-sm tracking-widest uppercase text-walnut/40 mb-12">The Ecosystem</p>
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`font-serif ${p.size} ${p.color} leading-none`}>
            {p.name}
          </div>
        ))}
      </div>

      <div className="w-px h-24 bg-gradient-to-b from-walnut/10 to-walnut/3 mx-auto mb-24" />

      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 px-8">
        {TRUST.map((signal, i) => (
          <div
            key={signal}
            ref={(el) => { trustRef.current[i] = el }}
            className="text-center py-8 opacity-0"
          >
            <span className="font-sans text-base text-walnut/50 tracking-wide">
              {signal}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
