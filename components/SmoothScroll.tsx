'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return

    lenis.on('scroll', ScrollTrigger.update)

    function update(time: number) {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      autoRaf={false}
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
