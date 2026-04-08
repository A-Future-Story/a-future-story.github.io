'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CompanyIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const mobile = window.innerWidth < 768
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: mobile ? '+=100%' : '+=180%',
        pin: true,
        scrub: mobile ? 0.5 : 1,
        anticipatePin: 1,
      },
    })

    // Fade in label
    if (labelRef.current) {
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0,
      )
    }

    // Fade in heading with slight delay
    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        0.1,
      )
    }

    // Fade in pills
    if (pillsRef.current) {
      tl.fromTo(
        pillsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.3,
      )
    }

    // Hold visible — the rest of the timeline is just holding
    tl.to({}, { duration: 0.4 })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-screen w-full bg-ivory flex items-center justify-center"
    >
      <div className="text-center px-6">
        <p
          ref={labelRef}
          className="font-sans text-sm tracking-widest uppercase text-walnut/30 mb-6 opacity-0"
        >
          Skynift Private Limited
        </p>
        <h2
          ref={headingRef}
          className="font-serif text-[clamp(1.5rem,3.5vw,3rem)] text-walnut/70 max-w-3xl mx-auto leading-relaxed mb-6 opacity-0"
        >
          We build AI products that transform how businesses serve customers and reach audiences.
        </h2>
        <div
          ref={pillsRef}
          className="flex flex-wrap justify-center gap-8 text-walnut/30 font-sans text-sm opacity-0"
        >
          <span>Customer Service AI</span>
          <span className="text-walnut/10">|</span>
          <span>Ad Campaign Automation</span>
          <span className="text-walnut/10">|</span>
          <span>Business Intelligence</span>
        </div>
      </div>
    </section>
  )
}
