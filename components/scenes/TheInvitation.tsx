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

      <a href="mailto:contact@skynift.com" className="font-sans text-sm text-walnut/30 hover:text-walnut/50 transition-colors">
        contact@skynift.com
      </a>

      {/* Company footer — credibility signals */}
      <div className="mt-20 pt-12 border-t border-walnut/5 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Company identity */}
          <div className="text-center md:text-left">
            <span className="font-serif text-xl text-walnut/40 block">Skynift</span>
            <span className="font-sans text-xs text-walnut/20 block mt-1">Skynift Private Limited</span>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="font-sans text-xs text-walnut/25 flex items-center gap-1.5">
              <span className="text-sage">●</span> SOC 2 Infrastructure
            </span>
            <span className="font-sans text-xs text-walnut/25 flex items-center gap-1.5">
              <span className="text-sage">●</span> AES-256 Encryption
            </span>
            <span className="font-sans text-xs text-walnut/25 flex items-center gap-1.5">
              <span className="text-sage">●</span> 99.9% Uptime
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a href="https://drac.ai" target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-walnut/25 hover:text-walnut/50 transition-colors">
              Drac AI
            </a>
            <a href="https://helpexa.com" target="_blank" rel="noopener noreferrer" className="font-sans text-xs text-walnut/25 hover:text-walnut/50 transition-colors">
              Helpexa
            </a>
            <a href="mailto:contact@skynift.com" className="font-sans text-xs text-walnut/25 hover:text-walnut/50 transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Legal line */}
        <p className="text-center font-sans text-[11px] text-walnut/15 mt-8 pb-8">
          &copy; {new Date().getFullYear()} Skynift Private Limited. All rights reserved.
        </p>
      </div>
    </section>
  )
}
