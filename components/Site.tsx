'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SPRIG_POSES, SPRIG_START, type SprigState } from '@/lib/sprig-poses'

const THEME_KEY = 'skynift-theme'
const WORDMARK_ASPECT = 2.093
const CHAPTERS = ['Intelligence that grows', 'We start with one job', 'Then we make it show its work', 'Drac', 'More will grow', 'Come say hello']
const LAST = CHAPTERS.length - 1
// The film runs on a timeline of 2 units per chapter: hold (words resting), then the change.
// Chapter k rests over [2k, 2k+1]; the move to k+1 happens over [2k+1, 2k+2].
const TL_END = 2 * LAST + 1
const labelAt = (k: number) => (k === 0 ? 0 : k === LAST ? TL_END : 2 * k + 0.5)

// The theme lives on <html data-theme>; the inline script in layout.tsx sets it before paint
const themeStore = {
  subscribe(cb: () => void) {
    const mo = new MutationObserver(cb)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  },
  isDark: () => document.documentElement.dataset.theme === 'dark',
  isDarkOnServer: () => false,
}

function Wordmark({ height, className }: { height: number; className?: string }) {
  const width = Math.round(height * WORDMARK_ASPECT)
  return (
    <>
      <img src="/brand/skynift-wordmark-light.svg" alt="Skynift" width={width} height={height} className={`on-light ${className ?? ''}`} />
      <img src="/brand/skynift-wordmark-dark.svg" alt="Skynift" width={width} height={height} className={`on-dark ${className ?? ''}`} />
    </>
  )
}

export default function Site() {
  const rootRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<HTMLElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const navRef = useRef(0)
  const reducedRef = useRef(false)
  const [noGL, setNoGL] = useState(false)
  const dark = useSyncExternalStore(themeStore.subscribe, themeStore.isDark, themeStore.isDarkOnServer)

  const toggleTheme = useCallback(() => {
    const el = document.documentElement
    const next = el.dataset.theme === 'dark' ? 'light' : 'dark'
    el.dataset.theme = next
    try { localStorage.setItem(THEME_KEY, next) } catch { /* private mode */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#141210' : '#faf7f2')
  }, [])

  // Jump to a chapter: glide to its resting point, then move focus to its heading
  const goTo = useCallback((i: number) => (e: React.MouseEvent) => {
    const st = stRef.current
    if (!st) return
    e.preventDefault()
    const reduced = reducedRef.current
    // while we glide there, snapping stands aside
    navRef.current = performance.now() + (reduced ? 200 : 1600)
    window.scrollTo({ top: Math.round(st.labelToScroll(`c${i}`)), behavior: reduced ? 'auto' : 'smooth' })
    const h = rootRef.current?.querySelector<HTMLElement>(`[data-ch="${i}"] h2, [data-ch="${i}"] h1`)
    if (h) setTimeout(() => h.focus({ preventScroll: true }), reduced ? 0 : 1000)
    const hash = (e.currentTarget as HTMLAnchorElement).hash || (i === 0 ? '#top' : '')
    if (hash) history.replaceState(null, '', hash)
  }, [])

  // The film: one master timeline drives the plant, the words and the chapter dots
  useEffect(() => {
    const root = rootRef.current
    const film = filmRef.current
    if (!root || !film) return
    gsap.registerPlugin(ScrollTrigger)
    const view = root.querySelector<HTMLElement>('.sk-view')!
    const canvas = root.querySelector<HTMLCanvasElement>('.sk-canvas')!
    const dots = Array.from(root.querySelectorAll<HTMLElement>('.sk-dots button'))
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    reducedRef.current = reduced

    const S: SprigState = { ...SPRIG_START }
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } })
    const layers = Array.from(root.querySelectorAll<HTMLElement>('.sk-layer'))
    const kidsOf = (layer: HTMLElement) => layer.querySelectorAll(':scope > div > *')

    for (let k = 0; k < LAST; k++) {
      const s = 2 * k + 1
      // the plant moves through the whole change
      tl.to(S, { ...SPRIG_POSES[k], duration: 1, ease: 'power1.inOut' }, s)
      tl.to(S, { c: k + 1, duration: 1, ease: 'none' }, s)
      // words of chapter k leave first...
      tl.to(kidsOf(layers[k]), { y: -28, autoAlpha: 0, duration: 0.3, stagger: 0.03, ease: 'power2.in' }, s)
      tl.set(layers[k], { autoAlpha: 0 }, s + 0.42)
      // ...and only then do the words of k+1 arrive, settling before the hold
      tl.set(layers[k + 1], { autoAlpha: 1 }, s + 0.5)
      tl.fromTo(kidsOf(layers[k + 1]), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.045, ease: 'power3.out', immediateRender: false }, s + 0.52)
    }
    tl.set({}, {}, TL_END)
    for (let k = 0; k <= LAST; k++) tl.addLabel(`c${k}`, labelAt(k))
    gsap.set(layers.slice(1), { autoAlpha: 0 })

    // Snap to the chapter you are heading towards; land exactly when already there
    const stops = Array.from({ length: LAST + 1 }, (_, k) => labelAt(k) / TL_END)
    let dir = 1
    const snapTo = (v: number) => {
      if (performance.now() < navRef.current) return v
      const near = stops.find((p) => Math.abs(p - v) < 0.012)
      if (near !== undefined) return near
      return dir > 0 ? (stops.find((p) => p > v) ?? 1) : ([...stops].reverse().find((p) => p < v) ?? 0)
    }

    let active = -1
    const markActive = () => {
      const now = Math.round(S.c)
      if (now === active) return
      active = now
      dots.forEach((d, i) => d.toggleAttribute('aria-current', i === now))
      root.dataset.chapter = String(now)
    }

    const st = ScrollTrigger.create({
      trigger: film,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: reduced ? true : 0.9,
      snap: {
        snapTo,
        duration: reduced ? 0 : { min: 0.35, max: 0.9 },
        delay: 0.12,
        ease: 'power2.inOut',
      },
      onUpdate: (self) => { dir = self.direction; markActive() },
    })
    stRef.current = st
    markActive()

    // Refresh measurements once fonts settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    // ---- the 3D scene, loaded after first paint ----
    const intro = { v: reduced ? 1 : 0 }
    let scene: import('@/lib/sprig-scene').SprigScene | null = null
    let dead = false
    let visible = true
    let raf = 0
    let time = reduced ? 14 : 0
    let last = performance.now()
    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting }, { threshold: 0 })
    io.observe(view)
    const labels = {
      note: root.querySelector<HTMLElement>('.sk-lab-note'),
      ghost: root.querySelector<HTMLElement>('.sk-lab-ghost'),
    }
    const loop = (now: number) => {
      if (dead) return
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      if (!scene || !visible || document.hidden) return
      if (!reduced) time += dt
      scene.frame(S, time, intro.v, document.documentElement.dataset.theme === 'dark', dt)
    }
    raf = requestAnimationFrame(loop)

    const fail = () => {
      scene?.dispose()
      scene = null
      setNoGL(true)
    }
    import('@/lib/sprig-scene')
      .then(({ SprigScene }) => {
        if (dead) return
        try {
          scene = new SprigScene(view, canvas, labels)
          scene.onContextLost(fail)
          root.dataset.scene = 'ready'
          if (!reduced) gsap.to(intro, { v: 1, duration: 2.6, ease: 'power3.out', delay: 0.15 })
        } catch (err) {
          console.warn('Skynift scene failed', err)
          fail()
        }
      })
      .catch(fail)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      io.disconnect()
      st.kill()
      tl.kill()
      gsap.killTweensOf(intro)
      scene?.dispose()
      stRef.current = null
    }
  }, [])

  return (
    <div className="sk" ref={rootRef}>
      <a className="skip-link" href="#about">Skip to content</a>

      <header className="sk-header">
        <div className="sk-header-in">
          <a href="#top" onClick={goTo(0)} aria-label="Skynift, back to top" className="sk-brand">
            <Wordmark height={36} />
          </a>
          <nav className="sk-nav" aria-label="Main">
            <a href="#about" onClick={goTo(1)}>About</a>
            <a href="#how" onClick={goTo(2)}>How we build</a>
            <a href="#drac" onClick={goTo(3)}>Drac</a>
          </nav>
          <div className="sk-tools">
            <button type="button" className="sk-theme" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
              <svg className="i-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
              <svg className="i-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></svg>
            </button>
            <a href="#hello" onClick={goTo(5)} className="sk-hello">Say hello</a>
          </div>
        </div>
      </header>

      <main id="top" className="sk-film" ref={filmRef}>
        <div className="sk-view">
          <canvas className="sk-canvas" aria-hidden="true" />

          <div className="sk-lab sk-lab-note" aria-hidden="true">
            <p>Moved 4% to Meta. Its clicks came in $0.06 under Google Search for three days.</p>
            <span>Illustrative</span>
          </div>
          <span className="sk-lab sk-lab-ghost" aria-hidden="true">Not planted yet</span>

          <nav className="sk-dots" aria-label="Chapters">
            {CHAPTERS.map((name, i) => (
              <button key={name} type="button" onClick={(e) => goTo(i)(e)} aria-label={name}>
                <span className="sk-dot" aria-hidden="true" />
                <span className="sk-dot-label" aria-hidden="true">{name}</span>
              </button>
            ))}
          </nav>

          <div className={`sk-fallback${noGL ? ' on' : ''}`} aria-hidden="true">
            <img src="/brand/sprig-light.svg" alt="" className="on-light" />
            <img src="/brand/sprig-dark.svg" alt="" className="on-dark" />
          </div>

          <section className="sk-layer sk-hero" data-ch="0" aria-labelledby="h-hero">
            <div>
              <h1 id="h-hero" tabIndex={-1} className="t-hero">Intelligence that grows with you.</h1>
            </div>
            <div>
              <p className="t-lead">Skynift builds AI that takes a real job off a business&rsquo;s hands, and stays easy to understand while it does it.</p>
              <div className="actions">
                <a href="#drac" onClick={goTo(3)} className="btn btn-ink">Meet Drac</a>
                <a href="#hello" onClick={goTo(5)} className="link-quiet">Say hello</a>
              </div>
              <p className="t-note">The i in our name is a sprig. Scroll, and it grows.</p>
              <img src="/brand/sprig-light.svg" alt="" className="sk-static-sprig on-light" width={72} height={118} />
            </div>
          </section>

          <section id="about" className="sk-layer l" data-ch="1" aria-labelledby="h-about">
            <div>
              <h2 id="h-about" tabIndex={-1} className="t-h2">We start with one job</h2>
              <p className="t-body">Not a platform for everything. We pick one job a business does every week, the kind that eats hours and needs care, and build AI that does it well.</p>
              <p className="t-body sk-x">We&rsquo;re a small team. We&rsquo;d rather do one thing properly than ten things loudly.</p>
              <p className="t-note">Stem first. Leaves later.</p>
            </div>
          </section>

          <section id="how" className="sk-layer r" data-ch="2" aria-labelledby="h-how">
            <div>
              <h2 id="h-how" tabIndex={-1} className="t-h2">Then we make it show its work</h2>
              <p className="t-body">Every decision comes with a reason you can read. If you can&rsquo;t see why it did something, you shouldn&rsquo;t have to trust it with your business.</p>
              <ul className="dots">
                <li>A plain reason for every move</li>
                <li className="rose">You approve before anything goes live</li>
                <li>One switch turns it off</li>
              </ul>
              <p className="t-note sk-x">The first leaves open. Each one has a reason.</p>
            </div>
          </section>

          <section id="drac" className="sk-layer l" data-ch="3" aria-labelledby="h-drac">
            <div style={{ gap: 16 }}>
              <div className="drac-id">
                <img src="/brand/drac-mark.svg" alt="" className="mark" width={50} height={38} />
                <span className="name">Drac</span>
                <span className="by-wm">
                  <span className="by">by</span>
                  <Wordmark height={30} className="wm" />
                </span>
              </div>
              <h2 id="h-drac" tabIndex={-1} className="t-h2">Drac is the first thing we&rsquo;ve grown</h2>
              <p className="t-body sk-x">Drac makes, launches and balances your Google and Meta ads in one place, with AI that shows its work.</p>
              <ul className="ledger">
                <li>A brand kit from your URL</li>
                <li>AI copy, images, audiences and keywords</li>
                <li>Every budget move, explained</li>
              </ul>
              <p className="t-small">From $99 a month, a flat fee by ad spend. Drac never takes a cut. Free 14-day trial, no card needed.</p>
              <div className="actions">
                <a href="https://drac.ai" className="btn btn-drac">Request access</a>
                <a href="https://drac.ai" className="link-quiet">Visit drac.ai</a>
              </div>
            </div>
          </section>

          <section id="next" className="sk-layer r" data-ch="4" aria-labelledby="h-next">
            <div>
              <h2 id="h-next" tabIndex={-1} className="t-h2">More will grow, one at a time</h2>
              <p className="t-body">We&rsquo;ll plant the next product only when Drac is doing its job well. The outlines on the stem are room to grow, not promises.</p>
              <p className="t-body sk-x">When something new is in season, you&rsquo;ll see it here first.</p>
            </div>
          </section>

          <section id="hello" className="sk-layer l" data-ch="5" aria-labelledby="h-hello">
            <div>
              <h2 id="h-hello" tabIndex={-1} className="t-h2">Come say hello</h2>
              <p className="t-body">Running ads with Drac, thinking about working with us, or just curious. We read every note.</p>
              <a href="mailto:contact@skynift.com" className="mail-big">contact@skynift.com</a>
              <p className="t-body" style={{ fontSize: 16 }}>Looking for Drac? <a href="https://drac.ai">Request access at drac.ai</a>.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="sk-footer">
        <div className="sk-footer-top">
          <div className="sk-footer-brand">
            <Wordmark height={44} />
            <p>Intelligence that grows with you.</p>
          </div>
          <nav aria-label="Footer">
            <a href="https://drac.ai">Drac</a>
            <a href="mailto:contact@skynift.com">contact@skynift.com</a>
          </nav>
        </div>
        <div className="sk-footer-legal">
          <p>&copy; 2026 Skynift Private Limited. Drac is a product of Skynift.</p>
          <p>Google and Meta are trademarks of their respective owners.</p>
        </div>
      </footer>
    </div>
  )
}
