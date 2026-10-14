/* eslint-disable @typescript-eslint/no-explicit-any */
// The growing i: one sprig in a stoneware dish that grows, leafs and blooms
// as the page scrolls. Ported from the "Skynift website" design prototype.
// THREE is the r149 UMD build served from /vendor/three-r149.min.js.

export type SprigState = {
  g: number; l1: number; l2: number; l3: number; bud: number; open: number
  ghost: number; fall: number; fh: number; ly: number; el: number; yaw: number
}

export const SPRIG_START: SprigState = { g: 0.46, l1: 0.55, l2: 0, l3: 0, bud: 0.35, open: 0, ghost: 0, fall: 0.35, fh: 2.3, ly: 1.05, el: 13, yaw: -0.35 }

// One pose per chapter: about, how, drac, next, hello
export const SPRIG_POSES: SprigState[] = [
  { g: 0.72, l1: 1, l2: 0.15, l3: 0, bud: 0.55, open: 0, ghost: 0, fall: 0.3, fh: 3.0, ly: 1.5, el: 11, yaw: 0.2 },
  { g: 0.9, l1: 1, l2: 1, l3: 0.55, bud: 0.8, open: 0, ghost: 0, fall: 0.45, fh: 3.7, ly: 1.85, el: 9, yaw: 0.65 },
  { g: 1, l1: 1, l2: 1, l3: 1, bud: 1, open: 1, ghost: 0, fall: 0.8, fh: 2.05, ly: 3.15, el: 7, yaw: -0.2 },
  { g: 1, l1: 1, l2: 1, l3: 1, bud: 1, open: 1, ghost: 1, fall: 0.5, fh: 4.6, ly: 2.05, el: 15, yaw: 0.4 },
  { g: 1, l1: 1, l2: 1, l3: 1, bud: 1, open: 1, ghost: 0.4, fall: 0.65, fh: 4.3, ly: 2.05, el: 10, yaw: 0.05 },
]

type Labels = { note: HTMLElement | null; ghost: HTMLElement | null }

export class SprigScene {
  private T: any
  private renderer: any
  private scene: any
  private camera: any
  private plant: any
  private stem: any
  private curve: any
  private flower: any
  private stamens: any
  private fall: any
  private dummy: any
  private ghostLine: any
  private catcherMat: any
  private envTex: any
  private pairs: { t: number; pivot: any; a: any; b: any; seed: number }[] = []
  private petals: { m: any; open: number; closed: number }[] = []
  private ghostRings: any[] = []
  private leafSeeds: any[] = []
  private disposables: any[] = []
  private SEG = 180
  private RAD = 14
  private W = 1
  private H = 1
  private dark: boolean | null = null
  private ro?: ResizeObserver
  private onResize?: () => void

  constructor(T: any, private view: HTMLElement, canvas: HTMLCanvasElement, private labels: Labels) {
    this.T = T
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer = renderer
    if (T.ColorManagement) T.ColorManagement.legacyMode = false
    renderer.outputEncoding = T.sRGBEncoding
    renderer.toneMapping = T.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.95
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = T.PCFSoftShadowMap
    this.build()
    this.resize()
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.resize())
      this.ro.observe(view)
    } else {
      this.onResize = () => this.resize()
      window.addEventListener('resize', this.onResize)
    }
  }

  private keep<X>(x: X): X { this.disposables.push(x); return x }

  private resize() {
    const w = Math.max(1, this.view.clientWidth), h = Math.max(1, this.view.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2))
    this.renderer.setSize(w, h, false)
    this.W = w; this.H = h
  }

  private build() {
    const T = this.T, renderer = this.renderer
    const scene = new T.Scene()
    this.scene = scene
    const keep = <X,>(x: X) => this.keep(x)

    // Studio light: a dark room with soft window cards
    const pmrem = new T.PMREMGenerator(renderer)
    const env = new T.Scene()
    env.add(new T.Mesh(new T.BoxGeometry(24, 24, 24), new T.MeshBasicMaterial({ color: 0x1d1915, side: T.BackSide })))
    const card = (w: number, h: number, x: number, y: number, z: number, rx: number, ry: number, k: number) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(1, 0.95, 0.86).multiplyScalar(k), side: T.DoubleSide }))
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0); env.add(m)
    }
    card(10, 10, 0, 10, 0, Math.PI / 2, 0, 2.6)
    card(4, 8, -10, 2, 3, 0, Math.PI / 2, 4.2)
    card(2.5, 8, 10, 3, -3, 0, -Math.PI / 2, 2.2)
    card(8, 2.5, 0, 1, 10, 0, 0, 1.2)
    this.envTex = pmrem.fromScene(env, 0.04).texture
    scene.environment = this.envTex
    env.traverse((o: any) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
    pmrem.dispose()

    scene.add(new T.HemisphereLight(0xfff4e4, 0x2a2018, 0.3))
    const key = new T.DirectionalLight(0xfff0da, 1.35)
    key.position.set(2.6, 6.5, 3.4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    const sc = key.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 4.5; sc.bottom = -2; sc.near = 1; sc.far = 16
    key.shadow.bias = -0.0006; key.shadow.normalBias = 0.02
    scene.add(key)
    const rim = new T.DirectionalLight(0xffe2b0, 0.9)
    rim.position.set(-2.5, 4, -4); scene.add(rim)

    // ---- textures drawn once ----
    type Draw = (x: CanvasRenderingContext2D, w: number, h: number) => void
    const canvasTex = (w: number, h: number, draw: Draw, srgb = true) => {
      const c = document.createElement('canvas'); c.width = w; c.height = h
      draw(c.getContext('2d') as CanvasRenderingContext2D, w, h)
      const t = keep(new T.CanvasTexture(c))
      if (srgb) t.encoding = T.sRGBEncoding
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      return t
    }
    const leafTex = (base: string, deep: string, vein: string) => canvasTex(256, 128, (x, w, h) => {
      const gr = x.createLinearGradient(0, 0, w, 0)
      gr.addColorStop(0, deep); gr.addColorStop(0.5, base); gr.addColorStop(1, base)
      x.fillStyle = gr; x.fillRect(0, 0, w, h)
      const ge = x.createLinearGradient(0, 0, 0, h)
      ge.addColorStop(0, 'rgba(20,14,8,0.22)'); ge.addColorStop(0.22, 'rgba(20,14,8,0)')
      ge.addColorStop(0.78, 'rgba(20,14,8,0)'); ge.addColorStop(1, 'rgba(20,14,8,0.22)')
      x.fillStyle = ge; x.fillRect(0, 0, w, h)
      x.strokeStyle = vein; x.lineCap = 'round'
      x.globalAlpha = 0.8; x.lineWidth = 2.4
      x.beginPath(); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.stroke()
      x.globalAlpha = 0.38; x.lineWidth = 1.2
      for (let k = 0; k < 9; k++) {
        const sx = 10 + k * 26;
        [-1, 1].forEach((s) => { x.beginPath(); x.moveTo(sx, h / 2); x.quadraticCurveTo(sx + 16, h / 2 + s * 24, sx + 38, h / 2 + s * 50); x.stroke() })
      }
      x.globalAlpha = 0.05
      for (let i = 0; i < 700; i++) { x.fillStyle = i % 2 ? '#000' : '#fff'; x.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4) }
    })
    const petalTex = canvasTex(256, 128, (x, w, h) => {
      const gr = x.createLinearGradient(0, 0, w, 0)
      gr.addColorStop(0, '#7a4416'); gr.addColorStop(0.28, '#b8762d'); gr.addColorStop(0.62, '#d9a54a'); gr.addColorStop(1, '#efcf88')
      x.fillStyle = gr; x.fillRect(0, 0, w, h)
      x.strokeStyle = '#fff3d6'; x.lineWidth = 1
      for (let k = 0; k < 26; k++) { x.globalAlpha = 0.06 + Math.random() * 0.08; const y = 8 + k * 4.4; x.beginPath(); x.moveTo(20, h / 2 + (y - h / 2) * 0.25); x.quadraticCurveTo(w * 0.6, y, w, y + (y - h / 2) * 0.2); x.stroke() }
    })
    const speckTex = (base: string, n: number, alpha: number) => canvasTex(256, 256, (x, w, h) => {
      x.fillStyle = base; x.fillRect(0, 0, w, h)
      for (let i = 0; i < n; i++) { x.globalAlpha = Math.random() * alpha; x.fillStyle = i % 3 ? '#2a1d14' : '#ffffff'; const r = Math.random() * 1.6 + 0.3; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, r, 0, 7); x.fill() }
    })

    // ---- leaf-like surface: a parametric blade, creased along the midrib ----
    const blade = (len: number, wid: number, su: number, sv: number, crease: number, arch: number, droop: number, roundTip: boolean) => {
      const pos: number[] = [], uv: number[] = [], idx: number[] = []
      for (let i = 0; i <= su; i++) {
        const u = i / su
        const w = roundTip
          ? wid * Math.sqrt(Math.max(0, Math.sin(Math.PI * (0.06 + u * 0.86)))) * (0.45 + 0.55 * u)
          : wid * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, 0.72))), 0.9)
        for (let j = 0; j <= sv; j++) {
          const v = j / sv * 2 - 1
          const x = u * len, z = v * w
          const y = len * (arch * u - droop * u * u) + crease * Math.abs(v) * w
          pos.push(x, y, z); uv.push(u, j / sv)
        }
      }
      for (let i = 0; i < su; i++) for (let j = 0; j < sv; j++) {
        const a = i * (sv + 1) + j, b = a + sv + 1
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
      const g = keep(new T.BufferGeometry())
      g.setIndex(idx)
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3))
      g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2))
      g.computeVertexNormals()
      return g
    }
    const paleBack = (m: any) => {
      m.onBeforeCompile = (sh: any) => {
        sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>',
          '#include <color_fragment>\nif (!gl_FrontFacing) { float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(lum), 0.32) * 1.14; }')
      }
      return m
    }
    const tissue = (map: any, sheenHex: string) => paleBack(keep(new T.MeshPhysicalMaterial({
      map, roughness: 0.62, metalness: 0, side: T.DoubleSide,
      sheen: 0.6, sheenRoughness: 0.45, sheenColor: new T.Color(sheenHex), clearcoat: 0.08, clearcoatRoughness: 0.5,
    })))

    const plant = new T.Group(); scene.add(plant); this.plant = plant

    // Shadow catcher on the page ground
    this.catcherMat = keep(new T.ShadowMaterial({ opacity: 0.16 }))
    const catcher = new T.Mesh(keep(new T.PlaneGeometry(14, 14)), this.catcherMat)
    catcher.rotation.x = -Math.PI / 2; catcher.receiveShadow = true; plant.add(catcher)
    const ao = canvasTex(128, 128, (x, w, h) => {
      const g = x.createRadialGradient(64, 64, 6, 64, 64, 64)
      g.addColorStop(0, 'rgba(30,18,12,0.38)'); g.addColorStop(1, 'rgba(30,18,12,0)')
      x.fillStyle = g; x.fillRect(0, 0, w, h)
    }, false)
    const aoMesh = new T.Mesh(keep(new T.PlaneGeometry(2.9, 2.9)), keep(new T.MeshBasicMaterial({ map: ao, transparent: true, depthWrite: false })))
    aoMesh.rotation.x = -Math.PI / 2; aoMesh.position.y = 0.003; plant.add(aoMesh)

    // Stoneware dish and soil
    const prof = [[0, 0], [0.8, 0], [0.97, 0.04], [1.08, 0.15], [1.12, 0.25], [1.09, 0.27], [1.02, 0.25], [0.92, 0.17], [0, 0.16]].map((p) => new T.Vector2(p[0], p[1]))
    const dish = new T.Mesh(keep(new T.LatheGeometry(prof, 96)), keep(new T.MeshPhysicalMaterial({ map: speckTex('#e4d8c6', 900, 0.35), roughness: 0.66, clearcoat: 0.18, clearcoatRoughness: 0.4 })))
    dish.castShadow = true; dish.receiveShadow = true; plant.add(dish)
    const soil = new T.Mesh(keep(new T.CircleGeometry(0.95, 64)), keep(new T.MeshStandardMaterial({ map: speckTex('#3a2a1f', 2600, 0.5), roughness: 1 })))
    soil.rotation.x = -Math.PI / 2; soil.position.y = 0.18; soil.receiveShadow = true; plant.add(soil)

    // Stem: tapered, shaded darker at the base
    const curve = new T.CatmullRomCurve3([
      new T.Vector3(0, 0.17, 0), new T.Vector3(0.05, 0.85, 0.03), new T.Vector3(-0.06, 1.65, 0),
      new T.Vector3(0.05, 2.45, -0.03), new T.Vector3(0, 3.08, 0),
    ])
    this.curve = curve
    const SEG = this.SEG, RAD = this.RAD
    const sg = keep(new T.TubeGeometry(curve, SEG, 0.046, RAD, false))
    const sp = sg.attributes.position
    const cols: number[] = []
    const cBase = new T.Color('#4f5f3f'), cTip = new T.Color('#9db087'), tmp = new T.Color()
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG, c = curve.getPointAt(u), f = 1 - 0.58 * u
      tmp.copy(cBase).lerp(cTip, Math.pow(u, 0.8))
      for (let j = 0; j <= RAD; j++) {
        const k = i * (RAD + 1) + j
        sp.setXYZ(k, c.x + (sp.getX(k) - c.x) * f, c.y + (sp.getY(k) - c.y) * f, c.z + (sp.getZ(k) - c.z) * f)
        cols.push(tmp.r, tmp.g, tmp.b)
      }
    }
    sg.setAttribute('color', new T.Float32BufferAttribute(cols, 3))
    sg.computeVertexNormals()
    const stem = new T.Mesh(sg, keep(new T.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, sheen: 0.5, sheenColor: new T.Color('#e4efd2'), clearcoat: 0.12 })))
    stem.castShadow = true; plant.add(stem)
    this.stem = stem

    // Leaf pairs: sage, rose, sage from the bottom up, like the mark
    const sageTex = leafTex('#7f9369', '#55663f', '#d3dfbf')
    const roseTex = leafTex('#c17670', '#8f4f4b', '#f0cbc5')
    const pairsDef = [
      { t: 0.34, len: 0.66, wid: 0.2, tex: sageTex, sheen: '#e8f2d8' },
      { t: 0.55, len: 0.72, wid: 0.22, tex: roseTex, sheen: '#ffe1dc' },
      { t: 0.75, len: 0.58, wid: 0.18, tex: sageTex, sheen: '#e8f2d8' },
    ]
    this.pairs = pairsDef.map((d, i) => {
      const geo = blade(d.len, d.wid, 30, 10, 0.32, 0.34, 0.42, false)
      const mat = tissue(d.tex, d.sheen)
      const pivot = new T.Group()
      pivot.position.copy(curve.getPointAt(d.t))
      pivot.rotation.y = i * 1.65 + 0.35
      const a = new T.Mesh(geo, mat), b = new T.Mesh(geo, mat)
      a.position.x = 0.012; b.rotation.y = Math.PI; b.position.x = -0.012
      a.castShadow = b.castShadow = true
      pivot.add(a); pivot.add(b); plant.add(pivot)
      return { t: d.t, pivot, a, b, seed: i * 1.7 }
    })

    // The bloom: a turmeric bud that opens into Drac's gold flower
    const flower = new T.Group(); plant.add(flower); this.flower = flower
    const petalMat = paleBack(keep(new T.MeshPhysicalMaterial({ map: petalTex, roughness: 0.5, side: T.DoubleSide, sheen: 0.8, sheenRoughness: 0.35, sheenColor: new T.Color('#ffe6b0'), clearcoat: 0.15, clearcoatRoughness: 0.35 })))
    const outerGeo = blade(0.46, 0.17, 26, 12, 0.55, 0.05, -0.18, true)
    const innerGeo = blade(0.36, 0.14, 24, 10, 0.7, 0.04, -0.12, true)
    const addWhorl = (geo: any, n: number, off: number, open: number, closed: number) => {
      for (let i = 0; i < n; i++) {
        const piv = new T.Group()
        piv.rotation.y = off + i * Math.PI * 2 / n + (Math.sin(i * 7.1) * 0.06)
        const m = new T.Mesh(geo, petalMat); m.castShadow = true
        piv.add(m); flower.add(piv)
        this.petals.push({ m, open: open + Math.sin(i * 3.3) * 0.06, closed })
      }
    }
    addWhorl(outerGeo, 6, 0, 0.28, 1.42)
    addWhorl(innerGeo, 6, Math.PI / 6, 0.78, 1.5)
    const sepalMat = tissue(sageTex, '#e8f2d8')
    const sepalGeo = blade(0.2, 0.06, 12, 6, 0.2, 0.1, 0.3, false)
    for (let i = 0; i < 5; i++) {
      const piv = new T.Group(); piv.rotation.y = i * Math.PI * 2 / 5 + 0.3
      const m = new T.Mesh(sepalGeo, sepalMat); m.rotation.z = -0.15; m.position.y = -0.03
      piv.add(m); flower.add(piv)
    }
    const stamenMat = keep(new T.MeshStandardMaterial({ color: new T.Color('#3b2416'), roughness: 0.7 }))
    const stamens = new T.InstancedMesh(keep(new T.SphereGeometry(0.017, 10, 8)), stamenMat, 26)
    const dm = new T.Object3D()
    for (let i = 0; i < 26; i++) {
      const a = i * 2.39996, r = 0.012 * Math.sqrt(i) * 1.6
      dm.position.set(Math.cos(a) * r, 0.05 + 0.04 * (1 - r / 0.1), Math.sin(a) * r)
      dm.updateMatrix(); stamens.setMatrixAt(i, dm.matrix)
      stamens.setColorAt(i, new T.Color(i % 5 === 0 ? '#e5bf5e' : '#3b2416'))
    }
    this.stamens = stamens; flower.add(stamens)

    // Branches still to grow: drawn in outline, unbuilt
    this.ghostLine = keep(new T.LineDashedMaterial({ color: 0x5c4d3c, dashSize: 0.055, gapSize: 0.045, transparent: true, opacity: 0 }))
    ;[[0.46, -1], [0.63, 1]].forEach((gd) => {
      const p = curve.getPointAt(gd[0]), s = gd[1]
      const bc = new T.CatmullRomCurve3([p.clone(), p.clone().add(new T.Vector3(0.42 * s, 0.32, 0.1)), p.clone().add(new T.Vector3(0.82 * s, 0.98, 0.14))])
      const line = new T.Line(keep(new T.BufferGeometry().setFromPoints(bc.getPoints(48))), this.ghostLine)
      line.computeLineDistances(); plant.add(line)
      const ring = []
      for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2; ring.push(new T.Vector3(Math.cos(a) * 0.17, Math.sin(a) * 0.21, 0)) }
      const loop = new T.Line(keep(new T.BufferGeometry().setFromPoints(ring)), this.ghostLine)
      loop.computeLineDistances()
      loop.position.copy(bc.getPointAt(1)).add(new T.Vector3(0, 0.2, 0))
      plant.add(loop); this.ghostRings.push(loop)
    })

    // Falling leaves: instanced, seeded, closed-form tumble and slip
    const small = this.view.clientWidth < 700
    const N = small ? 10 : 20
    const fGeo = blade(0.2, 0.07, 12, 6, 0.25, 0.25, 0.3, false)
    fGeo.translate(-0.1, 0, 0)
    const fMat = tissue(leafTex('#e9e6df', '#c4bfb4', '#ffffff'), '#ffffff')
    const fall = new T.InstancedMesh(fGeo, fMat, N)
    fall.instanceMatrix.setUsage(T.DynamicDrawUsage)
    const pal = ['#8b9d77', '#8b9d77', '#a7ab7c', '#c4706e', '#d4a843', '#9fb08a']
    let s0 = 7
    const rnd = () => { s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647 }
    for (let i = 0; i < N; i++) {
      this.leafSeeds.push({
        x: (rnd() * 2 - 1) * 2.7, z: -1.7 + rnd() * 3.1, off: rnd(), fall: 0.16 + rnd() * 0.14,
        omega: (0.9 + rnd() * 1.4) * (rnd() < 0.5 ? -1 : 1), phase: rnd() * 6.28, slip: 0.22 + rnd() * 0.24,
        dir: rnd() * 6.28, roll: 0.25 + rnd() * 0.5, rph: rnd() * 6.28, scale: 0.75 + rnd() * 0.55, wind: 0.6 + rnd() * 0.8,
      })
      fall.setColorAt(i, new T.Color(pal[Math.floor(rnd() * pal.length)]))
    }
    fall.frustumCulled = false
    scene.add(fall); this.fall = fall; this.dummy = new T.Object3D()

    this.camera = new T.PerspectiveCamera(32, 1, 0.1, 100)
  }

  /** Draw one frame. S: the timeline state; time: seconds of idle motion; t: chapter time 0..5; iv: intro 0..1. */
  frame(S: SprigState, time: number, t: number, iv: number, dark: boolean) {
    const T = this.T
    const cl = (x: number) => Math.max(0, Math.min(1, x))
    const ease = (x: number) => { x = cl(x); return 1 - Math.pow(1 - x, 3) }

    if (dark !== this.dark) {
      this.dark = dark
      this.ghostLine.color.set(dark ? '#bfb0a0' : '#5c4d3c')
      this.catcherMat.opacity = dark ? 0.38 : 0.16
    }

    this.plant.scale.setScalar(0.9 + 0.1 * iv)
    this.plant.position.y = -0.2 * (1 - iv)
    this.plant.rotation.z = Math.sin(time * 0.55) * 0.01

    const g = Math.max(0.03, S.g * (0.35 + 0.65 * iv))
    this.stem.geometry.setDrawRange(0, Math.floor(this.SEG * g) * this.RAD * 6)

    const ls = [S.l1 * iv, S.l2, S.l3]
    this.pairs.forEach((p, i) => {
      const gate = cl((g - p.t) / 0.07)
      const e = ease(ls[i]) * gate
      p.pivot.visible = e > 0.01
      const s = Math.max(0.001, e)
      p.a.scale.setScalar(s); p.b.scale.setScalar(s)
      const flutter = Math.sin(time * 1.1 + p.seed) * 0.035
      p.a.rotation.z = 1.35 + (0.12 - 1.35) * e + flutter
      p.b.rotation.z = 1.35 + (0.12 - 1.35) * e - flutter
      p.a.rotation.x = Math.sin(time * 0.8 + p.seed) * 0.05
      p.b.rotation.x = -Math.sin(time * 0.9 + p.seed) * 0.05
    })

    const tip = this.curve.getPointAt(Math.min(1, g))
    this.flower.position.copy(tip)
    const fs = Math.max(0.001, ease(S.bud) * cl(g / 0.2))
    this.flower.scale.setScalar(0.55 * fs + 0.45 * fs * S.open)
    this.flower.visible = fs > 0.01
    const op = ease(S.open)
    this.petals.forEach((pt, i) => {
      pt.m.rotation.z = pt.closed + (pt.open - pt.closed) * op + Math.sin(time * 0.9 + i) * 0.015 * op
    })
    this.stamens.scale.setScalar(Math.max(0.001, op))
    this.flower.rotation.y = time * 0.05

    this.ghostLine.opacity = 0.8 * cl(S.ghost)

    // falling leaves
    const N = this.leafSeeds.length, H = 5.6, top = 4.9
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
      const edge = cl((top - y) / 0.6) * cl((y + 0.5) / 0.7)
      const active = cl(S.fall * N - i)
      d.scale.setScalar(Math.max(0.0001, sd.scale * edge * active))
      d.updateMatrix()
      this.fall.setMatrixAt(i, d.matrix)
    }
    this.fall.instanceMatrix.needsUpdate = true

    // camera: frame what must be seen beside the words
    const cam = this.camera, w = this.W, h = this.H
    const portrait = w / h < 0.8
    const hh = w >= 1024 ? 64 : 56
    const availH = Math.max(120, h - hh - (portrait ? 24 : 40))
    const textW = Math.min(0.31 * w, 470) + Math.max(20, Math.min(72, 0.04 * w))
    const narrow = portrait && w < 380
    const availW = portrait ? w * (narrow ? 0.34 : 0.4) : Math.max(w * 0.28, w - 2 * textW - 48)
    const cx = portrait ? (narrow ? 0.8 : 0.76) : 0.5
    cam.fov = portrait ? 36 : 30
    cam.aspect = w / h
    cam.setViewOffset(w, h, -(cx - 0.5) * w, -(hh - (portrait ? 0 : 24)) / 2, w, h)
    cam.updateProjectionMatrix()
    const tanV = Math.tan(cam.fov * Math.PI / 360)
    const fw = S.fh * 0.62
    const dist = Math.max((S.fh / 2) / (tanV * availH / h), (fw / 2) / (tanV * (w / h) * availW / w)) * 1.04 + 0.3
    const el = S.el * Math.PI / 180
    const yaw = S.yaw + Math.sin(time * 0.13) * 0.05
    cam.position.set(Math.sin(yaw) * Math.cos(el) * dist, S.ly + Math.sin(el) * dist, Math.cos(yaw) * Math.cos(el) * dist)
    cam.lookAt(0, S.ly, 0)

    const place = (lab: HTMLElement | null, v3: any, dxp: number, op2: number, toLeft = false) => {
      if (!lab) return
      const v = v3.clone().project(cam)
      lab.style.transform = 'translate(' + ((v.x + 1) / 2 * w + dxp).toFixed(1) + 'px,' + ((1 - v.y) / 2 * h).toFixed(1) + 'px) translate(' + (toLeft ? '-100%' : '0') + ', -50%)'
      lab.style.opacity = op2.toFixed(3)
    }
    const fwp = new T.Vector3(); this.flower.getWorldPosition(fwp)
    place(this.labels.note, fwp, Math.min(140, availW * 0.42), cl(1 - Math.abs(t - 3) / 0.42) * op)
    // "Not planted yet" sits off the left outline, away from the words on the right
    const gwp = new T.Vector3(); this.ghostRings[0].getWorldPosition(gwp)
    place(this.labels.ghost, gwp, -28, cl(1 - Math.abs(t - 4) / 0.42), true)
    this.ghostRings.forEach((r) => r.quaternion.copy(cam.quaternion))

    this.renderer.render(this.scene, cam)
  }

  onContextLost(cb: () => void) {
    this.renderer.domElement.addEventListener('webglcontextlost', (e: Event) => { e.preventDefault(); cb() })
  }

  dispose() {
    if (this.ro) this.ro.disconnect()
    if (this.onResize) window.removeEventListener('resize', this.onResize)
    if (this.scene) this.scene.traverse((o: any) => {
      if (o.geometry) o.geometry.dispose()
      const m = o.material
      if (m) (Array.isArray(m) ? m : [m]).forEach((mm: any) => mm.dispose())
    })
    this.disposables.forEach((x) => { try { x.dispose() } catch { /* already gone */ } })
    if (this.envTex) this.envTex.dispose()
    this.renderer.dispose()
  }
}
