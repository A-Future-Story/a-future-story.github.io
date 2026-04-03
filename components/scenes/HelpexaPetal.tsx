'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = ['Train', 'Embed', 'Launch']

export default function HelpexaPetal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return

    const triggers: ScrollTrigger[] = []

    // Parallax float effect
    const parallax = gsap.fromTo(card, {
      y: 80,
    }, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    if (parallax.scrollTrigger) triggers.push(parallax.scrollTrigger)

    // Feature words stagger
    featuresRef.current.forEach((feat, i) => {
      if (!feat) return
      const tween = gsap.fromTo(feat, {
        opacity: 0,
        x: -20,
      }, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: `${30 + i * 8}% center`,
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
    <section ref={sectionRef} className="relative min-h-screen w-full bg-ivory flex items-center justify-center py-32">
      <div
        ref={cardRef}
        className="max-w-lg w-full mx-8 p-12 rounded-3xl bg-white/60 backdrop-blur-sm border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.06)]"
      >
        <h2 className="font-serif text-5xl md:text-6xl text-walnut mb-4">Helpexa</h2>
        <p className="font-sans text-lg text-walnut/60 mb-8 leading-relaxed">
          AI support that understands your business in minutes.
        </p>

        <div className="space-y-3">
          {FEATURES.map((feat, i) => (
            <span
              key={feat}
              ref={(el) => { featuresRef.current[i] = el }}
              className="block font-serif text-3xl text-rose opacity-0"
            >
              {feat}.
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
