interface FlowPanelProps {
  step: number
  title: string
  description: string
  compact?: boolean
}

export default function FlowPanel({ step, title, description, compact }: FlowPanelProps) {
  return (
    <div className={`w-full flex-shrink-0 flex flex-col items-center justify-center px-6 sm:px-8 ${compact ? 'py-10' : 'sm:w-screen h-screen'}`}>
      <span className="font-sans text-xs sm:text-sm tracking-widest uppercase text-drac-amber/50 mb-3 sm:mb-4">
        Step {step}
      </span>
      <h3 className="font-serif text-[clamp(1.75rem,5vw,4.5rem)] text-walnut text-center leading-tight mb-3 sm:mb-4">
        {title}
      </h3>
      <p className="font-sans text-base sm:text-lg text-walnut/60 text-center max-w-md">
        {description}
      </p>
    </div>
  )
}
