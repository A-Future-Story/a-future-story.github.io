export interface HelpexaPetal {
  cx: number
  cy: number
  size: number
  rotation: number
  color: string
  maxScale: number
  // Organic shape control
  curve: number      // petal curvature
  elongation: number // how stretched the petal is
  layer: number      // 0 = inner, 1 = mid, 2 = outer
  wobblePhase: number
}

const COLORS_LIGHT = [
  'rgba(196, 112, 110, 0.45)',  // rose
  'rgba(196, 112, 110, 0.35)',  // rose light
  'rgba(139, 157, 119, 0.35)',  // sage
  'rgba(212, 168, 67, 0.25)',   // gold accent
  'rgba(196, 130, 128, 0.3)',   // soft pink
  'rgba(160, 180, 140, 0.3)',   // light sage
]

const COLORS_DARK = [
  'rgba(196, 112, 110, 0.55)',
  'rgba(196, 112, 110, 0.45)',
  'rgba(139, 157, 119, 0.45)',
  'rgba(212, 168, 67, 0.35)',
  'rgba(196, 130, 128, 0.4)',
  'rgba(160, 180, 140, 0.4)',
]

export function createHelpexaPetals(cx: number, cy: number): HelpexaPetal[] {
  const petals: HelpexaPetal[] = []

  // Inner ring — tight, small petals
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3
    const dist = 20 + Math.random() * 30
    petals.push({
      cx: cx + Math.cos(angle) * dist,
      cy: cy + Math.sin(angle) * dist,
      size: 30 + Math.random() * 25,
      rotation: angle + Math.PI * 0.5,
      color: COLORS_LIGHT[i % COLORS_LIGHT.length],
      maxScale: 0.6 + Math.random() * 0.3,
      curve: 0.3 + Math.random() * 0.4,
      elongation: 1.5 + Math.random() * 0.8,
      layer: 0,
      wobblePhase: Math.random() * Math.PI * 2,
    })
  }

  // Middle ring — larger, more spread
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.2
    const dist = 60 + Math.random() * 50
    petals.push({
      cx: cx + Math.cos(angle) * dist,
      cy: cy + Math.sin(angle) * dist,
      size: 50 + Math.random() * 50,
      rotation: angle + Math.PI * 0.4,
      color: COLORS_LIGHT[(i + 2) % COLORS_LIGHT.length],
      maxScale: 0.7 + Math.random() * 0.4,
      curve: 0.4 + Math.random() * 0.3,
      elongation: 1.8 + Math.random() * 1.0,
      layer: 1,
      wobblePhase: Math.random() * Math.PI * 2,
    })
  }

  // Outer ring — big, dramatic, scattered
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.15
    const dist = 120 + Math.random() * 80
    petals.push({
      cx: cx + Math.cos(angle) * dist,
      cy: cy + Math.sin(angle) * dist,
      size: 70 + Math.random() * 80,
      rotation: angle + Math.PI * 0.3,
      color: COLORS_LIGHT[(i + 4) % COLORS_LIGHT.length],
      maxScale: 0.8 + Math.random() * 0.5,
      curve: 0.5 + Math.random() * 0.3,
      elongation: 2.0 + Math.random() * 1.2,
      layer: 2,
      wobblePhase: Math.random() * Math.PI * 2,
    })
  }

  return petals
}

function drawOrganicPetal(
  ctx: CanvasRenderingContext2D,
  size: number,
  curve: number,
  elongation: number,
) {
  const tipY = -size * elongation
  const cpX = size * curve
  const cpY = tipY * 0.4
  const baseW = size * 0.3

  ctx.beginPath()
  ctx.moveTo(0, 0)
  // Right side of petal
  ctx.bezierCurveTo(cpX, cpY, cpX * 0.8, tipY * 0.7, 0, tipY)
  // Left side of petal (mirror)
  ctx.bezierCurveTo(-cpX * 0.8, tipY * 0.7, -cpX, cpY, 0, 0)
  ctx.closePath()
}

// Floating particles that drift around
interface Particle {
  x: number
  y: number
  size: number
  speed: number
  angle: number
  opacity: number
  color: string
}

let particles: Particle[] = []
let particlesInitialized = false

function initParticles(cx: number, cy: number) {
  particles = []
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = 50 + Math.random() * 200
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 2 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      opacity: 0.15 + Math.random() * 0.3,
      color: COLORS_LIGHT[Math.floor(Math.random() * COLORS_LIGHT.length)],
    })
  }
  particlesInitialized = true
}

export function drawHelpexaBloom(
  ctx: CanvasRenderingContext2D,
  petals: HelpexaPetal[],
  progress: number,
  width: number,
  height: number,
  isDark: boolean = false,
) {
  ctx.clearRect(0, 0, width, height)

  // Background transition: ivory → soft rose-tinted → ivory
  const bgIn = Math.min(1, progress * 3)
  const bgOut = Math.max(0, (progress - 0.7) / 0.3)
  const bgTint = bgIn * (1 - bgOut)

  const baseR = isDark ? 15 : 250, baseG = isDark ? 13 : 247, baseB = isDark ? 19 : 242
  const tintR = isDark ? 30 : 245, tintG = isDark ? 20 : 230, tintB = isDark ? 25 : 230
  const endR = isDark ? 15 : 250, endG = isDark ? 13 : 247, endB = isDark ? 19 : 242
  const r = Math.round(baseR + bgTint * (tintR - baseR) + bgOut * (endR - tintR))
  const g = Math.round(baseG + bgTint * (tintG - baseG) + bgOut * (endG - tintG))
  const b = Math.round(baseB + bgTint * (tintB - baseB) + bgOut * (endB - tintB))
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  ctx.fillRect(0, 0, width, height)

  if (!particlesInitialized) initParticles(width / 2, height / 2)

  // Draw floating particles (visible during mid-bloom)
  const particleAlpha = Math.sin(Math.min(1, progress * 2) * Math.PI) * 0.8
  if (particleAlpha > 0.01) {
    for (const p of particles) {
      // Gentle drift
      p.x += Math.cos(p.angle) * p.speed
      p.y += Math.sin(p.angle) * p.speed
      p.angle += (Math.random() - 0.5) * 0.05

      ctx.save()
      ctx.globalAlpha = p.opacity * particleAlpha
      ctx.fillStyle = isDark
        ? p.color.replace(/[\d.]+\)$/, '0.6)')
        : p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // Draw petals layer by layer
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  if (isDark) ctx.globalCompositeOperation = 'lighter'

  for (const petal of petals) {
    // Stagger by layer: inner blooms first, outer last
    const layerDelay = petal.layer * 0.12
    const petalProgress = Math.max(0, Math.min(1, (progress - layerDelay) * 2.5))
    const scale = petalProgress * petal.maxScale
    if (scale <= 0.01) continue

    // Gentle wobble
    const wobble = Math.sin(progress * Math.PI * 3 + petal.wobblePhase) * 0.03 * petalProgress

    ctx.save()
    ctx.translate(petal.cx, petal.cy)
    ctx.rotate(petal.rotation + wobble + progress * 0.15)
    ctx.scale(scale, scale)

    // Radial gradient fill
    const gradient = ctx.createRadialGradient(0, -petal.size * 0.5, 0, 0, -petal.size * 0.5, petal.size)
    const petalColor = isDark
      ? petal.color.replace(/[\d.]+\)$/, `${parseFloat(petal.color.match(/[\d.]+\)$/)?.[0] || '0.3') * 1.3})`)
      : petal.color
    gradient.addColorStop(0, petalColor)
    gradient.addColorStop(0.7, petalColor.replace(/[\d.]+\)$/, '0.1)'))
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    drawOrganicPetal(ctx, petal.size, petal.curve, petal.elongation)
    ctx.fill()

    // Subtle vein line
    ctx.strokeStyle = isDark
      ? 'rgba(196, 112, 110, 0.12)'
      : 'rgba(196, 112, 110, 0.08)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -petal.size * petal.elongation * 0.8)
    ctx.stroke()

    ctx.restore()
  }
  ctx.restore()

  // Text reveal — "Helpexa"
  const textProgress = Math.max(0, (progress - 0.25) / 0.35)
  if (textProgress > 0) {
    ctx.save()
    ctx.globalAlpha = Math.min(1, textProgress)

    const textColor = isDark ? '#C4706E' : '#2C1810'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Main title — scale up slightly as it appears
    const titleScale = 0.9 + textProgress * 0.1
    ctx.save()
    ctx.translate(width / 2, height / 2 - 15)
    ctx.scale(titleScale, titleScale)
    ctx.font = `700 ${Math.min(width * 0.1, 100)}px "Cormorant Garamond", Georgia, serif`
    ctx.fillStyle = textColor
    ctx.fillText('Helpexa', 0, 0)
    ctx.restore()

    // Subtitle
    const subProgress = Math.max(0, (textProgress - 0.3) / 0.7)
    if (subProgress > 0) {
      ctx.globalAlpha = subProgress
      ctx.font = `400 ${Math.min(width * 0.022, 20)}px "DM Sans", system-ui, sans-serif`
      ctx.fillStyle = isDark
        ? 'rgba(232, 224, 212, 0.7)'
        : 'rgba(44, 24, 16, 0.6)'
      ctx.fillText('Your AI support team, ready in minutes.', width / 2, height / 2 + 30)
    }

    // Label above — playful
    const labelProgress = Math.max(0, (textProgress - 0.5) / 0.5)
    if (labelProgress > 0) {
      ctx.globalAlpha = labelProgress * 0.5
      ctx.font = `400 ${Math.min(width * 0.014, 13)}px "DM Sans", system-ui, sans-serif`
      ctx.fillStyle = isDark
        ? 'rgba(139, 157, 119, 0.7)'
        : 'rgba(139, 157, 119, 0.6)'
      ctx.letterSpacing = '0.2em'
      ctx.fillText('A  S K Y N I F T  P R O D U C T', width / 2, height / 2 - 70)
    }

    ctx.restore()
  }
}
