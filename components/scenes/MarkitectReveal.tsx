'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { createGeoPetals, drawMarkitectBloom } from '@/lib/markitect-bloom'

gsap.registerPlugin(ScrollTrigger)

export default function MarkitectReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const petalsRef = useRef<ReturnType<typeof createGeoPetals>>([])
  const isDarkRef = useRef(false)

  useEffect(() => {
    const check = () => { isDarkRef.current = document.documentElement.classList.contains('dark') }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      petalsRef.current = createGeoPetals(w / 2, h / 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const proxy = { progress: 0 }
    const tween = gsap.to(proxy, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=2500%',
        pin: true,
        scrub: 2.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      },
    })

    // Visibility check – only render when near the viewport
    let isVisible = true

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { rootMargin: '100% 0px' } // start rendering 1 viewport before visible
    )
    observer.observe(container)

    let rafId: number
    function render() {
      if (isVisible) {
        const w = canvas!.width / dpr
        const h = canvas!.height / dpr
        drawMarkitectBloom(ctx!, petalsRef.current, progressRef.current, w, h, isDarkRef.current)
      }
      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      tween.scrollTrigger?.kill()
      tween.kill()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </section>
  )
}
