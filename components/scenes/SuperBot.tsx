'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MESSAGES = [
  { role: 'user' as const, text: 'What are your return policies for international orders?' },
  { role: 'bot' as const, text: 'International orders can be returned within 30 days. We cover return shipping for EU customers and provide a prepaid label. Processing takes 5-7 business days after we receive the item.' },
  { role: 'user' as const, text: 'And if the item arrived damaged?' },
  { role: 'bot' as const, text: "For damaged items, we offer immediate replacement or full refund — no return needed. Just share a photo through this chat and I'll process it right away." },
]

export default function SuperBotScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<(HTMLDivElement | null)[]>([])

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

    messagesRef.current.forEach((msg, i) => {
      if (!msg) return
      tl.fromTo(
        msg,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        i * 0.2,
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-cream flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 pt-16 md:pt-0">
        <h2 className="font-serif text-[clamp(2rem,4vw,4rem)] text-fig leading-tight text-center md:text-left">
          Your AI that actually<br />
          <span className="text-drac-gold">knows your business</span>
        </h2>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-8">
        <div className="w-full max-w-md space-y-4">
          {MESSAGES.map((msg, i) => (
            <div
              key={i}
              ref={(el) => { messagesRef.current[i] = el }}
              className={`opacity-0 rounded-2xl px-5 py-3 text-sm leading-relaxed max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-fig/10 text-walnut ml-auto rounded-br-md'
                  : 'bg-drac-gold/15 text-walnut rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
