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

    // Render loop
    let rafId: number
    function render() {
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

      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafId)
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
    </section>
  )
}
