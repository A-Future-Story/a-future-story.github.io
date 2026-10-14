// The plant's state at each chapter. Kept apart from the scene so the page can
// build its scroll timeline without loading three.js up front.

export type SprigState = {
  /** stem growth 0..1 */ g: number
  /** leaf-node openness, bottom to top */ n1: number; n2: number; n3: number; n4: number
  /** bud size 0..1 and bloom openness 0..1 */ bud: number; open: number
  /** outlines of branches still to grow */ ghost: number
  /** how many leaves drift down, 0..1 */ fall: number
  /** camera: frame height, look-at height, elevation (deg), yaw (rad) */ fh: number; ly: number; el: number; yaw: number
  /** chapter as a float 0..5, for labels in the scene */ c: number
}

export const SPRIG_START: SprigState = { g: 0.36, n1: 0.75, n2: 0, n3: 0, n4: 0, bud: 0.15, open: 0, ghost: 0, fall: 0.25, fh: 3.0, ly: 1.3, el: 14, yaw: -0.4, c: 0 }

// One pose per chapter after the hero: about, how, drac, next, hello
export const SPRIG_POSES: Omit<SprigState, 'c'>[] = [
  { g: 0.6, n1: 1, n2: 0.9, n3: 0, n4: 0, bud: 0.35, open: 0, ghost: 0, fall: 0.3, fh: 3.1, ly: 1.6, el: 11, yaw: 0.2 },
  { g: 0.84, n1: 1, n2: 1, n3: 1, n4: 0.4, bud: 0.6, open: 0, ghost: 0, fall: 0.45, fh: 3.8, ly: 2.0, el: 9, yaw: 0.7 },
  { g: 1, n1: 1, n2: 1, n3: 1, n4: 1, bud: 1, open: 1, ghost: 0, fall: 0.7, fh: 2.0, ly: 3.45, el: 8, yaw: -0.15 },
  { g: 1, n1: 1, n2: 1, n3: 1, n4: 1, bud: 1, open: 1, ghost: 1, fall: 0.5, fh: 4.9, ly: 2.2, el: 15, yaw: 0.45 },
  { g: 1, n1: 1, n2: 1, n3: 1, n4: 1, bud: 1, open: 1, ghost: 0.35, fall: 0.6, fh: 4.5, ly: 2.2, el: 10, yaw: 0.05 },
]
