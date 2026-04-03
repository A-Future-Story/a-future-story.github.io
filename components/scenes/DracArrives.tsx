'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DracArrives() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const pathsRef = useRef<(SVGPathElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

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

    // Letter-by-letter reveal
    lettersRef.current.forEach((letter, i) => {
      if (!letter) return
      tl.fromTo(
        letter,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        i * 0.1,
      )
    })

    // Subtitle reveal
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.5,
      )
    }

    // Branch SVG draw
    pathsRef.current.forEach((path) => {
      if (!path) return
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      tl.to(
        path,
        { strokeDashoffset: 0, duration: 0.4, ease: 'none' },
        0.6,
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const letters = ['d', 'r', 'a', 'c']

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-fig overflow-hidden"
    >
      <div className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { lettersRef.current[i] = el }}
            className="font-serif text-[12vw] font-bold text-drac-gold opacity-0 leading-none"
          >
            {letter}
          </span>
        ))}
      </div>

      <p
        ref={subtitleRef}
        className="font-sans text-lg md:text-xl text-cream/70 mt-4 opacity-0 tracking-wide"
      >
        AI-powered business intelligence
      </p>

      {/* Branch split — SuperBot (left) vs Markitect (right, larger) */}
      <div className="mt-12 w-full max-w-3xl px-8">
        <svg
          className="w-full"
          viewBox="0 0 600 280"
          fill="none"
          style={{ height: 'auto', minHeight: '180px' }}
        >
          {/* Main stem from center top */}
          <path
            ref={(el) => { pathsRef.current[0] = el }}
            d="M 300 0 C 300 40 280 70 240 110 C 200 150 160 180 130 220"
            stroke="rgba(201, 150, 58, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Markitect branch — longer, bolder */}
          <path
            ref={(el) => { pathsRef.current[1] = el }}
            d="M 300 0 C 300 50 330 80 380 110 C 430 140 460 170 480 220"
            stroke="rgba(201, 150, 58, 0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* SuperBot label */}
          <text x="90" y="250" fill="rgba(240, 232, 216, 0.5)" fontSize="18" fontFamily="'DM Sans', sans-serif">SuperBot</text>
          {/* Markitect label — larger, bolder */}
          <text x="430" y="255" fill="rgba(212, 168, 67, 0.85)" fontSize="22" fontFamily="'DM Sans', sans-serif" fontWeight="700">Markitect</text>
          {/* Small dots at branch ends */}
          <circle cx="130" cy="220" r="4" fill="rgba(240, 232, 216, 0.3)" />
          <circle cx="480" cy="220" r="5" fill="rgba(212, 168, 67, 0.6)" />
        </svg>
      </div>
    </section>
  )
}
