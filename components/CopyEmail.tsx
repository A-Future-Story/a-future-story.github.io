'use client'

import { useState } from 'react'

interface CopyEmailProps {
  email?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function CopyEmail({ email = 'contact@skynift.com', children, className = '', style }: CopyEmailProps) {
  const [copied, setCopied] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <>
      <a href={`mailto:${email}`} onClick={handleClick} className={className} style={style}>
        {children}
      </a>
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full font-sans text-sm shadow-lg animate-[fadeInUp_0.3s_ease] bg-walnut text-ivory">
          Email copied to clipboard
        </div>
      )}
    </>
  )
}
