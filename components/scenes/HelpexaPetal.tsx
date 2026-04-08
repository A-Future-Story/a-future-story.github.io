'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { createHelpexaPetals, drawHelpexaBloom } from '@/lib/helpexa-bloom'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'Knowledge Hubs',
    desc: 'Upload PDFs, sync URLs, or paste text. AI chunks and embeds content automatically.',
    icon: '◈',
  },
  {
    title: 'One-Line Embed',
    desc: 'Copy a single <script> tag. Your chatbot is live in under 5 minutes.',
    icon: '⟡',
  },
  {
    title: 'Smart Analytics',
    desc: 'Conversation metrics, satisfaction scores, and peak usage trends in one dashboard.',
    icon: '◎',
  },
]

const STEPS = [
  { label: 'Train your agent', detail: 'Feed it your docs, FAQs, and product pages. It learns your business in minutes.' },
  { label: 'Customize & configure', detail: 'Match your brand colours, tone, and rules. Control what it says and how it says it.' },
  { label: 'Embed & launch', detail: 'One script tag. Your AI support agent is live — no backend setup needed.' },
]

const MESSAGES = [
  { role: 'user' as const, text: 'What are your return policies for international orders?' },
  { role: 'bot' as const, text: 'International orders can be returned within 30 days. We cover return shipping for EU customers and provide a prepaid label. Processing takes 5-7 business days after we receive the item.' },
  { role: 'user' as const, text: 'And if the item arrived damaged?' },
  { role: 'bot' as const, text: "For damaged items, we offer immediate replacement or full refund — no return needed. Just share a photo through this chat and I'll process it right away." },
]

export default function HelpexaPetal() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Canvas bloom refs
  const bloomRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const petalsRef = useRef<ReturnType<typeof createHelpexaPetals>>([])
  const isDarkRef = useRef(false)

  // Combined steps + chat demo
  const demoRef = useRef<HTMLDivElement>(null)
  const stepItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<(HTMLDivElement | null)[]>([])
  const chatHeaderRef = useRef<HTMLDivElement>(null)

  const previewRef = useRef<HTMLDivElement>(null)
  const featuresWrapRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])
  const pricingRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const dark = document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // --- Canvas bloom ---
  useEffect(() => {
    const container = bloomRef.current
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
      petalsRef.current = createHelpexaPetals(w / 2, h / 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const mobile = window.innerWidth < 768
    const proxy = { progress: 0 }
    const tween = gsap.to(proxy, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: mobile ? '+=500%' : '+=1200%',
        pin: true,
        scrub: mobile ? 1 : 2.5,
        anticipatePin: 1,
        onUpdate: (self) => { progressRef.current = self.progress },
      },
    })

    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { rootMargin: '100% 0px' },
    )
    observer.observe(container)

    let rafId: number
    function render() {
      if (isVisible) {
        const w = canvas!.width / dpr
        const h = canvas!.height / dpr
        drawHelpexaBloom(ctx!, petalsRef.current, progressRef.current, w, h, isDarkRef.current)
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

  // --- Content animations ---
  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    // Combined steps + chat demo
    if (demoRef.current) {
      const steps = stepItemsRef.current.filter(Boolean) as HTMLDivElement[]
      const msgs = messagesRef.current.filter(Boolean) as HTMLDivElement[]

      if (isMobile) {
        // MOBILE: no pin — reveal elements as they scroll into view naturally
        // This prevents the chat from being clipped by pinned viewport height

        if (chatHeaderRef.current) {
          const t = gsap.fromTo(chatHeaderRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: chatHeaderRef.current, start: 'top 85%', toggleActions: 'play none none none' } },
          )
          if (t.scrollTrigger) triggers.push(t.scrollTrigger)
        }

        if (progressBarRef.current) {
          const t = gsap.fromTo(progressBarRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: progressBarRef.current, start: 'top 90%', toggleActions: 'play none none none' } },
          )
          if (t.scrollTrigger) triggers.push(t.scrollTrigger)
        }

        steps.forEach((step) => {
          const number = step.querySelector('.step-number') as HTMLElement
          const label = step.querySelector('.step-label') as HTMLElement
          const detail = step.querySelector('.step-detail') as HTMLElement

          if (number) { const t = gsap.fromTo(number, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)', scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none none' } }); if (t.scrollTrigger) triggers.push(t.scrollTrigger) }
          if (label) { const t = gsap.fromTo(label, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none none' } }); if (t.scrollTrigger) triggers.push(t.scrollTrigger) }
          if (detail) { const t = gsap.fromTo(detail, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none none' } }); if (t.scrollTrigger) triggers.push(t.scrollTrigger) }
        })

        msgs.forEach((msg) => {
          const t = gsap.fromTo(msg,
            { opacity: 0, y: 25, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: msg, start: 'top 90%', toggleActions: 'play none none none' } },
          )
          if (t.scrollTrigger) triggers.push(t.scrollTrigger)
        })
      } else {
        // DESKTOP: pinned scrub timeline (unchanged)
        const totalItems = steps.length + msgs.length

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: demoRef.current,
            start: 'top top',
            end: `+=${totalItems * 60 + 100}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        if (chatHeaderRef.current) {
          tl.fromTo(chatHeaderRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
            0,
          )
        }

        if (progressBarRef.current) {
          tl.fromTo(progressBarRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: steps.length * 0.22, ease: 'none' },
            0.05,
          )
        }

        steps.forEach((step, i) => {
          const number = step.querySelector('.step-number') as HTMLElement
          const label = step.querySelector('.step-label') as HTMLElement
          const detail = step.querySelector('.step-detail') as HTMLElement
          const offset = 0.05 + i * 0.22

          if (number) tl.fromTo(number, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08, ease: 'back.out(3)' }, offset)
          if (label) tl.fromTo(label, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, offset + 0.02)
          if (detail) tl.fromTo(detail, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, offset + 0.04)
          tl.to({}, { duration: 0.06 }, offset + 0.12)
        })

        const chatStart = 0.05 + 0.22
        msgs.forEach((msg, i) => {
          tl.fromTo(msg,
            { opacity: 0, y: 25, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power2.out' },
            chatStart + i * 0.15,
          )
        })

        tl.to({}, { duration: 0.25 })

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      }
    }

    // Preview — pinned
    if (previewRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: previewRef.current,
          start: 'top 15%',
          end: '+=80%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
      tl.fromTo(previewRef.current.querySelector('.preview-inner'),
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
        0,
      )
      tl.to({}, { duration: 0.6 })
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
    }

    // Features: scrub-reveal
    if (featuresWrapRef.current && featuresRef.current.length) {
      const cards = featuresRef.current.filter(Boolean) as HTMLDivElement[]

      if (isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: featuresWrapRef.current,
            start: 'top 15%',
            end: () => `+=${cards.length * 80}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        cards.forEach((card, i) => {
          const icon = card.querySelector('.feature-icon') as HTMLElement
          tl.fromTo(card, { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, i * 0.4)
          if (icon) tl.fromTo(icon, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.4)
          tl.to({}, { duration: 0.15 }, i * 0.4 + 0.3)
        })
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: featuresWrapRef.current,
            start: 'top 25%',
            end: '+=150%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        cards.forEach((card, i) => {
          const icon = card.querySelector('.feature-icon') as HTMLElement
          tl.fromTo(card, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }, i * 0.15)
          if (icon) tl.fromTo(icon, { scale: 0.5, opacity: 0, rotate: -10 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.2, ease: 'back.out(2)' }, i * 0.15 + 0.05)
        })
        tl.to({}, { duration: 0.3 })
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      }
    }

    // Pricing
    if (pricingRef.current) {
      const tween = gsap.fromTo(pricingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: pricingRef.current, start: 'top 80%', toggleActions: 'play none none none' } },
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    }

    return () => { triggers.forEach(t => t.kill()) }
  }, [isMobile])

  return (
    <section id="helpexa" ref={sectionRef} className="relative w-full bg-ivory">
      {/* Canvas bloom reveal */}
      <div ref={bloomRef} className="relative h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Steps + live chat demo — pinned split screen */}
      <div
        id="superbot"
        ref={demoRef}
        className="relative min-h-screen md:h-screen w-full bg-ivory flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left: how it works */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 pt-10 md:pt-0">
          <div className="max-w-md w-full">
            <p className="font-sans text-sm tracking-widest uppercase text-rose/40 mb-6">How it works</p>

            {/* Progress bar */}
            <div className="relative h-0.5 bg-walnut/5 rounded-full mb-8 overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-rose/40 to-rose/70 rounded-full origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>

            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.label}
                  ref={(el) => { stepItemsRef.current[i] = el }}
                  className="flex items-start gap-4"
                >
                  <span className="step-number w-9 h-9 shrink-0 rounded-full bg-rose/15 text-rose flex items-center justify-center font-serif text-sm font-bold opacity-0">
                    {i + 1}
                  </span>
                  <div>
                    <span className="step-label font-sans text-walnut text-sm font-semibold block opacity-0">
                      {step.label}
                    </span>
                    <span className="step-detail font-sans text-walnut/50 text-xs leading-relaxed block mt-1 opacity-0">
                      {step.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bullet points beneath steps */}
            <div className="mt-8 space-y-2.5">
              <p className="font-sans text-xs text-walnut/35 flex items-center gap-2">
                <span className="text-rose">✦</span> Trained on your own documents and data
              </p>
              <p className="font-sans text-xs text-walnut/35 flex items-center gap-2">
                <span className="text-rose">✦</span> Multilingual with auto-detection
              </p>
              <p className="font-sans text-xs text-walnut/35 flex items-center gap-2">
                <span className="text-rose">✦</span> Live in 5 minutes with one line of code
              </p>
            </div>
          </div>
        </div>

        {/* Right: live chat demo */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-8 pb-10 md:pb-0">
          <div className="w-full max-w-md">
            {/* Chat window frame */}
            <div className="rounded-2xl border border-walnut/8 bg-[#FDFBF7] overflow-hidden shadow-[0_4px_40px_rgba(44,24,16,0.06)]">
              {/* Chat header */}
              <div
                ref={chatHeaderRef}
                className="opacity-0 flex items-center gap-3 px-5 py-3 border-b border-walnut/5 bg-[#FAF7F2]"
              >
                <span className="w-8 h-8 rounded-full bg-rose/15 text-rose flex items-center justify-center font-serif text-xs font-bold">H</span>
                <div>
                  <span className="font-sans text-sm font-medium text-walnut block leading-tight">Helpexa Agent</span>
                  <span className="font-sans text-[10px] text-sage">Online — typically replies instantly</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3">
                {MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    ref={(el) => { messagesRef.current[i] = el }}
                    className={`opacity-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[88%] ${
                      msg.role === 'user'
                        ? 'bg-walnut/8 text-walnut ml-auto rounded-br-md'
                        : 'bg-rose/10 text-walnut rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 rounded-full border border-walnut/8 bg-[#FAF7F2] px-4 py-2">
                  <span className="font-sans text-xs text-walnut/25 flex-1">Type a message...</span>
                  <span className="text-rose/30 text-sm">↑</span>
                </div>
              </div>
            </div>

            <p className="font-sans text-[11px] text-walnut/25 text-center mt-3">Powered by Helpexa — trained on your business data</p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 pb-24">
        {/* Site preview — pinned */}
        <div ref={previewRef} className="max-w-4xl mx-auto mb-20 pt-16">
          <div className="preview-inner opacity-0">
            <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.08)] hover:shadow-[0_12px_80px_rgba(44,24,16,0.12)] transition-shadow">
              <Image
                src={isDark ? '/previews/helpexa-dark.png' : '/previews/helpexa.png'}
                alt="Helpexa landing page preview"
                width={1440}
                height={900}
                className="w-full h-auto"
              />
            </a>
          </div>
        </div>

        {/* Feature grid — scroll-pinned reveal */}
        <div ref={featuresWrapRef} className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => { featuresRef.current[i] = el }}
                className="p-6 rounded-2xl bg-white/50 border border-walnut/5 opacity-0"
              >
                <span className="feature-icon text-2xl text-rose block mb-3 opacity-0">{f.icon}</span>
                <h3 className="font-serif text-xl text-walnut mb-2">{f.title}</h3>
                <p className="font-sans text-sm text-walnut/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={pricingRef} className="text-center opacity-0">
          <a
            href="https://helpexa.com"
            className="inline-block px-6 py-3 border border-rose/30 text-rose font-sans text-sm font-medium rounded-full hover:bg-rose/5 transition-colors"
          >
            Explore Helpexa &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
