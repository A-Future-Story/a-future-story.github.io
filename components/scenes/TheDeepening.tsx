'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TheDeepening() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const isDarkRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return

    // Watch for dark mode changes via ref (no re-render, no timeline rebuild)
    isDarkRef.current = document.documentElement.classList.contains('dark')
    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const startBg = isDarkRef.current ? '#0F0D13' : '#FAF7F2'
    const midBg = isDarkRef.current ? '#1A1816' : '#3A3530'
    const endBg = '#1C1915'

    const mobile = window.innerWidth < 768
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: mobile ? '+=120%' : '+=200%',
        pin: true,
        scrub: mobile ? 0.5 : 1,
        anticipatePin: 1,
      },
    })

    // Two-step bg: ivory → warm charcoal → deep warm black
    tl.fromTo(
      section,
      { backgroundColor: startBg },
      { backgroundColor: midBg, duration: 0.5, ease: 'none' },
    )
    tl.to(
      section,
      { backgroundColor: endBg, duration: 0.5, ease: 'none' },
    )

    tl.fromTo(
      text,
      { opacity: 0, y: 30, color: '#2C1810' },
      { opacity: 1, y: 0, color: '#D4A843', duration: 0.3 },
      0.2,
    )

    // Hold text visible so user can read it
    tl.to({}, { duration: 0.4 })

    return () => {
      observer.disconnect()
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      id="engine"
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center"
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
