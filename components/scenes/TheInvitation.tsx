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
