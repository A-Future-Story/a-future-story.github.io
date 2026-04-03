export interface GeoPetal {
  cx: number
  cy: number
  size: number
  sides: number
  rotation: number
  color: string
  maxScale: number
}

const COLORS = [
  'rgba(201, 150, 58, 0.5)',   // drac gold
  'rgba(196, 112, 110, 0.4)',  // coral
  'rgba(184, 118, 45, 0.35)',  // amber
  'rgba(212, 168, 67, 0.3)',   // gold
  'rgba(201, 150, 58, 0.25)',  // gold light
]

export function createGeoPetals(cx: number, cy: number): GeoPetal[] {
  const petals: GeoPetal[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const dist = 50 + Math.random() * 100
    petals.push({
      cx: cx + Math.cos(angle) * dist,
      cy: cy + Math.sin(angle) * dist,
      size: 60 + Math.random() * 100,
      sides: [5, 6, 7, 8][Math.floor(Math.random() * 4)],
      rotation: angle,
      color: COLORS[i % COLORS.length],
      maxScale: 0.8 + Math.random() * 0.4,
    })
  }
  return petals
}

function drawPolygon(ctx: CanvasRenderingContext2D, sides: number, size: number) {
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * size
    const y = Math.sin(angle) * size
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export function drawMarkitectBloom(
  ctx: CanvasRenderingContext2D,
  petals: GeoPetal[],
  progress: number,
  width: number,
  height: number,
  isDark: boolean = false,
) {
  ctx.clearRect(0, 0, width, height)

  const bgProgress = Math.max(0, (progress - 0.7) / 0.3)
  const startR = isDark ? 28 : 28, startG = isDark ? 25 : 25, startB = isDark ? 21 : 21
  const endR = isDark ? 15 : 240, endG = isDark ? 13 : 232, endB = isDark ? 19 : 216
  const r = Math.round(startR + bgProgress * (endR - startR))
  const g = Math.round(startG + bgProgress * (endG - startG))
  const b = Math.round(startB + bgProgress * (endB - startB))
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  for (const petal of petals) {
    const scale = Math.min(1, progress * 2) * petal.maxScale
    if (scale <= 0.01) continue

    ctx.save()
    ctx.translate(petal.cx, petal.cy)
    ctx.rotate(petal.rotation + progress * 0.3)
    ctx.scale(scale, scale)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size)
    gradient.addColorStop(0, petal.color)
    gradient.addColorStop(1, 'rgba(28, 25, 21, 0)')

    ctx.fillStyle = gradient
    drawPolygon(ctx, petal.sides, petal.size)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()

  const textProgress = Math.max(0, (progress - 0.3) / 0.4)
  if (textProgress > 0) {
    ctx.save()
    ctx.globalAlpha = textProgress

    const textColor = bgProgress > 0.5 ? '#2C1810' : '#D4A843'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${Math.min(width * 0.1, 100)}px "Cormorant Garamond", Georgia, serif`
    ctx.fillStyle = textColor
    ctx.fillText('Markitect', width / 2, height / 2 - 20)

    ctx.font = `400 ${Math.min(width * 0.022, 20)}px "DM Sans", system-ui, sans-serif`
    ctx.fillStyle = bgProgress > 0.5 ? 'rgba(44, 24, 16, 0.7)' : 'rgba(240, 232, 216, 0.7)'
    ctx.fillText('Describe your product. Launch your campaign. AI handles the rest.', width / 2, height / 2 + 30)

    ctx.restore()
  }
}
