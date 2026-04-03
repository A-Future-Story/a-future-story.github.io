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

      <svg
        className="absolute bottom-[10%] w-[60vw] h-[20vh]"
        viewBox="0 0 600 200"
        fill="none"
      >
        <path
          ref={(el) => { pathsRef.current[0] = el }}
          d="M 300 0 Q 300 80 200 150"
          stroke="rgba(201, 150, 58, 0.3)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          ref={(el) => { pathsRef.current[1] = el }}
          d="M 300 0 Q 300 60 420 120 Q 480 150 500 190"
          stroke="rgba(201, 150, 58, 0.6)"
          strokeWidth="2"
          fill="none"
        />
        <text x="160" y="170" fill="rgba(240, 232, 216, 0.4)" fontSize="12" fontFamily="DM Sans, sans-serif">SuperBot</text>
        <text x="470" y="195" fill="rgba(212, 168, 67, 0.7)" fontSize="14" fontFamily="DM Sans, sans-serif" fontWeight="600">Markitect</text>
      </svg>
    </section>
  )
}
