import TheSeed from '@/components/scenes/TheSeed'
import CompanyIntro from '@/components/scenes/CompanyIntro'
import TheDeepening from '@/components/scenes/TheDeepening'
import DracArrives from '@/components/scenes/DracArrives'
import MarkitectReveal from '@/components/scenes/MarkitectReveal'
import MarkitectFlow from '@/components/scenes/MarkitectFlow'
import MarkitectImpact from '@/components/scenes/MarkitectImpact'

import HelpexaPetal from '@/components/scenes/HelpexaPetal'
import GardenView from '@/components/scenes/GardenView'
import TheInvitation from '@/components/scenes/TheInvitation'
import VineDecoration from '@/components/VineDecoration'
import ScrollFlower from '@/components/ScrollFlower'

export default function Home() {
  return (
    <main>
      <TheSeed />

      {/* Vine after hero */}
      <div className="bg-ivory relative">
        <VineDecoration variant="wide" color="rgba(139, 157, 119, 0.2)" />
        <div className="flex justify-between px-4 sm:px-12 -mt-4">
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={45} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.15)" size={35} side="right" />
        </div>
      </div>

      <CompanyIntro />

      {/* Vine before deepening */}
      <div className="bg-ivory relative">
        <VineDecoration variant="sprawl" color="rgba(196, 112, 110, 0.15)" />
        <div className="flex justify-center gap-8 sm:gap-16 -mt-4">
          <ScrollFlower color="rgba(212, 168, 67, 0.18)" size={40} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.18)" size={50} side="right" />
        </div>
      </div>

      <TheDeepening />

      {/* Vine deepening into Drac */}
      <div className="bg-[#1C1915] relative">
        <VineDecoration variant="wide" color="rgba(201, 150, 58, 0.12)" />
        <div className="flex justify-between px-4 sm:px-10 -mt-4">
          <ScrollFlower color="rgba(201, 150, 58, 0.12)" size={38} side="left" />
          <ScrollFlower color="rgba(212, 168, 67, 0.1)" size={30} side="right" />
        </div>
      </div>

      <DracArrives />

      {/* Vine after Drac into Markitect reveal */}
      <div className="bg-[#1C1915] relative">
        <VineDecoration variant="tall" color="rgba(201, 150, 58, 0.15)" />
        <div className="flex justify-between px-4 sm:px-10 -mt-4">
          <ScrollFlower color="rgba(201, 150, 58, 0.15)" size={45} side="left" />
          <ScrollFlower color="rgba(201, 150, 58, 0.12)" size={35} side="right" />
        </div>
      </div>

      <MarkitectReveal />

      {/* Vine into flow */}
      <div className="bg-cream relative">
        <VineDecoration variant="wide" color="rgba(201, 150, 58, 0.2)" />
        <div className="flex justify-between px-4 sm:px-8 -mt-4">
          <ScrollFlower color="rgba(212, 168, 67, 0.2)" size={50} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={40} side="right" />
        </div>
      </div>

      <MarkitectFlow />

      {/* Double vine after flow into features — rich transition */}
      <div className="bg-cream relative">
        <VineDecoration variant="tall" color="rgba(139, 157, 119, 0.2)" />
        <div className="flex justify-between px-4 sm:px-8 -mt-4">
          <ScrollFlower color="rgba(139, 157, 119, 0.22)" size={50} side="left" />
          <ScrollFlower color="rgba(201, 150, 58, 0.15)" size={35} side="left" className="hidden sm:block ml-12" />
          <ScrollFlower color="rgba(212, 168, 67, 0.2)" size={42} side="right" />
        </div>
      </div>
      <div className="bg-cream relative">
        <VineDecoration variant="sprawl" color="rgba(201, 150, 58, 0.15)" />
        <div className="flex justify-between px-4 sm:px-12 -mt-4">
          <ScrollFlower color="rgba(196, 112, 110, 0.15)" size={38} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.18)" size={45} side="right" />
          <ScrollFlower color="rgba(212, 168, 67, 0.12)" size={30} side="right" className="hidden sm:block mr-16" />
        </div>
      </div>

      <MarkitectImpact />

      {/* Rich vine transition into Helpexa */}
      <div className="bg-ivory relative">
        <VineDecoration variant="sprawl" color="rgba(196, 112, 110, 0.18)" />
        <div className="flex justify-between px-4 sm:px-10 -mt-4">
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={45} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.15)" size={35} side="right" />
        </div>
      </div>
      <div className="bg-ivory relative">
        <VineDecoration variant="tall" color="rgba(139, 157, 119, 0.2)" />
        <div className="flex justify-between px-4 sm:px-12 -mt-6">
          <ScrollFlower color="rgba(196, 112, 110, 0.22)" size={55} side="left" />
          <ScrollFlower color="rgba(212, 168, 67, 0.15)" size={40} side="left" className="hidden sm:block ml-16" />
          <ScrollFlower color="rgba(139, 157, 119, 0.18)" size={35} side="right" className="hidden sm:block mr-20" />
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={48} side="right" />
        </div>
      </div>

      <HelpexaPetal />

      {/* Double vine into Garden — lush transition */}
      <div className="bg-ivory relative">
        <VineDecoration variant="wide" color="rgba(139, 157, 119, 0.2)" />
        <div className="flex justify-between px-4 sm:px-8 -mt-4">
          <ScrollFlower color="rgba(139, 157, 119, 0.22)" size={50} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.18)" size={40} side="right" />
        </div>
      </div>
      <div className="bg-ivory relative">
        <VineDecoration variant="tall" color="rgba(196, 112, 110, 0.15)" />
        <div className="flex justify-between px-4 sm:px-12 -mt-6">
          <ScrollFlower color="rgba(212, 168, 67, 0.18)" size={45} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={55} side="left" className="hidden sm:block ml-16" />
          <ScrollFlower color="rgba(196, 112, 110, 0.2)" size={48} side="right" />
          <ScrollFlower color="rgba(139, 157, 119, 0.15)" size={35} side="right" className="hidden sm:block mr-12" />
        </div>
      </div>

      <GardenView />

      {/* Lush vine into invitation */}
      <div className="bg-ivory relative">
        <VineDecoration variant="tall" color="rgba(139, 157, 119, 0.18)" />
        <div className="flex justify-between px-4 sm:px-10 -mt-4">
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={45} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.15)" size={38} side="right" />
        </div>
      </div>
      <div className="bg-ivory relative">
        <VineDecoration variant="sprawl" color="rgba(196, 112, 110, 0.15)" />
        <div className="flex justify-center gap-4 sm:gap-10 -mt-4">
          <ScrollFlower color="rgba(212, 168, 67, 0.18)" size={42} side="left" />
          <ScrollFlower color="rgba(139, 157, 119, 0.2)" size={55} side="left" />
          <ScrollFlower color="rgba(196, 112, 110, 0.15)" size={38} side="right" />
          <ScrollFlower color="rgba(212, 168, 67, 0.12)" size={30} side="right" />
        </div>
      </div>

      <TheInvitation />
    </main>
  )
}
