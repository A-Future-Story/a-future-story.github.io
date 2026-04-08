'use client'

import { useState, useEffect } from 'react'
import DarkModeToggle from '@/components/DarkModeToggle'
import CopyEmail from '@/components/CopyEmail'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50) }
    window.addEventListener('scroll', onScroll, { passive: true })

    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  // Universal pill: solid opaque background that works on ANY section
  // Light mode: warm ivory solid pill with dark text
  // Dark mode: dark charcoal solid pill with light text
  const pillBg = isDark ? '#2A2622' : '#F5F0E8'
  const pillBgHover = isDark ? '#3A3530' : '#EDE6DA'
  const pillText = isDark ? '#C8BCA8' : '#5C4A3A'
  const pillTextHover = isDark ? '#E8E0D4' : '#2C1810'
  const pillBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(44,24,16,0.08)'

  const pillStyle: React.CSSProperties = {
    background: pillBg,
    color: pillText,
    border: pillBorder,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.3s ease',
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#home"
          className="font-serif text-lg px-4 py-1.5 rounded-full font-medium"
          style={{ background: pillBg, color: isDark ? '#E8E0D4' : '#2C1810', border: pillBorder, transition: 'all 0.3s ease' }}
        >
          Skynift
        </a>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer"
            className="font-sans text-sm px-4 py-1.5 rounded-full" style={pillStyle}
            onMouseEnter={e => { e.currentTarget.style.background = pillBgHover; e.currentTarget.style.color = pillTextHover }}
            onMouseLeave={e => { e.currentTarget.style.background = pillBg; e.currentTarget.style.color = pillText }}
          >Drac AI</a>
          <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer"
            className="font-sans text-sm px-4 py-1.5 rounded-full" style={pillStyle}
            onMouseEnter={e => { e.currentTarget.style.background = pillBgHover; e.currentTarget.style.color = pillTextHover }}
            onMouseLeave={e => { e.currentTarget.style.background = pillBg; e.currentTarget.style.color = pillText }}
          >Helpexa</a>
          <CopyEmail className="font-sans text-sm px-4 py-1.5 rounded-full" style={pillStyle}>
            Contact
          </CopyEmail>
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer"
            className="font-sans text-sm px-5 py-1.5 rounded-full font-medium"
            style={{ background: isDark ? 'rgba(201,150,58,0.25)' : 'rgba(201,150,58,0.15)', color: '#C9963A', border: '1px solid rgba(201,150,58,0.2)', transition: 'all 0.3s ease' }}
          >Get Started</a>
          <div className="ml-1 rounded-full" style={{ background: pillBg, border: pillBorder, color: pillText, transition: 'all 0.3s ease' }}>
            <DarkModeToggle />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden items-center gap-1.5">
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] px-2.5 py-1 rounded-full" style={pillStyle}
          >Drac</a>
          <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] px-2.5 py-1 rounded-full" style={pillStyle}
          >Helpexa</a>
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] px-3 py-1 rounded-full font-medium"
            style={{ background: isDark ? 'rgba(201,150,58,0.25)' : 'rgba(201,150,58,0.15)', color: '#C9963A', border: '1px solid rgba(201,150,58,0.2)' }}
          >Start</a>
          <div className="rounded-full" style={{ background: pillBg, border: pillBorder, color: pillText }}>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
