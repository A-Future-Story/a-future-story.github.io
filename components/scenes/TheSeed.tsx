'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { createPetals, drawBloom } from '@/lib/bloom'

gsap.registerPlugin(ScrollTrigger)

export default function TheSeed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const petalsRef = useRef<ReturnType<typeof createPetals>>([])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      petalsRef.current = createPetals(w / 2, h / 2)
    }
    resize()
    window.addEventListener('resize', resize)

    // ScrollTrigger: pin and scrub
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    // Visibility check – only render when near the viewport
    let isVisible = true

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { rootMargin: '100% 0px' } // start rendering 1 viewport before visible
    )
    observer.observe(container)

    // Render loop
    let rafId: number
    function render() {
      if (isVisible) {
        const w = canvas!.width / dpr
        const h = canvas!.height / dpr
        drawBloom(ctx!, petalsRef.current, progressRef.current, w, h)

        // Text reveal after 60% progress
        const textProgress = Math.max(0, (progressRef.current - 0.6) / 0.4)
        if (textProgress > 0) {
          ctx!.save()
          ctx!.globalAlpha = textProgress
          ctx!.textAlign = 'center'
          ctx!.textBaseline = 'middle'

          // Main title
          ctx!.font = `600 ${Math.min(w * 0.08, 80)}px "Cormorant Garamond", Georgia, serif`
          ctx!.fillStyle = '#2C1810'
          ctx!.fillText('Skynift', w / 2, h / 2 - 20)

          // Tagline
          ctx!.font = `400 ${Math.min(w * 0.02, 18)}px "DM Sans", system-ui, sans-serif`
          ctx!.fillStyle = 'rgba(44, 24, 16, 0.7)'
          ctx!.fillText('Intelligence that grows with you', w / 2, h / 2 + 30)

          ctx!.restore()
        }
      }

      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      trigger.kill()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Floating ambient text — visible on load, fades as bloom grows */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] font-semibold text-walnut/30 mb-3 leading-none">Skynift</h1>
        <p className="font-sans text-base md:text-lg text-walnut/20 tracking-widest uppercase">Intelligence that grows with you</p>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse z-10">
        <span className="font-sans text-xs tracking-widest uppercase text-walnut/30">Scroll</span>
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="text-walnut/20">
          <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="10" cy="8" r="2" fill="currentColor">
            <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </section>
  )
}
