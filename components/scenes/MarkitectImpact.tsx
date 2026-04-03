'use client'

import { useEffect, useRef } from 'react'
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
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    itemsRef.current.forEach((el, i) => {
      if (!el) return
      const tween = gsap.fromTo(el, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => { triggers.forEach(t => t.kill()) }
  }, [])

  return (
    <section className="bg-cream py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div
          ref={(el) => { if (el) itemsRef.current[0] = el }}
          className="text-center mb-14 opacity-0"
        >
          <span className="font-sans text-sm tracking-widest uppercase text-drac-amber/50 block mb-3">What Markitect does</span>
          <h2 className="font-serif text-4xl md:text-5xl text-walnut mb-3">
            Everything you need to launch campaigns
          </h2>
          <p className="font-sans text-lg text-walnut/50 max-w-2xl mx-auto">
            From URL to live ads in minutes. No agency required.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => { if (el) itemsRef.current[i + 1] = el }}
              className="p-6 rounded-2xl bg-white/40 border border-walnut/5 opacity-0 hover:bg-white/60 transition-colors"
            >
              <span className="text-2xl text-drac-gold block mb-3">{f.icon}</span>
              <h3 className="font-serif text-lg text-walnut mb-2">{f.title}</h3>
              <p className="font-sans text-sm text-walnut/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Drac AI site preview */}
        <div
          ref={(el) => { if (el) itemsRef.current[7] = el }}
          className="opacity-0"
        >
          <p className="font-sans text-sm tracking-widest uppercase text-walnut/30 text-center mb-6">Visit drac.ai</p>
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.08)] hover:shadow-[0_12px_80px_rgba(44,24,16,0.12)] transition-shadow">
            <Image src="/previews/drac-ai.png" alt="Drac AI landing page" width={1440} height={900} className="w-full h-auto" />
          </a>
        </div>
      </div>
    </section>
  )
}
