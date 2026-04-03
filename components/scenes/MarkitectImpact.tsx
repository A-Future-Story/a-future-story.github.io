'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useCountUp } from '@/lib/useCountUp'

function Stat({ value, suffix, prefix, label, decimals }: {
  value: number
  suffix?: string
  prefix?: string
  label: string
  decimals?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const display = useCountUp(value, ref, { suffix, prefix, decimals })

  return (
    <div ref={ref} className="text-center py-8">
      <span className="font-serif text-[clamp(3rem,10vw,8rem)] leading-none text-walnut block">
        {display}
      </span>
      <span className="font-sans text-lg md:text-xl text-walnut/50 mt-4 block tracking-wide">
        {label}
      </span>
    </div>
  )
}

export default function MarkitectImpact() {
  return (
    <section className="bg-cream py-16">
      <Stat value={70} suffix="%" label="support tickets eliminated" />
      <Stat value={5} suffix=" min" label="from zero to live campaign" />
      <Stat value={0.01} prefix="$" label="per conversation overflow" decimals={2} />

      {/* Drac AI site preview */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <p className="font-sans text-sm tracking-widest uppercase text-walnut/30 text-center mb-6">Visit drac.ai</p>
        <a href="https://drac.ai" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.08)] hover:shadow-[0_12px_80px_rgba(44,24,16,0.12)] transition-shadow">
          <Image src="/previews/drac-ai.png" alt="Drac AI landing page" width={1440} height={900} className="w-full h-auto" />
        </a>
      </div>
    </section>
  )
}
