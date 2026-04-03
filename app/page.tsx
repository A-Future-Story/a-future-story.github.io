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

export default function Home() {
  return (
    <main>
      <TheSeed />
      <TheDeepening />
      <DracArrives />
      <MarkitectReveal />
      <MarkitectFlow />
      <MarkitectImpact />
      <VineDecoration direction="right" color="rgba(139, 157, 119, 0.15)" className="bg-cream" />
      <SuperBotScene />
      <VineDecoration direction="left" color="rgba(196, 112, 110, 0.15)" className="bg-ivory" />
      <HelpexaPetal />
      <VineDecoration direction="center" color="rgba(139, 157, 119, 0.12)" className="bg-ivory" />
      <GardenView />
      <TheInvitation />
    </main>
  )
}
