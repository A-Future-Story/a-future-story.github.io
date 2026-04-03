'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCountUp(
  target: number,
  trigger: React.RefObject<HTMLElement | null>,
  options?: { suffix?: string; prefix?: string; decimals?: number }
) {
  const [display, setDisplay] = useState(`${options?.prefix ?? ''}0${options?.suffix ?? ''}`)
  const valueRef = useRef({ val: 0 })

  useEffect(() => {
    if (!trigger.current) return

    const tween = gsap.to(valueRef.current, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
        once: true,
      },
      onUpdate: () => {
        const v = valueRef.current.val
        const formatted = options?.decimals
          ? v.toFixed(options.decimals)
          : Math.round(v).toString()
        setDisplay(`${options?.prefix ?? ''}${formatted}${options?.suffix ?? ''}`)
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [target])

  return display
}
