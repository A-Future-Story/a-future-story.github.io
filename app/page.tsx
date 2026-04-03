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
import VineDecoration from '@/components/VineDecoration'
import ScrollFlower from '@/components/ScrollFlower'

export default function Home() {
  return (
    <main>
      <TheSeed />
      {/* Company intro — bridges hero to the deepening */}
      <section className="bg-ivory py-16 px-6 text-center">
        <p className="font-sans text-sm tracking-widest uppercase text-walnut/30 mb-6">Skynift Private Limited</p>
        <h2 className="font-serif text-[clamp(1.5rem,3.5vw,3rem)] text-walnut/70 max-w-3xl mx-auto leading-relaxed mb-6">
          We build AI products that transform how businesses serve customers and reach audiences.
        </h2>
        <div className="flex flex-wrap justify-center gap-8 text-walnut/30 font-sans text-sm">
          <span>Customer Service AI</span>
          <span className="text-walnut/10">|</span>
          <span>Ad Campaign Automation</span>
          <span className="text-walnut/10">|</span>
          <span>Business Intelligence</span>
        </div>
      </section>
      <TheDeepening />
      <DracArrives />
      <MarkitectReveal />
      {/* Vine + flowers transition into Markitect flow */}
      <div className="bg-cream relative">
        <VineDecoration variant="wide" color="rgba(201, 150, 58, 0.2)" />
        <div className="flex justify-between px-8 -mt-4">
          <ScrollFlower color="rgba(212, 168, 67, 0.2)" size={50} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={40} side="right" />
        </div>
      </div>
      <MarkitectFlow />
      <MarkitectImpact />
      {/* Rich vine + flowers transition into SuperBot */}
      <div className="bg-cream relative">
        <VineDecoration variant="tall" color="rgba(139, 157, 119, 0.25)" />
        <div className="flex justify-between px-12 -mt-6">
          <ScrollFlower color="rgba(139, 157, 119, 0.25)" size={55} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.18)" size={35} side="left" className="ml-20" />
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={45} side="right" />
        </div>
      </div>
      <SuperBotScene />
      {/* Vine + flowers into Helpexa */}
      <div className="bg-ivory relative">
        <VineDecoration variant="sprawl" color="rgba(196, 112, 110, 0.2)" />
        <div className="flex justify-between px-16 -mt-4">
          <ScrollFlower color="rgba(196, 112, 110, 0.22)" size={50} side="left" />
          <ScrollFlower color="rgba(212, 168, 67, 0.18)" size={38} side="right" />
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={45} side="right" />
        </div>
      </div>
      <HelpexaPetal />
      {/* Vine + flowers into Garden */}
      <div className="bg-ivory relative">
        <VineDecoration variant="tall" color="rgba(139, 157, 119, 0.2)" />
        <div className="flex justify-between px-10 -mt-4">
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={48} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.15)" size={55} side="right" />
        </div>
      </div>
      <GardenView />
      {/* Final vine into invitation */}
      <div className="bg-ivory relative">
        <VineDecoration variant="sprawl" color="rgba(196, 112, 110, 0.15)" />
        <div className="flex justify-center gap-12 -mt-4">
          <ScrollFlower color="rgba(212, 168, 67, 0.15)" size={40} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.15)" size={50} side="right" />
          <ScrollFlower color="rgba(196, 112, 110, 0.12)" size={35} side="right" />
        </div>
      </div>
      <TheInvitation />
    </main>
  )
}
