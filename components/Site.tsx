'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger, Observer, ScrollToPlugin } from 'gsap/all'
import { SPRIG_POSES, SPRIG_START, type SprigState } from '@/lib/sprig-poses'
import Wordmark, { growWordmark } from '@/components/Wordmark'

const THEME_KEY = 'skynift-theme'
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

export default function Site() {
  const rootRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<HTMLElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const travelRef = useRef<((k: number) => void) | null>(null)
  const logoRef = useRef<SVGSVGElement>(null)
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

  // Jump to a chapter from the nav: glide there, then move focus to its heading
  const goTo = useCallback((i: number) => (e: React.MouseEvent) => {
    if (!travelRef.current) return
    e.preventDefault()
    travelRef.current(i)
    const h = rootRef.current?.querySelector<HTMLElement>(`[data-ch="${i}"] h2, [data-ch="${i}"] h1`)
    if (h) setTimeout(() => h.focus({ preventScroll: true }), reducedRef.current ? 0 : 1200)
    const hash = (e.currentTarget as HTMLAnchorElement).hash || (i === 0 ? '#top' : '')
    if (hash) history.replaceState(null, '', hash)
  }, [])

  // The film: one master timeline drives the plant, the words and the chapter dots
  useEffect(() => {
    const root = rootRef.current
    const film = filmRef.current
    if (!root || !film) return
    gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin)
    const view = root.querySelector<HTMLElement>('.sk-view')!
    const canvas = root.querySelector<HTMLCanvasElement>('.sk-canvas')!
    const dots = Array.from(root.querySelectorAll<HTMLElement>('.sk-dots button'))
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    reducedRef.current = reduced

    const S: SprigState = { ...SPRIG_START }
    const layers = Array.from(root.querySelectorAll<HTMLElement>('.sk-layer'))
    const kidsOf = (layer: HTMLElement) => layer.querySelectorAll(':scope > div > *')

    // The plant follows the scroll continuously (scrubbed)
    const tl = gsap.timeline({ paused: true })
    for (let k = 0; k < LAST; k++) {
      const s = 2 * k + 1
      tl.to(S, { ...SPRIG_POSES[k], duration: 1, ease: 'power1.inOut' }, s)
      tl.to(S, { c: k + 1, duration: 1, ease: 'none' }, s)
    }
    tl.set({}, {}, TL_END)
    for (let k = 0; k <= LAST; k++) tl.addLabel(`c${k}`, labelAt(k))

    // The words change as a short, timed scene change, never scrubbed: one chapter at a time.
    // They switch halfway through each change, with a little dead zone so a wobble can't flip them back.
    gsap.set(layers.slice(1), { autoAlpha: 0 })
    let shown = 0
    let words: gsap.core.Timeline | null = null
    const showChapter = (k: number) => {
      if (k === shown) return
      const from = layers[shown], to = layers[k], down = k > shown
      shown = k
      words?.progress(1).kill()
      if (reduced) {
        gsap.set(from, { autoAlpha: 0 }); gsap.set(to, { autoAlpha: 1 }); gsap.set(kidsOf(to), { y: 0, autoAlpha: 1 })
        return
      }
      words = gsap.timeline()
        .to(kidsOf(from), { y: down ? -24 : 24, autoAlpha: 0, duration: 0.26, stagger: 0.02, ease: 'power2.in' })
        .set(from, { autoAlpha: 0 })
        .set(to, { autoAlpha: 1 })
        .fromTo(kidsOf(to), { y: down ? 30 : -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '+=0.04')
    }
    const DEAD = 0.12
    const chapterAt = (t: number) => {
      let k = shown
      while (k < LAST && t > 2 * k + 1.5 + DEAD) k++
      while (k > 0 && t < 2 * (k - 1) + 1.5 - DEAD) k--
      return k
    }

    // ---- moving between chapters ----
    // Inside the story every gesture (wheel, trackpad, swipe, key) is one step to the next or
    // previous chapter. Input is ignored while we glide and until a trackpad's momentum dies
    // down, so one flick is always one chapter. Below the story the page scrolls normally.
    let rest = 0                // the chapter we are resting on
    let gliding = false
    let target = -1             // chapter we are gliding to (its words show straight away)
    let lastInput = 0
    // One gesture = one step. A new gesture starts after a pause, or when the push suddenly
    // gets stronger; a flick's decaying momentum tail always belongs to the same gesture.
    let gesture = 0, used = -1, lastMag = 0
    const onWheel = (e: WheelEvent) => {
      const now = performance.now(), mag = Math.abs(e.deltaY)
      if (now - lastInput > 220 || (mag > lastMag * 1.8 && mag > 14)) gesture++
      lastInput = now
      lastMag = mag
    }
    const onTouchStart = () => { gesture++; lastInput = performance.now() }
    window.addEventListener('wheel', onWheel, { passive: true, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    const yOf = (k: number) => Math.round(st.labelToScroll(`c${k}`))
    const filmEnd = () => st.end
    const travel = (k: number, after?: () => void) => {
      k = Math.max(0, Math.min(LAST, k))
      gliding = true
      target = k
      showChapter(k)
      const dist = Math.abs(yOf(k) - window.scrollY)
      gsap.to(window, {
        scrollTo: { y: yOf(k), autoKill: false },
        duration: reduced ? 0 : Math.min(1.6, 0.85 + dist / 4000),
        ease: 'power2.inOut',
        overwrite: true,
        onComplete: () => {
          rest = k
          target = -1
          after?.()
          gliding = false
        },
      })
    }
    travelRef.current = (k) => travel(k)
    const leaveToFooter = () => {
      gliding = true
      gsap.to(window, {
        scrollTo: { y: Math.min(document.documentElement.scrollHeight - window.innerHeight, filmEnd() + window.innerHeight * 0.75), autoKill: false },
        duration: reduced ? 0 : 0.9, ease: 'power2.inOut', overwrite: true,
        onComplete: () => { gliding = false },
      })
    }
    const inStory = () => window.scrollY <= filmEnd() + 2
    const step = (dir: number, fresh = false) => {
      if (fresh) gesture++
      if (gliding || !inStory() || used === gesture) return
      used = gesture
      if (dir > 0 && rest === LAST) return leaveToFooter()
      if (dir < 0 && rest === 0) return
      travel(rest + dir)
    }
    const obs = Observer.create({
      target: window,
      type: 'wheel,touch',
      wheelSpeed: 1,
      tolerance: 12,
      preventDefault: true,
      onChange: (self) => {
        const e = self.event as Event
        const dy = e.type === 'wheel' ? self.deltaY : -self.deltaY
        if (dy) step(Math.sign(dy))
      },
    })
    // Below the story the page scrolls normally; coming back up rejoins the last chapter
    const onScroll = () => {
      if (inStory()) { if (!obs.isEnabled) obs.enable() }
      else if (obs.isEnabled) obs.disable()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const onKey = (e: KeyboardEvent) => {
      if (!inStory() || e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      const map: Record<string, number> = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }
      if (e.key === 'Home') { e.preventDefault(); return travel(0) }
      if (e.key === 'End') { e.preventDefault(); return travel(LAST) }
      if (map[e.key]) { e.preventDefault(); step(map[e.key], true) }
    }
    window.addEventListener('keydown', onKey)

    // The i in the header grows with the page: a sprout at the top, in bud by Drac
    const sprout = { k: reduced ? 1 : 0 }
    const growLogo = () => growWordmark(logoRef.current, S.c, sprout.k)
    if (!reduced) gsap.to(sprout, { k: 1, duration: 1.8, delay: 0.5, ease: 'power3.out', onUpdate: growLogo })
    growLogo()

    let active = -1
    const onFrame = () => {
      // while gliding to a chapter, go straight to its words
      showChapter(target >= 0 ? target : chapterAt(tl.time()))
      growLogo()
      if (shown === active) return
      active = shown
      dots.forEach((d, i) => d.toggleAttribute('aria-current', i === shown))
      root.dataset.chapter = String(shown)
    }

    const st = ScrollTrigger.create({
      trigger: film,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: reduced ? true : 0.6,
    })
    tl.eventCallback('onUpdate', onFrame)
    stRef.current = st
    // Dragging the scrollbar (or loading mid-way) settles on the nearest chapter
    const nearest = () => {
      let best = 0
      for (let k = 1; k <= LAST; k++) if (Math.abs(yOf(k) - window.scrollY) < Math.abs(yOf(best) - window.scrollY)) best = k
      return best
    }
    const onScrollEnd = () => {
      if (gliding || !inStory()) return
      const k = nearest()
      if (Math.abs(yOf(k) - window.scrollY) > 2) travel(k)
      else rest = k
    }
    ScrollTrigger.addEventListener('scrollEnd', onScrollEnd)
    rest = nearest()
    onFrame()

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
      ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel, { capture: true })
      window.removeEventListener('touchstart', onTouchStart, { capture: true })
      obs.kill()
      gsap.killTweensOf(window)
      travelRef.current = null
      st.kill()
      tl.kill()
      words?.kill()
      gsap.killTweensOf(intro)
      gsap.killTweensOf(sprout)
      tl.eventCallback('onUpdate', null)
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
            <Wordmark height={44} growth={0} svgRef={logoRef} />
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
              {/* <p className="t-note">The i in our name is a sprig. Scroll, and watch it grow.</p> */}
              <img src="/brand/sprig-light.svg" alt="" className="sk-static-sprig on-light" width={72} height={118} />
            </div>
          </section>

          <section id="about" className="sk-layer l" data-ch="1" aria-labelledby="h-about">
            <div>
              <h2 id="h-about" tabIndex={-1} className="t-h2">We start with one job</h2>
              <p className="t-body">Not a platform for everything. We pick one job a business does every week, the kind that eats hours and needs care, and build AI that does it well.</p>
              <p className="t-body sk-x">We&rsquo;re a small team. We&rsquo;d rather do one thing properly than ten things loudly.</p>
              {/* <p className="t-note">Stem first. Leaves later.</p> */}
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
              <p className="t-body sk-short-hide" style={{ fontSize: 16 }}>Looking for Drac? <a href="https://drac.ai">Request access at drac.ai</a>.</p>
              <p className="t-careers">We&rsquo;re always on the lookout for exceptional people. If you&rsquo;d rather face the ocean than stay on the shore, send your resume to <a href="mailto:careers@skynift.com">careers@skynift.com</a>.</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="sk-footer">
        <div className="sk-footer-top">
          <div className="sk-footer-brand">
            <Wordmark height={48} />
            <p>Intelligence that grows with you.</p>
          </div>
        </div>
        <div className="sk-footer-legal">
          <p>&copy; 2026 Skynift Private Limited.</p>
        </div>
      </footer>
    </div>
  )
}
