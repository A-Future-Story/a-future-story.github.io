// The growing i, in three dimensions: a young plant in a glazed stoneware pot that
// grows, opens its leaves and blooms as the page scrolls.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { SprigState } from './sprig-poses'

type Labels = { note: HTMLElement | null; ghost: HTMLElement | null }

const SOIL_Y = 0.74
const cl = (x: number) => Math.max(0, Math.min(1, x))
const easeOut = (x: number) => 1 - Math.pow(1 - cl(x), 3)
const smooth = (x: number) => { x = cl(x); return x * x * (3 - 2 * x) }

/** Small seeded PRNG so the plant looks the same on every visit. */
function rng(seed: number) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
}

/** Cheap smooth 2D value noise for soil and glaze. */
function noise2(x: number, y: number) {
  const h = (i: number, j: number) => { const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n) }
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export class SprigScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  private plant = new THREE.Group()
  private stem!: THREE.Mesh
  private curve!: THREE.CatmullRomCurve3
  private stemIndexPerRing = 0
  private stemRings = 0
  private nodes: { t: number; group: THREE.Group; leaves: THREE.Object3D[]; seed: number }[] = []
  private flower = new THREE.Group()
  private petals: { pivot: THREE.Object3D; open: number; closed: number; seed: number }[] = []
  private center!: THREE.Object3D
  private ghost!: THREE.InstancedMesh
  private ghostMat!: THREE.MeshBasicMaterial
  private ghostAnchors: THREE.Vector3[] = []
  private fall!: THREE.InstancedMesh
  private leafSeeds: { x: number; z: number; off: number; fall: number; omega: number; phase: number; slip: number; dir: number; roll: number; rph: number; scale: number; wind: number }[] = []
  private catcherMat!: THREE.ShadowMaterial
  private dummy = new THREE.Object3D()
  private tmpV = new THREE.Vector3()
  private disposables: { dispose: () => void }[] = []
  private W = 1
  private H = 1
  private dark: boolean | null = null
  private ro?: ResizeObserver
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  private onPointer?: (e: PointerEvent) => void

  constructor(private view: HTMLElement, canvas: HTMLCanvasElement, private labels: Labels) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer = renderer
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 0.95
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    this.buildLight()
    this.buildPot()
    this.buildStem()
    this.buildLeaves()
    this.buildFlower()
    this.buildGhosts()
    this.buildFallingLeaves()
    this.scene.add(this.plant)

    this.resize()
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(view)

    // A little parallax under a mouse; touch screens keep still
    if (window.matchMedia('(pointer: fine)').matches) {
      this.onPointer = (e: PointerEvent) => {
        this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
        this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('pointermove', this.onPointer, { passive: true })
    }
  }

  private keep<X extends { dispose: () => void }>(x: X): X { this.disposables.push(x); return x }

  private resize() {
    const w = Math.max(1, this.view.clientWidth), h = Math.max(1, this.view.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 1.75))
    this.renderer.setSize(w, h, false)
    this.W = w; this.H = h
  }

  // ---------- textures ----------
  private canvasTex(w: number, h: number, draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, color = true) {
    const c = document.createElement('canvas'); c.width = w; c.height = h
    draw(c.getContext('2d') as CanvasRenderingContext2D, w, h)
    const t = this.keep(new THREE.CanvasTexture(c))
    if (color) t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
    return t
  }

  /** Leaf colour and vein relief share one layout: u along the leaf (x), v across (y). */
  private leafMaps(base: string, deep: string, edge: string, vein: string, blush?: string) {
    const veins = (x: CanvasRenderingContext2D, w: number, h: number, ink: string, a1: number, a2: number) => {
      x.strokeStyle = ink; x.lineCap = 'round'
      x.globalAlpha = a1; x.lineWidth = 5
      x.beginPath(); x.moveTo(0, h / 2); x.quadraticCurveTo(w * 0.5, h / 2 + 2, w, h / 2); x.stroke()
      x.globalAlpha = a2; x.lineWidth = 2.2
      for (let k = 0; k < 8; k++) {
        const sx = 26 + k * 54
        for (const s of [-1, 1]) {
          x.beginPath(); x.moveTo(sx, h / 2)
          x.bezierCurveTo(sx + 24, h / 2 + s * 30, sx + 54, h / 2 + s * 70, sx + 96, h / 2 + s * 112)
          x.stroke()
        }
      }
    }
    const map = this.canvasTex(512, 256, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, edge); g.addColorStop(0.3, base); g.addColorStop(0.5, deep); g.addColorStop(0.7, base); g.addColorStop(1, edge)
      x.fillStyle = g; x.fillRect(0, 0, w, h)
      if (blush) {
        const r = x.createRadialGradient(w * 0.32, h / 2, 10, w * 0.32, h / 2, w * 0.5)
        r.addColorStop(0, blush + 'b0'); r.addColorStop(0.6, blush + '55'); r.addColorStop(1, blush + '00')
        x.fillStyle = r; x.fillRect(0, 0, w, h)
      }
      const l = x.createLinearGradient(0, 0, w, 0)
      l.addColorStop(0, 'rgba(30,24,10,0.18)'); l.addColorStop(0.3, 'rgba(30,24,10,0)'); l.addColorStop(1, 'rgba(255,250,230,0.08)')
      x.fillStyle = l; x.fillRect(0, 0, w, h)
      veins(x, w, h, vein, 0.75, 0.32)
      const rand = rng(11)
      for (let i = 0; i < 2200; i++) { x.globalAlpha = 0.04; x.fillStyle = i % 2 ? '#000' : '#fff'; x.fillRect(rand() * w, rand() * h, 1.6, 1.6) }
    })
    const bump = this.canvasTex(512, 256, (x, w, h) => {
      x.fillStyle = '#808080'; x.fillRect(0, 0, w, h)
      veins(x, w, h, '#3a3a3a', 0.9, 0.55)
    }, false)
    return { map, bump }
  }

  private tissue(maps: { map: THREE.Texture; bump: THREE.Texture }, sheen: string, backTint?: string) {
    const m = this.keep(new THREE.MeshPhysicalMaterial({
      map: maps.map, bumpMap: maps.bump, bumpScale: 1.2,
      roughness: 0.52, metalness: 0, side: THREE.DoubleSide,
      sheen: 0.45, sheenRoughness: 0.5, sheenColor: new THREE.Color(sheen),
      clearcoat: 0.12, clearcoatRoughness: 0.45, specularIntensity: 0.5,
    }))
    // The underside of a leaf is paler (or rose-flushed) and lets a little light through
    const tint = new THREE.Color(backTint ?? '#ffffff')
    const mixAmt = backTint ? 0.55 : 0.0
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>',
        `#include <color_fragment>
if (!gl_FrontFacing) {
  float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(lum), 0.25) * 1.18;
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(${tint.r.toFixed(3)}, ${tint.g.toFixed(3)}, ${tint.b.toFixed(3)}), ${mixAmt.toFixed(2)});
}`)
    }
    return m
  }

  // ---------- geometry ----------
  /** A real leaf: ovate with a pointed tip, creased along the midrib, cupped and gently arched. */
  private leafGeo(len: number, wid: number, opts: { cup?: number; arch?: number; droop?: number; twist?: number; serrate?: number } = {}) {
    const { cup = 0.35, arch = 0.3, droop = 0.36, twist = 0.12, serrate = 0 } = opts
    const su = 36, sv = 14
    const pos: number[] = [], uv: number[] = [], idx: number[] = []
    for (let i = 0; i <= su; i++) {
      const u = i / su
      let w = wid * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, 0.62))), 0.8) * (1 - 0.12 * u)
      if (serrate) w *= 1 + serrate * Math.max(0, Math.sin(u * 46)) * u
      for (let j = 0; j <= sv; j++) {
        const v = (j / sv) * 2 - 1
        const tw = twist * u * v
        const x = u * len
        const z = v * w * Math.cos(tw)
        const y = len * (arch * u - droop * u * u) + cup * Math.pow(Math.abs(v), 1.5) * w + w * Math.sin(tw) * 0.4
        pos.push(x, y, z); uv.push(u, j / sv)
      }
    }
    for (let i = 0; i < su; i++) for (let j = 0; j < sv; j++) {
      const a = i * (sv + 1) + j, b = a + sv + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
    const g = this.keep(new THREE.BufferGeometry())
    g.setIndex(idx)
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.computeVertexNormals()
    return g
  }

  /** A spoon-shaped petal with a softly ruffled edge. */
  private petalGeo(len: number, wid: number, cup: number) {
    const su = 24, sv = 16
    const pos: number[] = [], uv: number[] = [], idx: number[] = []
    for (let i = 0; i <= su; i++) {
      const u = i / su
      const w = wid * Math.pow(Math.sin(Math.PI * (0.08 + 0.84 * Math.pow(u, 0.8))), 0.55) * (0.35 + 0.65 * Math.sqrt(u))
      for (let j = 0; j <= sv; j++) {
        const v = (j / sv) * 2 - 1
        const ruffle = 0.012 * Math.sin(v * 9 + u * 4) * u * u
        const x = u * len
        const z = v * w
        const y = cup * v * v * w + len * (0.12 * u - 0.1 * u * u) + ruffle
        pos.push(x, y, z); uv.push(u, j / sv)
      }
    }
    for (let i = 0; i < su; i++) for (let j = 0; j < sv; j++) {
      const a = i * (sv + 1) + j, b = a + sv + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
    const g = this.keep(new THREE.BufferGeometry())
    g.setIndex(idx)
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.computeVertexNormals()
    return g
  }

  // ---------- the scene ----------
  private buildLight() {
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    const envTex = this.keep(pmrem.fromScene(room, 0.04).texture)
    this.scene.environment = envTex
    this.scene.environmentIntensity = 0.45
    room.traverse((o) => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose() })
    pmrem.dispose()

    this.scene.add(new THREE.HemisphereLight(0xfff4e4, 0x3a2c20, 0.55))
    const key = new THREE.DirectionalLight(0xffeccc, 2.8)
    key.position.set(3, 7, 4)
    key.castShadow = true
    key.shadow.mapSize.set(1536, 1536)
    const sc = key.shadow.camera
    sc.left = -3.2; sc.right = 3.2; sc.top = 5; sc.bottom = -2; sc.near = 1; sc.far = 18
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.025; key.shadow.radius = 4
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xffdca8, 1.6)
    rim.position.set(-3, 4.5, -4)
    this.scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffe6cf, 0.6)
    fill.position.set(-4, 2, 5)
    this.scene.add(fill)

    // Shadow and a soft contact shade on the page
    this.catcherMat = this.keep(new THREE.ShadowMaterial({ opacity: 0.14 }))
    const catcher = new THREE.Mesh(this.keep(new THREE.PlaneGeometry(16, 16)), this.catcherMat)
    catcher.rotation.x = -Math.PI / 2; catcher.receiveShadow = true
    this.plant.add(catcher)
    const ao = this.canvasTex(128, 128, (x, w, h) => {
      const g = x.createRadialGradient(64, 64, 4, 64, 64, 64)
      g.addColorStop(0, 'rgba(30,18,12,0.42)'); g.addColorStop(0.55, 'rgba(30,18,12,0.12)'); g.addColorStop(1, 'rgba(30,18,12,0)')
      x.fillStyle = g; x.fillRect(0, 0, w, h)
    }, false)
    const aoMesh = new THREE.Mesh(this.keep(new THREE.PlaneGeometry(2.6, 2.6)), this.keep(new THREE.MeshBasicMaterial({ map: ao, transparent: true, depthWrite: false })))
    aoMesh.rotation.x = -Math.PI / 2; aoMesh.position.y = 0.002
    this.plant.add(aoMesh)
  }

  private buildPot() {
    // Unglazed terracotta: warm clay with throwing rings and a faint mineral bloom near the rim
    const clay = this.canvasTex(1024, 512, (x, w, h) => {
      x.fillStyle = '#b8683f'; x.fillRect(0, 0, w, h)
      const rand = rng(5)
      for (let i = 0; i < 320; i++) {
        const cx = rand() * w, cy = rand() * h, r = 20 + rand() * 110
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, rand() < 0.5 ? 'rgba(150,72,40,0.28)' : 'rgba(214,140,96,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)')
        x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2)
      }
      // throwing rings: v runs along the profile, so rings are horizontal bands
      for (let y = 0; y < h; y += 3) {
        x.globalAlpha = 0.012 + 0.022 * noise2(1, y / 9)
        x.fillStyle = y % 2 ? '#7a3a1e' : '#e6a37a'
        x.fillRect(0, y, w, 1.4)
      }
      // mineral bloom just below the rim
      for (let i = 0; i < 1400; i++) {
        x.globalAlpha = 0.05 + rand() * 0.08
        x.fillStyle = '#f3e3cf'
        const yy = h * (0.3 + rand() * 0.14)
        x.beginPath(); x.arc(rand() * w, yy, 1 + rand() * 3, 0, 7); x.fill()
      }
      for (let i = 0; i < 2600; i++) { x.globalAlpha = 0.1 + rand() * 0.2; x.fillStyle = rand() < 0.6 ? '#6f3218' : '#e9b38c'; x.fillRect(rand() * w, rand() * h, 1.5, 1.5) }
    })
    clay.wrapS = THREE.RepeatWrapping
    const ringsBump = this.canvasTex(32, 512, (x, w, h) => {
      for (let y = 0; y < h; y++) { const v = 128 + 26 * Math.sin(y * 0.9) * noise2(2, y / 14); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(0, y, w, 1) }
    }, false)
    const potMat = this.keep(new THREE.MeshPhysicalMaterial({ map: clay, bumpMap: ringsBump, bumpScale: 0.25, roughness: 0.86, sheen: 0.25, sheenRoughness: 0.8, sheenColor: new THREE.Color('#f2c7a6') }))
    const prof = [
      [0, 0.02], [0.5, 0.0], [0.56, 0.01], [0.58, 0.05], [0.6, 0.12], [0.68, 0.42], [0.75, 0.66], [0.79, 0.76],
      [0.84, 0.8], [0.865, 0.835], [0.86, 0.865], [0.83, 0.875], [0.79, 0.865], [0.76, 0.84], [0.72, 0.78], [0.7, 0.7], [0.6, 0.5], [0, 0.48],
    ].map((p) => new THREE.Vector2(p[0], p[1]))
    const pot = new THREE.Mesh(this.keep(new THREE.LatheGeometry(prof, 128)), potMat)
    pot.castShadow = true; pot.receiveShadow = true
    this.plant.add(pot)

    // Saucer
    const sProf = [[0, 0.002], [0.9, 0.0], [0.95, 0.012], [0.98, 0.05], [0.975, 0.065], [0.95, 0.06], [0.92, 0.03], [0, 0.03]].map((p) => new THREE.Vector2(p[0], p[1]))
    const saucer = new THREE.Mesh(this.keep(new THREE.LatheGeometry(sProf, 128)), potMat)
    saucer.receiveShadow = true; saucer.castShadow = true
    this.plant.add(saucer)

    // Soil: a lumpy disc with a few pebbles
    const soilTex = this.canvasTex(512, 512, (x, w, h) => {
      x.fillStyle = '#3b2a1e'; x.fillRect(0, 0, w, h)
      const rand = rng(9)
      for (let i = 0; i < 9000; i++) {
        x.globalAlpha = 0.15 + rand() * 0.45
        x.fillStyle = ['#241811', '#55402e', '#6b5440', '#2e2016'][i % 4]
        x.beginPath(); x.arc(rand() * w, rand() * h, 0.5 + rand() * 2.2, 0, 7); x.fill()
      }
    })
    const disc = this.keep(new THREE.RingGeometry(0.001, 0.715, 96, 20))
    const p = disc.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y)
      const bump = (noise2(x * 9, y * 9) - 0.5) * 0.028 + (noise2(x * 25, y * 25) - 0.5) * 0.01
      p.setZ(i, bump * cl((0.715 - r) / 0.08) + 0.018 * (1 - r / 0.715))
    }
    disc.computeVertexNormals()
    const soil = new THREE.Mesh(disc, this.keep(new THREE.MeshStandardMaterial({ map: soilTex, roughness: 0.95 })))
    soil.rotation.x = -Math.PI / 2; soil.position.y = SOIL_Y - 0.01; soil.receiveShadow = true
    this.plant.add(soil)

    const rand = rng(21)
    const pebbleGeo = this.keep(new THREE.IcosahedronGeometry(0.03, 1))
    const pebbleMat = this.keep(new THREE.MeshStandardMaterial({ roughness: 0.7 }))
    const pebbles = new THREE.InstancedMesh(pebbleGeo, pebbleMat, 14)
    const cols = ['#d9cbb4', '#b8a68a', '#efe4d0', '#9c8a72']
    for (let i = 0; i < 14; i++) {
      const a = rand() * Math.PI * 2, r = 0.18 + rand() * 0.46
      this.dummy.position.set(Math.cos(a) * r, SOIL_Y + 0.012, Math.sin(a) * r)
      this.dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3)
      const s = 0.5 + rand() * 0.9
      this.dummy.scale.set(s * 1.3, s * 0.6, s)
      this.dummy.updateMatrix()
      pebbles.setMatrixAt(i, this.dummy.matrix)
      pebbles.setColorAt(i, new THREE.Color(cols[i % 4]))
    }
    pebbles.castShadow = true; pebbles.receiveShadow = true
    this.plant.add(pebbles)
  }

  private buildStem() {
    const pts = [[0, SOIL_Y - 0.04, 0], [0.035, 1.25, 0.02], [-0.045, 1.9, -0.01], [0.03, 2.6, -0.025], [-0.01, 3.25, 0.01], [0, 3.42, 0]]
    this.curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])))
    const SEG = 220, RAD = 12
    const g = this.keep(new THREE.TubeGeometry(this.curve, SEG, 0.052, RAD, false))
    const pos = g.attributes.position
    const cols: number[] = []
    const cBase = new THREE.Color('#556343'), cTip = new THREE.Color('#a3b68b'), tmp = new THREE.Color()
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG, c = this.curve.getPointAt(u)
      // taper, with slight swelling at the leaf nodes
      let f = 1 - 0.62 * u
      for (const t of [0.17, 0.31, 0.45, 0.58, 0.7, 0.81]) f += 0.12 * Math.exp(-Math.pow((u - t) / 0.012, 2))
      tmp.copy(cBase).lerp(cTip, Math.pow(u, 0.75))
      for (let j = 0; j <= RAD; j++) {
        const k = i * (RAD + 1) + j
        pos.setXYZ(k, c.x + (pos.getX(k) - c.x) * f, c.y + (pos.getY(k) - c.y) * f, c.z + (pos.getZ(k) - c.z) * f)
        cols.push(tmp.r, tmp.g, tmp.b)
      }
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
    g.computeVertexNormals()
    const mat = this.keep(new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.48, sheen: 0.5, sheenColor: new THREE.Color('#e4efd2'), clearcoat: 0.18, clearcoatRoughness: 0.4 }))
    this.stem = new THREE.Mesh(g, mat)
    this.stem.castShadow = true
    this.plant.add(this.stem)
    this.stemRings = SEG
    this.stemIndexPerRing = RAD * 6
  }

  private buildLeaves() {
    const sage = this.leafMaps('#7c9166', '#61744d', '#9aae83', '#dfe8cf')
    const rose = this.leafMaps('#829868', '#677a52', '#a3b088', '#efd9d2', '#c4706e')
    const young = this.leafMaps('#93a97a', '#7a9063', '#b1c39a', '#e8f0da')
    const sageMat = this.tissue(sage, '#e8f2d8')
    const roseMat = this.tissue(rose, '#ffd9d2', '#d48a86')
    const youngMat = this.tissue(young, '#eef6e0')
    const petiole = this.keep(new THREE.CylinderGeometry(0.012, 0.018, 1, 6))
    petiole.translate(0, 0.5, 0); petiole.rotateZ(-Math.PI / 2)
    const petMat = this.keep(new THREE.MeshStandardMaterial({ color: '#7f9566', roughness: 0.6 }))

    // Decussate pairs, like basil: each node turns a quarter from the one below
    const defs = [
      { t: 0.17, len: 0.82, wid: 0.3, mat: sageMat },
      { t: 0.31, len: 0.8, wid: 0.29, mat: sageMat },
      { t: 0.45, len: 0.74, wid: 0.27, mat: roseMat },
      { t: 0.58, len: 0.64, wid: 0.24, mat: roseMat },
      { t: 0.7, len: 0.52, wid: 0.2, mat: sageMat },
      { t: 0.81, len: 0.36, wid: 0.14, mat: youngMat },
    ]
    defs.forEach((d, i) => {
      const geo = this.leafGeo(d.len, d.wid, { serrate: i === 5 ? 0 : 0.012, twist: 0.08 + i * 0.025, droop: 0.42 - i * 0.03 })
      const group = new THREE.Group()
      group.position.copy(this.curve.getPointAt(d.t))
      group.rotation.y = i * (Math.PI / 2) + 0.3
      const leaves: THREE.Object3D[] = []
      for (const side of [0, 1]) {
        const arm = new THREE.Group()
        arm.rotation.y = side * Math.PI
        const tilt = new THREE.Group()
        arm.add(tilt)
        const pet = new THREE.Mesh(petiole, petMat)
        pet.scale.set(0.07, 1, 1)
        pet.castShadow = true
        tilt.add(pet)
        const leaf = new THREE.Mesh(geo, d.mat)
        leaf.position.x = 0.06
        leaf.castShadow = true; leaf.receiveShadow = true
        tilt.add(leaf)
        group.add(arm)
        leaves.push(tilt)
      }
      this.plant.add(group)
      this.nodes.push({ t: d.t, group, leaves, seed: i * 1.7 })
    })
  }

  private buildFlower() {
    this.plant.add(this.flower)
    const petalTex = this.canvasTex(256, 128, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, 0)
      g.addColorStop(0, '#8a4c18'); g.addColorStop(0.22, '#c0832f'); g.addColorStop(0.55, '#dcae55'); g.addColorStop(0.85, '#f0d593'); g.addColorStop(1, '#f7e7bd')
      x.fillStyle = g; x.fillRect(0, 0, w, h)
      const rand = rng(3)
      x.strokeStyle = '#fff4d8'; x.lineWidth = 1
      for (let k = 0; k < 30; k++) {
        x.globalAlpha = 0.05 + rand() * 0.09
        const y = 6 + k * 4
        x.beginPath(); x.moveTo(10, h / 2 + (y - h / 2) * 0.2); x.quadraticCurveTo(w * 0.6, y, w, y + (y - h / 2) * 0.15); x.stroke()
      }
    })
    const petalMat = this.keep(new THREE.MeshPhysicalMaterial({
      map: petalTex, roughness: 0.42, side: THREE.DoubleSide,
      sheen: 0.9, sheenRoughness: 0.32, sheenColor: new THREE.Color('#ffe9b8'),
      clearcoat: 0.1, specularIntensity: 0.6,
    }))
    petalMat.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\nif (!gl_FrontFacing) { diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.92, 0.75), 0.18); }')
    }
    const whorls = [
      { n: 6, len: 0.44, wid: 0.17, cup: 0.9, off: 0, open: 0.22, closed: 1.4 },
      { n: 6, len: 0.36, wid: 0.15, cup: 1.1, off: Math.PI / 6, open: 0.62, closed: 1.48 },
      { n: 5, len: 0.25, wid: 0.12, cup: 1.3, off: 0.3, open: 1.02, closed: 1.52 },
    ]
    const rand = rng(17)
    whorls.forEach((wh) => {
      const geo = this.petalGeo(wh.len, wh.wid, wh.cup)
      for (let i = 0; i < wh.n; i++) {
        const piv = new THREE.Group()
        piv.rotation.y = wh.off + (i * Math.PI * 2) / wh.n + (rand() - 0.5) * 0.12
        const tilt = new THREE.Group()
        piv.add(tilt)
        const m = new THREE.Mesh(geo, petalMat)
        m.castShadow = true
        tilt.add(m)
        this.flower.add(piv)
        this.petals.push({ pivot: tilt, open: wh.open + (rand() - 0.5) * 0.1, closed: wh.closed, seed: rand() * 6 })
      }
    })
    // Sepals
    const sepalGeo = this.leafGeo(0.16, 0.055, { cup: 0.3, arch: 0.1, droop: 0.4 })
    const sepalMat = this.tissue(this.leafMaps('#7c9166', '#61744d', '#9aae83', '#dfe8cf'), '#e8f2d8')
    for (let i = 0; i < 5; i++) {
      const piv = new THREE.Group(); piv.rotation.y = (i * Math.PI * 2) / 5 + 0.2
      const m = new THREE.Mesh(sepalGeo, sepalMat); m.rotation.z = -0.35; m.position.y = -0.03
      piv.add(m); this.flower.add(piv)
    }
    // Centre: a domed disc with stamens
    const center = new THREE.Group()
    const discMat = this.keep(new THREE.MeshStandardMaterial({ color: '#4a2c17', roughness: 0.8 }))
    const disc = new THREE.Mesh(this.keep(new THREE.SphereGeometry(0.075, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)), discMat)
    disc.scale.y = 0.55
    center.add(disc)
    const filGeo = this.keep(new THREE.CylinderGeometry(0.003, 0.004, 1, 5)); filGeo.translate(0, 0.5, 0)
    const antGeo = this.keep(new THREE.SphereGeometry(0.011, 8, 6))
    const filMat = this.keep(new THREE.MeshStandardMaterial({ color: '#e9cf8f', roughness: 0.6 }))
    const antMat = this.keep(new THREE.MeshStandardMaterial({ color: '#e5bf5e', roughness: 0.5, emissive: '#3a2400', emissiveIntensity: 0.2 }))
    const N = 22
    const fils = new THREE.InstancedMesh(filGeo, filMat, N), ants = new THREE.InstancedMesh(antGeo, antMat, N)
    for (let i = 0; i < N; i++) {
      const a = i * 2.39996, r = 0.03 + 0.035 * Math.sqrt(i / N)
      const len = 0.09 + rand() * 0.04
      this.dummy.position.set(Math.cos(a) * r * 0.6, 0.02, Math.sin(a) * r * 0.6)
      this.dummy.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5)
      this.dummy.scale.set(1, len, 1)
      this.dummy.updateMatrix(); fils.setMatrixAt(i, this.dummy.matrix)
      const tip = new THREE.Vector3(0, 1, 0).applyMatrix4(this.dummy.matrix)
      this.dummy.position.copy(tip); this.dummy.scale.set(1, 1, 1); this.dummy.rotation.set(0, 0, 0)
      this.dummy.updateMatrix(); ants.setMatrixAt(i, this.dummy.matrix)
    }
    center.add(fils); center.add(ants)
    this.center = center
    this.flower.add(center)
  }

  private buildGhosts() {
    // Branches still to grow: dotted outlines of a stem and a bud, not built yet
    const dots: THREE.Vector3[] = []
    for (const [t, s] of [[0.5, -1], [0.68, 1]] as const) {
      const p = this.curve.getPointAt(t)
      const bc = new THREE.CatmullRomCurve3([p.clone(), p.clone().add(new THREE.Vector3(0.45 * s, 0.32, 0.12)), p.clone().add(new THREE.Vector3(0.88 * s, 1.0, 0.16))])
      const n = 18
      for (let i = 2; i <= n; i++) dots.push(bc.getPointAt(i / n))
      const end = bc.getPointAt(1).add(new THREE.Vector3(0, 0.22, 0))
      this.ghostAnchors.push(end.clone())
      for (let k = 0; k < 22; k++) {
        const a = (k / 22) * Math.PI * 2
        dots.push(end.clone().add(new THREE.Vector3(Math.cos(a) * 0.15, Math.sin(a) * 0.21, 0)))
      }
    }
    this.ghostMat = this.keep(new THREE.MeshBasicMaterial({ color: '#5c4d3c', transparent: true, opacity: 0, depthWrite: false }))
    this.ghost = new THREE.InstancedMesh(this.keep(new THREE.SphereGeometry(0.011, 8, 6)), this.ghostMat, dots.length)
    dots.forEach((d, i) => { this.dummy.position.copy(d); this.dummy.rotation.set(0, 0, 0); this.dummy.scale.setScalar(1); this.dummy.updateMatrix(); this.ghost.setMatrixAt(i, this.dummy.matrix) })
    this.plant.add(this.ghost)
  }

  private buildFallingLeaves() {
    const small = this.view.clientWidth < 700
    const N = small ? 9 : 16
    const geo = this.leafGeo(0.2, 0.075, { cup: 0.3, arch: 0.25, droop: 0.3 })
    geo.translate(-0.1, 0, 0)
    const pale = this.leafMaps('#eeebe4', '#d8d3c8', '#ffffff', '#ffffff')
    const mat = this.tissue(pale, '#ffffff')
    const fall = new THREE.InstancedMesh(geo, mat, N)
    fall.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const pal = ['#8b9d77', '#8b9d77', '#a7ab7c', '#c4706e', '#d4a843', '#9fb08a']
    const rand = rng(7)
    for (let i = 0; i < N; i++) {
      this.leafSeeds.push({
        x: (rand() * 2 - 1) * 1.9, z: -2.2 + rand() * 2.6, off: rand(), fall: 0.14 + rand() * 0.12,
        omega: (0.9 + rand() * 1.3) * (rand() < 0.5 ? -1 : 1), phase: rand() * 6.28, slip: 0.22 + rand() * 0.24,
        dir: rand() * 6.28, roll: 0.25 + rand() * 0.5, rph: rand() * 6.28, scale: 0.75 + rand() * 0.5, wind: 0.6 + rand() * 0.8,
      })
      fall.setColorAt(i, new THREE.Color(pal[Math.floor(rand() * pal.length)]))
    }
    fall.frustumCulled = false
    fall.castShadow = true
    this.scene.add(fall)
    this.fall = fall
  }

  /** Draw one frame. S: the scroll state; time: seconds of idle motion; iv: intro 0..1. */
  frame(S: SprigState, time: number, iv: number, dark: boolean, dt: number) {
    if (dark !== this.dark) {
      this.dark = dark
      this.ghostMat.color.set(dark ? '#d8c9b6' : '#5c4d3c')
      this.catcherMat.opacity = dark ? 0.4 : 0.14
      this.scene.environmentIntensity = dark ? 0.36 : 0.45
    }

    // intro: the plant rises out of the soil once
    this.plant.position.y = -0.12 * (1 - iv)
    const sway = Math.sin(time * 0.5) * 0.012 + Math.sin(time * 1.3) * 0.004

    const g = Math.max(0.02, S.g * (0.25 + 0.75 * easeOut(iv)))
    const rings = Math.max(1, Math.floor(this.stemRings * g))
    this.stem.geometry.setDrawRange(0, rings * this.stemIndexPerRing)
    this.stem.rotation.z = sway * 0.5

    const n1 = S.n1 * smooth(iv * 1.4 - 0.25)
    const opens = [n1, n1, S.n2, S.n3, S.n3, S.n4]
    this.nodes.forEach((nd, i) => {
      const gate = cl((g - nd.t) / 0.06)
      const e = easeOut(opens[i]) * gate
      nd.group.visible = e > 0.01
      nd.group.position.copy(this.curve.getPointAt(nd.t))
      nd.group.position.x += sway * nd.t * 2
      nd.leaves.forEach((tilt, k) => {
        tilt.scale.setScalar(Math.max(0.001, (0.2 + 0.8 * e) * gate))
        const flutter = Math.sin(time * (1.1 + k * 0.17) + nd.seed + k) * 0.035
        // folded up against the stem, then spreading out as the pair opens
        tilt.rotation.z = 1.25 + (0.12 + i * 0.07 - 1.25) * e + flutter
        tilt.rotation.x = Math.sin(time * 0.8 + nd.seed + k * 2) * 0.05
      })
    })

    const tip = this.curve.getPointAt(Math.min(1, g))
    this.flower.position.copy(tip)
    this.flower.position.x += sway * 2
    const fs = Math.max(0.001, easeOut(S.bud) * cl((g - 0.25) / 0.2))
    this.flower.scale.setScalar(0.62 * fs + 0.62 * fs * S.open)
    this.flower.visible = fs > 0.01
    const op = smooth(S.open)
    this.petals.forEach((p) => {
      p.pivot.rotation.z = p.closed + (p.open - p.closed) * op + Math.sin(time * 0.9 + p.seed) * 0.02 * op
    })
    this.center.scale.setScalar(Math.max(0.001, op))
    this.flower.rotation.y = time * 0.04

    this.ghostMat.opacity = 0.75 * cl(S.ghost)
    this.ghost.visible = S.ghost > 0.01

    // falling leaves
    const N = this.leafSeeds.length, H = 6, top = 5.3
    const wind = Math.sin(time * 0.21) * 0.35 + Math.sin(time * 0.53 + 1.3) * 0.12
    const d = this.dummy
    for (let i = 0; i < N; i++) {
      const sd = this.leafSeeds[i]
      const cyc = (sd.off * H + time * sd.fall) % H
      const y = top - cyc
      const ang = sd.phase + sd.omega * time
      const side = -(sd.slip / sd.omega) * Math.cos(ang)
      const dx = Math.sin(sd.dir), dz = Math.cos(sd.dir)
      d.position.set(sd.x + dx * side + wind * sd.wind * (cyc / H), y, sd.z + dz * side)
      d.rotation.set(ang, sd.dir, Math.sin(time * sd.roll + sd.rph) * 0.6, 'YXZ')
      const edge = cl((top - y) / 0.6) * cl((y + 0.3) / 0.6)
      const active = cl(S.fall * N - i)
      d.scale.setScalar(Math.max(0.0001, sd.scale * edge * active))
      d.updateMatrix()
      this.fall.setMatrixAt(i, d.matrix)
    }
    this.fall.instanceMatrix.needsUpdate = true

    // pointer parallax, damped
    const k = 1 - Math.exp(-dt * 3)
    this.pointer.x += (this.pointer.tx - this.pointer.x) * k
    this.pointer.y += (this.pointer.ty - this.pointer.y) * k

    // camera: frame what must be seen beside the words
    const cam = this.camera, w = this.W, h = this.H
    const portrait = w / h < 0.8
    const narrow = portrait && w < 380
    const hh = w >= 1024 ? 64 : 56
    const availH = Math.max(120, h - hh - (portrait ? 24 : 40))
    const textW = Math.min(0.31 * w, 470) + Math.max(20, Math.min(72, 0.04 * w))
    const availW = portrait ? w * (narrow ? 0.34 : 0.4) : Math.max(w * 0.28, w - 2 * textW - 48)
    const cx = portrait ? (narrow ? 0.8 : 0.76) : 0.5
    cam.fov = portrait ? 34 : 28
    cam.aspect = w / h
    cam.setViewOffset(w, h, -(cx - 0.5) * w, -(hh - (portrait ? 0 : 24)) / 2, w, h)
    cam.updateProjectionMatrix()
    const tanV = Math.tan((cam.fov * Math.PI) / 360)
    const fw = S.fh * 0.62
    const dist = Math.max((S.fh / 2) / ((tanV * availH) / h), (fw / 2) / ((tanV * (w / h) * availW) / w)) * 1.04 + 0.3
    const el = ((S.el + this.pointer.y * 2.5) * Math.PI) / 180
    const yaw = S.yaw + Math.sin(time * 0.13) * 0.05 + this.pointer.x * 0.08
    cam.position.set(Math.sin(yaw) * Math.cos(el) * dist, S.ly + Math.sin(el) * dist, Math.cos(yaw) * Math.cos(el) * dist)
    cam.lookAt(0, S.ly, 0)

    // labels that live in the scene
    const place = (lab: HTMLElement | null, v3: THREE.Vector3, dxp: number, opacity: number, toLeft = false) => {
      if (!lab) return
      const v = v3.clone().project(cam)
      let px = ((v.x + 1) / 2) * w + dxp
      if (toLeft) px = Math.max(lab.offsetWidth + 16, px)
      lab.style.transform = `translate(${px.toFixed(1)}px,${(((1 - v.y) / 2) * h).toFixed(1)}px) translate(${toLeft ? '-100%' : '0'}, -50%)`
      lab.style.opacity = opacity.toFixed(3)
    }
    this.flower.getWorldPosition(this.tmpV)
    place(this.labels.note, this.tmpV, Math.min(150, availW * 0.42), cl(1 - Math.abs(S.c - 3) / 0.25) * op)
    place(this.labels.ghost, this.ghostAnchors[0].clone().add(this.plant.position), -30, cl(1 - Math.abs(S.c - 4) / 0.25) * cl(S.ghost), true)

    this.renderer.render(this.scene, cam)
  }

  onContextLost(cb: () => void) {
    this.renderer.domElement.addEventListener('webglcontextlost', (e: Event) => { e.preventDefault(); cb() })
  }

  dispose() {
    this.ro?.disconnect()
    if (this.onPointer) window.removeEventListener('pointermove', this.onPointer)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = m.material
      if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((mm) => mm.dispose())
    })
    this.disposables.forEach((x) => { try { x.dispose() } catch { /* already gone */ } })
    this.renderer.dispose()
  }
}
