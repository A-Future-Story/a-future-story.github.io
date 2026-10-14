import { LOGO } from '@/lib/logo-parts'

// The Skynift wordmark, inline so its sprig can grow. Colours come from CSS
// (--logo-*), so one drawing serves the light and dark themes.

const cl = (x: number) => Math.max(0, Math.min(1, x))
const sm = (x: number) => { x = cl(x); return x * x * (3 - 2 * x) }
const f = (n: number) => +n.toFixed(2)

/** Where each part of the sprig sits at a given chapter (0 = top of the page, 3+ = grown).
 *  k (0..1) is the sprout coming up out of the i, played once on load. */
export function sprigPose(c: number, k = 1) {
  const sy = (0.42 + 0.58 * sm(c / 3)) * (0.08 + 0.92 * k)
  const pairs = [0.75 + 0.25 * sm(c), sm((c - 0.6) / 1.2), sm((c - 1.6) / 1.2)].map((v) => v * sm(k * 1.4 - 0.4))
  const bud = (0.55 + 0.45 * sm((c - 2.2) / 0.8)) * sm(k * 1.6 - 0.2)
  const base = LOGO.stem.base
  const lift = (y: number) => base + (y - base) * sy
  return {
    stem: `translate(0 ${f(base * (1 - sy))}) scale(1 ${f(sy)})`,
    leaves: LOGO.leaves.map((l) => `translate(${l.bx} ${f(lift(l.by))}) scale(${f(Math.max(0.001, pairs[l.pair]))})`),
    sepals: `translate(${LOGO.sepals.bx} ${f(lift(LOGO.sepals.by))}) scale(${f(bud)})`,
    bud: `translate(${LOGO.bud.bx} ${f(lift(LOGO.bud.by))}) scale(${f(bud)})`,
  }
}

/** Move an already-rendered wordmark's sprig to chapter c. */
export function growWordmark(svg: SVGSVGElement | null, c: number, k = 1) {
  if (!svg) return
  const p = sprigPose(c, k)
  svg.querySelector('[data-part="stem"]')?.setAttribute('transform', p.stem)
  svg.querySelectorAll('[data-part="leaf"]').forEach((el, i) => el.setAttribute('transform', p.leaves[i]))
  svg.querySelector('[data-part="sepals"]')?.setAttribute('transform', p.sepals)
  svg.querySelector('[data-part="bud"]')?.setAttribute('transform', p.bud)
}

const FULL = 9

export default function Wordmark({ height, className, growth = FULL, svgRef }: {
  height: number
  className?: string
  /** chapter the sprig starts at; leave out for the full-grown mark */
  growth?: number
  svgRef?: React.Ref<SVGSVGElement>
}) {
  const p = sprigPose(growth)
  const [, , vw, vh] = LOGO.viewBox.split(' ').map(Number)
  return (
    <svg
      ref={svgRef}
      className={`wordmark ${className ?? ''}`}
      viewBox={LOGO.viewBox}
      width={Math.round((height * vw) / vh)}
      height={height}
      role="img"
      aria-label="Skynift"
    >
      <g transform="scale(0.2) translate(0 950)">
        <g style={{ fill: 'var(--logo-ink)' }}>
          {LOGO.letters.map((l) => <path key={l.x} transform={`translate(${l.x} 0)`} d={l.d} />)}
        </g>
        <path data-part="stem" style={{ fill: 'var(--logo-ink)' }} d={LOGO.stem.d} transform={p.stem} />
        {LOGO.leaves.map((l, i) => (
          <g key={i} data-part="leaf" transform={p.leaves[i]}>
            <path style={{ fill: `var(--logo-${l.color})` }} d={l.d} />
            <path style={{ fill: 'none', stroke: 'var(--logo-vein)', strokeOpacity: 'var(--logo-vein-op)' }} strokeWidth={7} strokeLinecap="round" d={l.vein} />
          </g>
        ))}
        <g data-part="sepals" transform={p.sepals}><path style={{ fill: 'var(--logo-sage)' }} d={LOGO.sepals.d} /></g>
        <g data-part="bud" transform={p.bud}><path style={{ fill: 'var(--logo-bud)' }} d={LOGO.bud.d} /></g>
      </g>
    </svg>
  )
}
