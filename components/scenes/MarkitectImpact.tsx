'use client'

import { useRef } from 'react'
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
    <div ref={ref} className="text-center py-16">
      <span className="font-serif text-[clamp(4rem,18vw,14rem)] leading-none text-walnut block">
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
    <section className="bg-cream py-24">
      <Stat value={70} suffix="%" label="support tickets eliminated" />
      <Stat value={5} suffix=" min" label="from zero to live campaign" />
      <Stat value={0.01} prefix="$" label="per conversation overflow" decimals={2} />
    </section>
  )
}
