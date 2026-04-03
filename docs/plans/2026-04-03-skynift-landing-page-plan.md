# Skynift "Bloom" Landing Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a cinematic, scroll-driven landing page for skynift.com using the "Bloom" design concept — organic, editorial, warm, with Markitect as the centrepiece.

**Architecture:** Next.js App Router with GSAP ScrollTrigger for scroll-mapped animations, Lenis for smooth scroll normalisation, and HTML5 Canvas for bloom/particle animations. Each scroll scene is an isolated React component with its own ScrollTrigger setup. Pretext library used for canvas typography in key scenes.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, HTML5 Canvas API, @chenglou/pretext

**Design doc:** `docs/plans/2026-04-03-skynift-landing-page-design.md`

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Scaffold Next.js project**

Run:
```bash
cd /Users/adarshshukla/Documents/Adarsh_Work/Skynift/Website/Github
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
```

If the directory isn't empty, answer yes to proceed (it will merge).

Expected: Next.js project initialised with App Router, Tailwind, TypeScript.

**Step 2: Install animation dependencies**

Run:
```bash
npm install gsap lenis
```

Expected: gsap and lenis added to package.json dependencies.

**Step 3: Install fonts**

Run:
```bash
npm install @fontsource-variable/cormorant-garant
```

For General Sans (not on npm), we'll use `next/font/local` with a downloaded font file, or fall back to a similar font from Google Fonts. Use `next/font/google` with "DM Sans" as a close alternative that's freely available.

**Step 4: Verify dev server runs**

Run:
```bash
npm run dev
```

Expected: Server starts on localhost:3000, default Next.js page renders.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with GSAP, Lenis, Tailwind"
```

---

## Task 2: Global Layout — Smooth Scroll + Fonts + Palette

**Files:**
- Create: `components/SmoothScroll.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `lib/fonts.ts`

**Step 1: Create the Lenis + GSAP sync provider**

Create `components/SmoothScroll.tsx`:

```tsx
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
    gsap.ticker.lagSmooth(0)

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
```

**Step 2: Set up fonts**

Create `lib/fonts.ts`:

```ts
import { Cormorant_Garant } from 'next/font/google'
import { DM_Sans } from 'next/font/google'

export const serif = Cormorant_Garant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})
```

**Step 3: Set up the colour palette and global styles**

Modify `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ivory: #FAF7F2;
  --color-walnut: #2C1810;
  --color-rose: #C4706E;
  --color-sage: #8B9D77;
  --color-gold: #D4A843;
  --color-fig: #2D1B3D;
  --color-drac-gold: #C9963A;
  --color-drac-amber: #B8762D;
  --color-cream: #F0E8D8;

  --font-family-serif: var(--font-serif), 'Cormorant Garant', Georgia, serif;
  --font-family-sans: var(--font-sans), 'DM Sans', system-ui, sans-serif;
}

html {
  background-color: var(--color-ivory);
  color: var(--color-walnut);
}

body {
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Subtle paper grain texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

**Step 4: Wire up layout.tsx**

Modify `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { serif, sans } from '@/lib/fonts'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skynift — Intelligence that grows with you',
  description: 'AI-powered products for customer service, ad campaigns, and business automation. Home of Helpexa and Drac AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
```

**Step 5: Verify fonts and scroll work**

Modify `app/page.tsx` to a test page:

```tsx
export default function Home() {
  return (
    <main>
      <div className="h-screen flex items-center justify-center bg-ivory">
        <h1 className="font-serif text-8xl text-walnut">Skynift</h1>
      </div>
      <div className="h-screen flex items-center justify-center bg-fig">
        <h1 className="font-serif text-8xl text-gold">Bloom</h1>
      </div>
      <div className="h-screen flex items-center justify-center bg-ivory">
        <p className="font-sans text-2xl text-walnut">Smooth scroll test</p>
      </div>
    </main>
  )
}
```

Run: `npm run dev` — verify smooth scrolling works, fonts render, colours display correctly.

**Step 6: Commit**

```bash
git add components/SmoothScroll.tsx lib/fonts.ts app/layout.tsx app/globals.css app/page.tsx
git commit -m "feat: set up Lenis smooth scroll, GSAP sync, fonts, and Bloom palette"
```

---

## Task 3: Scene 1 — "The Seed" (Canvas Bloom)

**Files:**
- Create: `components/scenes/TheSeed.tsx`
- Create: `lib/bloom.ts` (canvas bloom rendering logic)
- Modify: `app/page.tsx`

**Step 1: Create the bloom renderer**

Create `lib/bloom.ts` — pure canvas drawing functions for the organic bloom:

```ts
export interface Petal {
  cx: number
  cy: number
  rx: number
  ry: number
  rotation: number
  color: string
  maxScale: number
}

const COLORS = [
  'rgba(196, 112, 110, 0.4)',  // dried rose
  'rgba(139, 157, 119, 0.35)', // sage
  'rgba(212, 168, 67, 0.25)',  // gold whisper
  'rgba(196, 112, 110, 0.2)',  // rose light
  'rgba(139, 157, 119, 0.2)',  // sage light
  'rgba(212, 168, 67, 0.15)',  // gold faint
]

export function createPetals(centerX: number, centerY: number): Petal[] {
  const petals: Petal[] = []
  const count = 12

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const dist = 60 + Math.random() * 140
    petals.push({
      cx: centerX + Math.cos(angle) * dist,
      cy: centerY + Math.sin(angle) * dist,
      rx: 80 + Math.random() * 120,
      ry: 60 + Math.random() * 80,
      rotation: angle + Math.random() * 0.5,
      color: COLORS[i % COLORS.length],
      maxScale: 0.8 + Math.random() * 0.4,
    })
  }
  return petals
}

export function drawBloom(
  ctx: CanvasRenderingContext2D,
  petals: Petal[],
  progress: number, // 0 to 1
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = '#FAF7F2'
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalCompositeOperation = 'multiply'

  for (const petal of petals) {
    const petalProgress = Math.min(1, progress * 1.8) // petals bloom faster than full progress
    const scale = petalProgress * petal.maxScale
    if (scale <= 0.01) continue

    ctx.save()
    ctx.translate(petal.cx, petal.cy)
    ctx.rotate(petal.rotation)
    ctx.scale(scale, scale)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.rx)
    gradient.addColorStop(0, petal.color)
    gradient.addColorStop(0.6, petal.color.replace(/[\d.]+\)$/, '0.1)'))
    gradient.addColorStop(1, 'rgba(250, 247, 242, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(0, 0, petal.rx, petal.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}
```

**Step 2: Create the TheSeed scene component**

Create `components/scenes/TheSeed.tsx`:

```tsx
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
        ctx!.font = `600 ${Math.min(w * 0.08, 80)}px "Cormorant Garant", Georgia, serif`
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
```

**Step 3: Add to page**

Modify `app/page.tsx`:

```tsx
import TheSeed from '@/components/scenes/TheSeed'

export default function Home() {
  return (
    <main>
      <TheSeed />
      {/* Spacer for scroll testing */}
      <div className="h-screen bg-ivory" />
    </main>
  )
}
```

**Step 4: Run and verify**

Run: `npm run dev`
Expected: Canvas bloom unfurls as you scroll. Text appears at ~60%. Section pins and unpins correctly.

**Step 5: Commit**

```bash
git add lib/bloom.ts components/scenes/TheSeed.tsx app/page.tsx
git commit -m "feat: Scene 1 — The Seed canvas bloom with scroll-mapped animation"
```

---

## Task 4: Scene 2 — "The Deepening" (Palette Transition)

**Files:**
- Create: `components/scenes/TheDeepening.tsx`
- Modify: `app/page.tsx`

**Step 1: Create TheDeepening component**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TheDeepening() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return

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

    // Background transition: ivory → fig
    tl.fromTo(
      section,
      { backgroundColor: '#FAF7F2' },
      { backgroundColor: '#2D1B3D', duration: 1, ease: 'none' },
    )

    // Text fades in at 30%, colour shifts
    tl.fromTo(
      text,
      { opacity: 0, y: 30, color: '#2C1810' },
      { opacity: 1, y: 0, color: '#D4A843', duration: 0.5 },
      0.3,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center bg-ivory"
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
```

**Step 2: Add to page after TheSeed**

**Step 3: Verify — smooth background transition from ivory to dark fig, text fades in with colour shift**

**Step 4: Commit**

```bash
git add components/scenes/TheDeepening.tsx app/page.tsx
git commit -m "feat: Scene 2 — The Deepening palette transition"
```

---

## Task 5: Scene 3 — "Drac AI Arrives" (Letter-by-Letter + Branch SVG)

**Files:**
- Create: `components/scenes/DracArrives.tsx`
- Create: `components/BranchSVG.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the letter-by-letter reveal component**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DracArrives() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])

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

    // Letter-by-letter reveal
    lettersRef.current.forEach((letter, i) => {
      tl.fromTo(
        letter,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        i * 0.1,
      )
    })

    // Subtitle reveal
    tl.fromTo(
      '.drac-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 },
      0.5,
    )

    // Branch SVG draw
    tl.fromTo(
      '.branch-path',
      { strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 0.5, ease: 'none' },
      0.6,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  const letters = 'drac'.split('')

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-fig"
    >
      <div className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el }}
            className="font-serif text-[12vw] font-bold text-drac-gold opacity-0 leading-none"
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="drac-subtitle font-sans text-lg md:text-xl text-cream/70 mt-4 opacity-0 tracking-wide">
        AI-powered business intelligence
      </p>

      {/* Branch SVG */}
      <svg
        className="absolute bottom-[10%] w-[60vw] h-[20vh]"
        viewBox="0 0 600 200"
        fill="none"
      >
        {/* Main stem */}
        <path
          className="branch-path"
          d="M 300 0 Q 300 80 200 150"
          stroke="rgba(201, 150, 58, 0.3)"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          fill="none"
        />
        {/* Markitect path — longer, bolder */}
        <path
          className="branch-path"
          d="M 300 0 Q 300 60 420 120 Q 480 150 500 190"
          stroke="rgba(201, 150, 58, 0.6)"
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          fill="none"
        />
        {/* Labels */}
        <text x="160" y="170" fill="rgba(240, 232, 216, 0.4)" fontSize="12" fontFamily="DM Sans, sans-serif">SuperBot</text>
        <text x="470" y="195" fill="rgba(212, 168, 67, 0.7)" fontSize="14" fontFamily="DM Sans, sans-serif" fontWeight="600">Markitect</text>
      </svg>
    </section>
  )
}
```

**Step 2: Add to page, verify letter animation + branch drawing on scroll**

**Step 3: Commit**

```bash
git add components/scenes/DracArrives.tsx app/page.tsx
git commit -m "feat: Scene 3 — Drac AI letter-by-letter reveal with branch SVG"
```

---

## Task 6: Scene 4a — Markitect Reveal (Canvas Bloom)

**Files:**
- Create: `components/scenes/MarkitectReveal.tsx`
- Create: `lib/markitect-bloom.ts`
- Modify: `app/page.tsx`

**Step 1: Create Markitect's bolder bloom renderer**

Create `lib/markitect-bloom.ts` — similar to `lib/bloom.ts` but with geometric, bolder shapes using gold and coral on dark:

```ts
export interface GeoPetal {
  cx: number
  cy: number
  size: number
  sides: number
  rotation: number
  color: string
  maxScale: number
}

const COLORS = [
  'rgba(201, 150, 58, 0.5)',   // drac gold
  'rgba(196, 112, 110, 0.4)',  // coral
  'rgba(184, 118, 45, 0.35)',  // amber
  'rgba(212, 168, 67, 0.3)',   // gold
  'rgba(201, 150, 58, 0.25)',  // gold light
]

export function createGeoPetals(cx: number, cy: number): GeoPetal[] {
  const petals: GeoPetal[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const dist = 50 + Math.random() * 100
    petals.push({
      cx: cx + Math.cos(angle) * dist,
      cy: cy + Math.sin(angle) * dist,
      size: 60 + Math.random() * 100,
      sides: [5, 6, 7, 8][Math.floor(Math.random() * 4)],
      rotation: angle,
      color: COLORS[i % COLORS.length],
      maxScale: 0.8 + Math.random() * 0.4,
    })
  }
  return petals
}

function drawPolygon(ctx: CanvasRenderingContext2D, sides: number, size: number) {
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * size
    const y = Math.sin(angle) * size
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export function drawMarkitectBloom(
  ctx: CanvasRenderingContext2D,
  petals: GeoPetal[],
  progress: number,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height)

  // Dark fig background fading to cream
  const bgProgress = Math.max(0, (progress - 0.7) / 0.3)
  const r = Math.round(45 + bgProgress * (240 - 45))
  const g = Math.round(27 + bgProgress * (232 - 27))
  const b = Math.round(61 + bgProgress * (216 - 61))
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  ctx.fillRect(0, 0, width, height)

  // Draw geometric petals
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  for (const petal of petals) {
    const scale = Math.min(1, progress * 2) * petal.maxScale
    if (scale <= 0.01) continue

    ctx.save()
    ctx.translate(petal.cx, petal.cy)
    ctx.rotate(petal.rotation + progress * 0.3)
    ctx.scale(scale, scale)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size)
    gradient.addColorStop(0, petal.color)
    gradient.addColorStop(1, 'rgba(45, 27, 61, 0)')

    ctx.fillStyle = gradient
    drawPolygon(ctx, petal.sides, petal.size)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()

  // Markitect text
  const textProgress = Math.max(0, (progress - 0.3) / 0.4)
  if (textProgress > 0) {
    ctx.save()
    ctx.globalAlpha = textProgress

    // Choose text color based on background
    const textColor = bgProgress > 0.5 ? '#2C1810' : '#D4A843'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${Math.min(width * 0.1, 100)}px "Cormorant Garant", Georgia, serif`
    ctx.fillStyle = textColor
    ctx.fillText('Markitect', width / 2, height / 2 - 20)

    ctx.font = `400 ${Math.min(width * 0.022, 20)}px "DM Sans", system-ui, sans-serif`
    ctx.fillStyle = bgProgress > 0.5 ? 'rgba(44, 24, 16, 0.7)' : 'rgba(240, 232, 216, 0.7)'
    ctx.fillText('Describe your product. Launch your campaign. AI handles the rest.', width / 2, height / 2 + 30)

    ctx.restore()
  }
}
```

**Step 2: Create the MarkitectReveal component**

Create `components/scenes/MarkitectReveal.tsx` — follows the same pattern as TheSeed but uses the geometric bloom and transitions background from fig to cream:

```tsx
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

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    let rafId: number
    function render() {
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr
      drawMarkitectBloom(ctx!, petalsRef.current, progressRef.current, w, h)
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </section>
  )
}
```

**Step 3: Add to page, verify bloom + bg transition + text**

**Step 4: Commit**

```bash
git add lib/markitect-bloom.ts components/scenes/MarkitectReveal.tsx app/page.tsx
git commit -m "feat: Scene 4a — Markitect geometric bloom reveal with bg transition"
```

---

## Task 7: Scene 4b — Markitect 8-Step Horizontal Scroll

**Files:**
- Create: `components/scenes/MarkitectFlow.tsx`
- Create: `components/FlowPanel.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the FlowPanel component**

```tsx
interface FlowPanelProps {
  step: number
  title: string
  description: string
}

export default function FlowPanel({ step, title, description }: FlowPanelProps) {
  return (
    <div className="w-screen h-screen flex-shrink-0 flex flex-col items-center justify-center px-8">
      <span className="font-sans text-sm tracking-widest uppercase text-drac-amber/50 mb-4">
        Step {step}
      </span>
      <h3 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-walnut text-center leading-tight mb-4">
        {title}
      </h3>
      <p className="font-sans text-lg text-walnut/60 text-center max-w-md">
        {description}
      </p>
    </div>
  )
}
```

**Step 2: Create the horizontal scroll wrapper**

Create `components/scenes/MarkitectFlow.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import FlowPanel from '@/components/FlowPanel'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { title: 'Paste your URL', description: 'Drop in your landing page and let AI understand your product.' },
  { title: 'AI analyses everything', description: 'Key details extracted. Ad strategy formed. Automatically.' },
  { title: 'Headlines generated', description: 'Multiple variations, optimised for each platform.' },
  { title: 'Choose your platforms', description: 'Google Ads, Meta, Instagram — all from one place.' },
  { title: 'One click to publish', description: 'Your campaign goes live across every selected platform.' },
  { title: 'Smart targeting', description: 'AI finds your audience by demographics, interests, and behaviour.' },
  { title: 'AI Budget Flow', description: 'Spend distributed intelligently based on real-time performance.' },
  { title: 'Watch it perform', description: 'Track results with detailed analytics and AI recommendations.' },
]

export default function MarkitectFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const totalScrollWidth = track.scrollWidth - window.innerWidth

    const tween = gsap.to(track, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-cream">
      <div ref={trackRef} className="flex w-fit">
        {STEPS.map((step, i) => (
          <FlowPanel key={i} step={i + 1} title={step.title} description={step.description} />
        ))}
      </div>
    </section>
  )
}
```

**Step 3: Add to page, verify horizontal scrolling works — vertical scroll drives horizontal panel movement**

**Step 4: Commit**

```bash
git add components/FlowPanel.tsx components/scenes/MarkitectFlow.tsx app/page.tsx
git commit -m "feat: Scene 4b — Markitect 8-step horizontal scroll flow"
```

---

## Task 8: Scene 4c — Markitect Impact Numbers

**Files:**
- Create: `components/scenes/MarkitectImpact.tsx`
- Create: `lib/useCountUp.ts`
- Modify: `app/page.tsx`

**Step 1: Create the count-up hook**

Create `lib/useCountUp.ts`:

```ts
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
  const [display, setDisplay] = useState(options?.prefix ?? '' + '0' + (options?.suffix ?? ''))
  const valueRef = useRef({ val: 0 })

  useEffect(() => {
    if (!trigger.current) return

    const tween = gsap.to(valueRef.current, {
      val: target,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger.current,
        start: 'top center',
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
  }, [target, trigger, options?.suffix, options?.prefix, options?.decimals])

  return display
}
```

**Step 2: Create MarkitectImpact component**

Create `components/scenes/MarkitectImpact.tsx`:

```tsx
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
```

**Step 3: Add to page, verify count-up triggers when stats enter viewport**

**Step 4: Commit**

```bash
git add lib/useCountUp.ts components/scenes/MarkitectImpact.tsx app/page.tsx
git commit -m "feat: Scene 4c — Markitect impact numbers with count-up animation"
```

---

## Task 9: Scene 5 — SuperBot Chat Animation

**Files:**
- Create: `components/scenes/SuperBot.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the SuperBot scene with scroll-driven chat**

Create `components/scenes/SuperBot.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MESSAGES = [
  { role: 'user', text: 'What are your return policies for international orders?' },
  { role: 'bot', text: 'International orders can be returned within 30 days. We cover return shipping for EU customers and provide a prepaid label. Processing takes 5-7 business days after we receive the item.' },
  { role: 'user', text: 'And if the item arrived damaged?' },
  { role: 'bot', text: 'For damaged items, we offer immediate replacement or full refund — no return needed. Just share a photo through this chat and I\'ll process it right away.' },
]

export default function SuperBotScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement[]>([])

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
    <section ref={sectionRef} className="relative h-screen w-full bg-cream flex">
      {/* Left: headline */}
      <div className="w-1/2 flex items-center justify-center px-12">
        <h2 className="font-serif text-[clamp(2rem,4vw,4rem)] text-fig leading-tight">
          Your AI that actually<br />
          <span className="text-drac-gold">knows your business</span>
        </h2>
      </div>

      {/* Right: chat simulation */}
      <div className="w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-4">
          {MESSAGES.map((msg, i) => (
            <div
              key={i}
              ref={(el) => { if (el) messagesRef.current[i] = el }}
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
```

**Step 2: Add to page, verify chat messages appear sequentially on scroll**

**Step 3: Commit**

```bash
git add components/scenes/SuperBot.tsx app/page.tsx
git commit -m "feat: Scene 5 — SuperBot chat animation with scroll-driven messages"
```

---

## Task 10: Scene 6 — Helpexa Petal

**Files:**
- Create: `components/scenes/HelpexaPetal.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the parallax floating card**

Create `components/scenes/HelpexaPetal.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = ['Train', 'Embed', 'Launch']

export default function HelpexaPetal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return

    // Parallax float effect
    gsap.fromTo(card, {
      y: 80,
    }, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Feature words stagger
    featuresRef.current.forEach((feat, i) => {
      gsap.fromTo(feat, {
        opacity: 0,
        x: -20,
      }, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: `${30 + i * 8}% center`,
          toggleActions: 'play none none none',
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section || t.trigger === card) t.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full bg-ivory flex items-center justify-center py-32">
      <div
        ref={cardRef}
        className="max-w-lg w-full mx-8 p-12 rounded-3xl bg-white/60 backdrop-blur-sm border border-walnut/5 shadow-[0_8px_60px_rgba(44,24,16,0.06)]"
      >
        <h2 className="font-serif text-5xl md:text-6xl text-walnut mb-4">Helpexa</h2>
        <p className="font-sans text-lg text-walnut/60 mb-8 leading-relaxed">
          AI support that understands your business in minutes.
        </p>

        <div className="space-y-3">
          {FEATURES.map((feat, i) => (
            <span
              key={feat}
              ref={(el) => { if (el) featuresRef.current[i] = el }}
              className="block font-serif text-3xl text-rose opacity-0"
            >
              {feat}.
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to page, verify parallax float + staggered feature reveal**

**Step 3: Commit**

```bash
git add components/scenes/HelpexaPetal.tsx app/page.tsx
git commit -m "feat: Scene 6 — Helpexa parallax petal card"
```

---

## Task 11: Scene 7 — The Garden View (Trust Signals)

**Files:**
- Create: `components/scenes/GardenView.tsx`
- Modify: `app/page.tsx`

**Step 1: Create GardenView with staggered trust signals**

Create `components/scenes/GardenView.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { name: 'Markitect', size: 'text-5xl md:text-7xl', color: 'text-drac-gold' },
  { name: 'SuperBot', size: 'text-3xl md:text-5xl', color: 'text-fig' },
  { name: 'Helpexa', size: 'text-2xl md:text-4xl', color: 'text-rose' },
]

const TRUST = [
  'SOC 2 certified infrastructure',
  'AES-256 encryption',
  '50+ languages',
  '99.9% uptime',
]

export default function GardenView() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Staggered trust signal reveal
    trustRef.current.forEach((el, i) => {
      gsap.fromTo(el, {
        opacity: 0,
        y: 30,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full bg-ivory py-32">
      {/* Product constellation */}
      <div className="text-center mb-24 space-y-6">
        <p className="font-sans text-sm tracking-widest uppercase text-walnut/40 mb-12">The Ecosystem</p>
        {PRODUCTS.map((p) => (
          <div key={p.name} className={`font-serif ${p.size} ${p.color} leading-none`}>
            {p.name}
          </div>
        ))}
      </div>

      {/* Connecting line */}
      <div className="w-px h-24 bg-gradient-to-b from-walnut/10 to-walnut/3 mx-auto mb-24" />

      {/* Trust signals */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-8 px-8">
        {TRUST.map((signal, i) => (
          <div
            key={signal}
            ref={(el) => { if (el) trustRef.current[i] = el }}
            className="text-center py-8 opacity-0"
          >
            <span className="font-sans text-base text-walnut/50 tracking-wide">
              {signal}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Add to page, verify staggered reveals**

**Step 3: Commit**

```bash
git add components/scenes/GardenView.tsx app/page.tsx
git commit -m "feat: Scene 7 — Garden View ecosystem with trust signals"
```

---

## Task 12: Scene 8 — The Invitation (CTA)

**Files:**
- Create: `components/scenes/TheInvitation.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the closing CTA section**

Create `components/scenes/TheInvitation.tsx`:

```tsx
export default function TheInvitation() {
  return (
    <section className="relative min-h-screen w-full bg-ivory flex flex-col items-center justify-center px-8">
      <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-walnut text-center leading-tight mb-12">
        Let&apos;s grow something together.
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
        <a
          href="https://drac.ai"
          className="px-8 py-4 bg-drac-gold text-white font-sans font-semibold text-lg rounded-full hover:bg-drac-amber transition-colors duration-300"
        >
          Try Markitect
        </a>
        <a
          href="https://helpexa.com"
          className="px-8 py-4 border-2 border-walnut/15 text-walnut font-sans font-semibold text-lg rounded-full hover:border-walnut/30 transition-colors duration-300"
        >
          Explore Helpexa
        </a>
        <a
          href="mailto:contact@skynift.com"
          className="font-sans text-walnut/50 hover:text-walnut transition-colors flex items-center gap-2"
        >
          Talk to us
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <p className="font-sans text-sm text-walnut/30">
        contact@skynift.com
      </p>

      <div className="mt-16">
        <span className="font-serif text-2xl text-walnut/20">Skynift</span>
      </div>
    </section>
  )
}
```

**Step 2: Add to page**

**Step 3: Commit**

```bash
git add components/scenes/TheInvitation.tsx app/page.tsx
git commit -m "feat: Scene 8 — The Invitation closing CTA"
```

---

## Task 13: Assemble Full Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Wire all scenes together**

```tsx
import TheSeed from '@/components/scenes/TheSeed'
import TheDeepening from '@/components/scenes/TheDeepening'
import DracArrives from '@/components/scenes/DracArrives'
import MarkitectReveal from '@/components/scenes/MarkitectReveal'
import MarkitectFlow from '@/components/scenes/MarkitectFlow'
import MarkitectImpact from '@/components/scenes/MarkitectImpact'
import SuperBotScene from '@/components/scenes/SuperBot'
import HelpexaPetal from '@/components/scenes/HelpexaPetal'
import GardenView from '@/components/scenes/GardenView'
import TheInvitation from '@/components/scenes/TheInvitation'

export default function Home() {
  return (
    <main>
      <TheSeed />
      <TheDeepening />
      <DracArrives />
      <MarkitectReveal />
      <MarkitectFlow />
      <MarkitectImpact />
      <SuperBotScene />
      <HelpexaPetal />
      <GardenView />
      <TheInvitation />
    </main>
  )
}
```

**Step 2: Full scroll test — run dev server, scroll through all scenes, verify:**
- Smooth scroll via Lenis
- Scene 1 bloom pins and unpins
- Scene 2 palette transitions
- Scene 3 letter reveal + SVG branch
- Scene 4a Markitect bloom
- Scene 4b horizontal scroll
- Scene 4c count-up numbers
- Scene 5 chat animation
- Scene 6 parallax card
- Scene 7 trust reveals
- Scene 8 CTA renders

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble all scenes into full cinematic scroll page"
```

---

## Task 14: Responsive + Mobile Adjustments

**Files:**
- Modify: multiple scene components
- Modify: `app/globals.css`

**Step 1: Add responsive breakpoints for key scenes**

Key changes:
- SuperBot: stack vertically on mobile (full-width headline, then chat below)
- Horizontal scroll (MarkitectFlow): on mobile (`< 768px`), convert to vertical stacked cards with scroll-triggered reveals instead of horizontal scroll
- Canvas scenes: reduce particle count on mobile, simplify bloom
- Typography: verify `clamp()` values work at 375px width
- Trust grid: single column on mobile

**Step 2: Test at 375px, 768px, 1024px, 1440px widths**

Use Playwright MCP for automated screenshot comparison if available.

**Step 3: Commit**

```bash
git commit -am "feat: responsive adjustments for mobile and tablet"
```

---

## Task 15: Performance Pass

**Files:**
- Modify: canvas scene components

**Step 1: Add IntersectionObserver-based lazy initialisation to canvas scenes**

Only start the render loop when the canvas is approaching the viewport. Stop when it leaves.

**Step 2: Verify no scroll jank**

Run: `npm run build && npm start`
Open Chrome DevTools → Performance tab → record a full scroll → verify:
- No frames below 30fps
- No long tasks > 50ms
- No layout thrashing

**Step 3: Commit**

```bash
git commit -am "perf: lazy-init canvas scenes, optimise render loops"
```

---

## Task 16: Build + Deploy Verification

**Step 1: Run production build**

```bash
npm run build
```

Expected: No build errors. Verify no SSR issues with canvas/GSAP (all scene components should be `'use client'`).

**Step 2: Test production server**

```bash
npm start
```

Scroll through full page. Verify everything works as in dev mode.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: production build verification"
```

---

## File Map (Complete)

```
app/
  layout.tsx          — Root layout with fonts + SmoothScroll provider
  page.tsx            — Assembles all scenes
  globals.css         — Palette, typography, grain texture

components/
  SmoothScroll.tsx    — Lenis + GSAP ticker sync
  FlowPanel.tsx       — Individual panel for horizontal scroll
  scenes/
    TheSeed.tsx       — Scene 1: canvas bloom
    TheDeepening.tsx  — Scene 2: palette transition
    DracArrives.tsx   — Scene 3: letter reveal + SVG
    MarkitectReveal.tsx — Scene 4a: geometric bloom
    MarkitectFlow.tsx — Scene 4b: horizontal scroll
    MarkitectImpact.tsx — Scene 4c: count-up stats
    SuperBot.tsx      — Scene 5: chat animation
    HelpexaPetal.tsx  — Scene 6: parallax card
    GardenView.tsx    — Scene 7: ecosystem + trust
    TheInvitation.tsx — Scene 8: CTA

lib/
  fonts.ts            — Font configuration
  bloom.ts            — Canvas bloom renderer (organic)
  markitect-bloom.ts  — Canvas bloom renderer (geometric)
  useCountUp.ts       — Count-up animation hook
```
