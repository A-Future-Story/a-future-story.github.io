'use client'

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/80 backdrop-blur-md border-b border-walnut/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="font-serif text-lg text-walnut/70 hover:text-walnut transition-colors">
          Skynift
        </a>

        <div className="hidden sm:flex items-center gap-6">
          <a href="https://drac.ai" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-walnut/40 hover:text-walnut/70 transition-colors">
            Drac AI
          </a>
          <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-walnut/40 hover:text-walnut/70 transition-colors">
            Helpexa
          </a>
          <a href="mailto:contact@skynift.com" className="font-sans text-sm text-walnut/40 hover:text-walnut/70 transition-colors">
            Contact
          </a>
          <a
            href="https://drac.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm px-4 py-1.5 rounded-full bg-drac-gold/10 text-drac-gold hover:bg-drac-gold/20 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}
