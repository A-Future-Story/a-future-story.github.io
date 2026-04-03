'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'Knowledge Hubs',
    desc: 'Upload PDFs, sync URLs, or paste text. AI chunks and embeds content automatically.',
  },
  {
    title: 'One-Line Embed',
    desc: 'Copy a single <script> tag. Your chatbot is live in under 5 minutes.',
  },
  {
    title: 'Smart Analytics',
    desc: 'Conversation metrics, satisfaction scores, and peak usage trends in one dashboard.',
  },
]

const STEPS = ['Train your agent', 'Customize & configure', 'Embed & launch']

export default function HelpexaPetal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    itemsRef.current.forEach((el) => {
      if (!el) return
      const tween = gsap.fromTo(el, {
        opacity: 0,
        y: 40,
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

    return () => { triggers.forEach(t => t.kill()) }
  }, [])

  let idx = 0
  const ref = (el: HTMLDivElement | null) => {
    if (el) itemsRef.current[idx++] = el
  }

  return (
    <section ref={sectionRef} className="relative w-full bg-ivory py-24 px-6 md:px-16">
      {/* Header */}
      <div ref={ref} className="max-w-4xl mx-auto text-center mb-16 opacity-0">
        <span className="font-sans text-sm tracking-widest uppercase text-sage mb-4 block">A Skynift Product</span>
        <h2 className="font-serif text-5xl md:text-7xl text-walnut mb-4">Helpexa</h2>
        <p className="font-sans text-xl text-walnut/60 max-w-2xl mx-auto leading-relaxed">
          Your AI support team, ready in minutes. Build, train, and deploy intelligent chatbots — no ML expertise required.
        </p>
      </div>

      {/* Site preview */}
      <div ref={ref} className="max-w-4xl mx-auto mb-16 opacity-0">
        <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.08)] hover:shadow-[0_12px_80px_rgba(44,24,16,0.12)] transition-shadow">
          <Image
            src={isDark ? '/previews/helpexa-dark.png' : '/previews/helpexa.png'}
            alt="Helpexa landing page preview"
            width={1440}
            height={900}
            className="w-full h-auto"
          />
        </a>
      </div>

      {/* How it works — 3 steps */}
      <div ref={ref} className="max-w-3xl mx-auto mb-16 opacity-0">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-rose/15 text-rose flex items-center justify-center font-serif text-sm font-bold">
                  {i + 1}
                </span>
                <span className="font-sans text-walnut/70 text-sm font-medium">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:block text-walnut/20">&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            ref={ref}
            className="p-6 rounded-2xl bg-white/50 border border-walnut/5 opacity-0"
          >
            <h3 className="font-serif text-xl text-walnut mb-2">{f.title}</h3>
            <p className="font-sans text-sm text-walnut/50 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing teaser */}
      <div ref={ref} className="text-center opacity-0">
        <p className="font-sans text-walnut/40 text-sm mb-3">Plans from</p>
        <p className="font-serif text-4xl text-walnut">
          $12<span className="text-lg text-walnut/40">/mo</span>
        </p>
        <p className="font-sans text-walnut/40 text-sm mt-2">Free trial included. No credit card required.</p>
        <a
          href="https://helpexa.com"
          className="inline-block mt-6 px-6 py-3 border border-rose/30 text-rose font-sans text-sm font-medium rounded-full hover:bg-rose/5 transition-colors"
        >
          Explore Helpexa &rarr;
        </a>
      </div>
    </section>
  )
}
