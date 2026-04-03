'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TheDeepening() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    // Two-step bg: ivory → warm purple → deep fig (avoids grey midpoint)
    tl.fromTo(
      section,
      { backgroundColor: '#FAF7F2' },
      { backgroundColor: '#5E3A5E', duration: 0.5, ease: 'none' },
    )
    tl.to(
      section,
      { backgroundColor: '#2D1B3D', duration: 0.5, ease: 'none' },
    )

    tl.fromTo(
      text,
      { opacity: 0, y: 30, color: '#2C1810' },
      { opacity: 1, y: 0, color: '#D4A843', duration: 0.5 },
      0.3,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center bg-ivory"
    >
      <h2
        ref={textRef}
        className="font-serif text-[clamp(2rem,6vw,5rem)] leading-tight text-center opacity-0"
      >
        Now, meet the engine.
      </h2>
    </section>
  )
}
