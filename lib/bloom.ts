export interface Petal {
  cx: number
  cy: number
  rx: number
  ry: number
  rotation: number
  color: string
  maxScale: number
}

const COLORS = [
  'rgba(196, 112, 110, 0.4)',  // dried rose
  'rgba(139, 157, 119, 0.35)', // sage
  'rgba(212, 168, 67, 0.25)',  // gold whisper
  'rgba(196, 112, 110, 0.2)',  // rose light
  'rgba(139, 157, 119, 0.2)',  // sage light
  'rgba(212, 168, 67, 0.15)',  // gold faint
]

export function createPetals(centerX: number, centerY: number): Petal[] {
  const petals: Petal[] = []
  const count = 12

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const dist = 60 + Math.random() * 140
    petals.push({
      cx: centerX + Math.cos(angle) * dist,
      cy: centerY + Math.sin(angle) * dist,
      rx: 80 + Math.random() * 120,
      ry: 60 + Math.random() * 80,
      rotation: angle + Math.random() * 0.5,
      color: COLORS[i % COLORS.length],
      maxScale: 0.8 + Math.random() * 0.4,
    })
  }
  return petals
}

export function drawBloom(
  ctx: CanvasRenderingContext2D,
  petals: Petal[],
  progress: number, // 0 to 1
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = '#FAF7F2'
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalCompositeOperation = 'multiply'

  for (const petal of petals) {
    const petalProgress = Math.min(1, progress * 1.8) // petals bloom faster than full progress
    const scale = petalProgress * petal.maxScale
    if (scale <= 0.01) continue

    ctx.save()
    ctx.translate(petal.cx, petal.cy)
    ctx.rotate(petal.rotation)
    ctx.scale(scale, scale)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.rx)
    gradient.addColorStop(0, petal.color)
    gradient.addColorStop(0.6, petal.color.replace(/[\d.]+\)$/, '0.1)'))
    gradient.addColorStop(1, 'rgba(250, 247, 242, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.ellipse(0, 0, petal.rx, petal.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}
