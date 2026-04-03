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
