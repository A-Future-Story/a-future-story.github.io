#!/usr/bin/env python3
"""Generate the Skynift logo family: the growing i.

The letters are Cormorant Garamond 600 outlines (from the Skynift design system).
The sprig over the i is drawn here: a tapered stem that grows out of the i, three
alternate leaf pairs (sage, rose, sage from the bottom up) and a turmeric bud.

Run: python3 scripts/brand/gen-logo.py   (writes into public/brand/)
"""
import math
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'public', 'brand')
SRC = os.path.join(ROOT, 'scripts', 'brand', 'source-letters.svg')

PALETTES = {
    'light': dict(ink='#2C1810', sage='#8B9D77', rose='#C4706E', bud='#D4A843', vein='#FAF7F2', vein_op=0.45),
    'dark': dict(ink='#F0E8D8', sage='#A9BB95', rose='#E39E9B', bud='#E5BF5E', vein='#141210', vein_op=0.3),
    'mono': dict(ink='#2C1810', sage='#2C1810', rose='#2C1810', bud='#2C1810', vein=None, vein_op=0),
    'mono-cream': dict(ink='#F0E8D8', sage='#F0E8D8', rose='#F0E8D8', bud='#F0E8D8', vein=None, vein_op=0),
}


def f(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')


def stem_path(x0, y0, y1, w0, w1, sway):
    """A tapered stem from (x0, y0) up to y1, with a gentle S-curve."""
    n = 24
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        y = y0 + (y1 - y0) * t
        x = x0 + sway * math.sin(t * math.pi * 1.15) * (1 - 0.25 * t)
        w = (w0 + (w1 - w0) * (t ** 0.85)) / 2
        left.append((x - w, y))
        right.append((x + w, y))
    pts = left + right[::-1]
    d = 'M' + ' L'.join(f'{f(x)},{f(y)}' for x, y in pts)
    # round tip
    return d + 'Z'


def stem_x(x0, y0, y1, sway, y):
    t = (y - y0) / (y1 - y0)
    return x0 + sway * math.sin(t * math.pi * 1.15) * (1 - 0.25 * t)


def leaf(bx, by, ang, length, width):
    """An almond leaf from base (bx, by), pointing at `ang` degrees (0 = right, 90 = up)."""
    a = math.radians(ang)
    dx, dy = math.cos(a), -math.sin(a)          # along the leaf (svg y is down)
    nx, ny = -dy, dx                              # normal
    if ang > 90:                                  # keep the fuller edge on the upper side
        nx, ny = -nx, -ny
    tx, ty = bx + dx * length, by + dy * length

    def p(u, v):
        return bx + dx * length * u + nx * width * v, by + dy * length * u + ny * width * v

    c1, c2 = p(0.22, 1.05), p(0.72, 0.95)
    c3, c4 = p(0.70, -0.70), p(0.25, -0.80)
    body = (f'M{f(bx)},{f(by)} C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(tx)},{f(ty)} '
            f'C{f(c3[0])},{f(c3[1])} {f(c4[0])},{f(c4[1])} {f(bx)},{f(by)}Z')
    v0, v1 = p(0.12, 0.05), p(0.82, 0.08)
    vm = p(0.45, 0.14)
    vein = f'M{f(v0[0])},{f(v0[1])} Q{f(vm[0])},{f(vm[1])} {f(v1[0])},{f(v1[1])}'
    return body, vein


def bud(cx, cy, w, h):
    """A closed turmeric bud: a teardrop standing on (cx, cy)."""
    return (f'M{f(cx)},{f(cy)} C{f(cx + w * 0.75)},{f(cy - h * 0.18)} {f(cx + w * 0.62)},{f(cy - h * 0.82)} {f(cx)},{f(cy - h)} '
            f'C{f(cx - w * 0.62)},{f(cy - h * 0.82)} {f(cx - w * 0.75)},{f(cy - h * 0.18)} {f(cx)},{f(cy)}Z')


def sprig(x0, base_y, pal, scale=1.0):
    """The sprig in font units, growing up from (x0, base_y)."""
    top = base_y - 520 * scale
    sway = 14 * scale
    out = []
    out.append(f'<path fill="{pal["ink"]}" d="{stem_path(x0, base_y, top, 70 * scale, 20 * scale, sway)}"/>')
    pairs = [  # (height up the stem, length, width, colour)
        (0.17, 185, 56, 'sage'),
        (0.45, 160, 50, 'rose'),
        (0.71, 124, 40, 'sage'),
    ]
    veins = []
    for k, (h, L, W, col) in enumerate(pairs):
        L *= scale
        W *= scale
        yr = base_y - 520 * scale * h
        yl = yr - 34 * scale              # alternate: the left leaf sits a little higher
        xr = stem_x(x0, base_y, top, sway, yr)
        xl = stem_x(x0, base_y, top, sway, yl)
        rise = 36 + k * 9
        for (bx, by, ang) in ((xr, yr, rise), (xl, yl, 180 - rise - 4)):
            body, vein = leaf(bx, by, ang, L, W)
            out.append(f'<path fill="{pal[col]}" d="{body}"/>')
            veins.append(vein)
    if pal['vein']:
        out.append(f'<path fill="none" stroke="{pal["vein"]}" stroke-opacity="{pal["vein_op"]}" '
                   f'stroke-width="{f(7 * scale)}" stroke-linecap="round" d="{" ".join(veins)}"/>')
    # sepals and bud
    tx = stem_x(x0, base_y, top, sway, top)
    sl, _ = leaf(tx, top + 6 * scale, 128, 52 * scale, 20 * scale)
    sr, _ = leaf(tx, top + 6 * scale, 52, 52 * scale, 20 * scale)
    out.append(f'<path fill="{pal["sage"]}" d="{sl} {sr}"/>')
    out.append(f'<path fill="{pal["bud"]}" d="{bud(tx, top + 10 * scale, 76 * scale, 150 * scale)}"/>')
    return out, top + 10 * scale - 150 * scale


def letters():
    src = open(SRC).read()
    return re.findall(r'<path fill="#2C1810" transform="translate\(([\d.]+),0\)" d="([^"]+)"', src)


def wordmark(variant):
    pal = PALETTES[variant]
    glyphs = letters()
    parts = [f'<path fill="{pal["ink"]}" transform="translate({x},0)" d="{d}"/>' for x, d in glyphs]
    # the dotless i is the 5th glyph; its stem is centred at 141.5 in the glyph's own units
    ix = float(glyphs[4][0]) + 141.5
    sp, top = sprig(ix, -360, pal)
    parts += sp
    pad = 24
    x_min, x_max, y_max = -12, 2868, 332
    y_min = top - pad
    vb = [x_min * 0.2, (y_min + 950) * 0.2, (x_max - x_min) * 0.2, (y_max - y_min) * 0.2]
    w, h = vb[2], vb[3]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(f(v) for v in vb)}" width="{round(w)}" height="{round(h)}" '
            f'role="img" aria-label="Skynift"><title>Skynift</title><g transform="scale(0.2)"><g transform="translate(0,950)">'
            + ''.join(parts) + '</g></g></svg>'), (w, h)


def sprig_only(variant):
    pal = PALETTES[variant]
    sp, top = sprig(0, 0, pal)
    # a short stub of stem below the first leaves keeps the mark standing on something
    stub = f'<path fill="{pal["ink"]}" d="M-35,0 L35,0 L35,90 Q0,110 -35,90Z"/>'
    x_min, x_max = -230, 230
    y_min, y_max = top - 16, 110
    vb = [x_min, y_min, x_max - x_min, y_max - y_min]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(f(v) for v in vb)}" width="{round(vb[2] / 6)}" height="{round(vb[3] / 6)}" '
            f'role="img" aria-label="Skynift"><title>Skynift</title>' + stub + ''.join(sp) + '</svg>')


def app_icon(variant):
    """The growing i on a tile: the i glyph plus its sprig."""
    pal = PALETTES['light' if variant == 'light' else 'dark']
    tile = '#F0E8D8' if variant == 'light' else '#2D1B3D'
    glyphs = letters()
    i_d = glyphs[4][1]
    sp, top = sprig(141.5, -360, pal)
    # fit the i (baseline 0, width ~280) and sprig (up to `top`) into the tile with margins
    span = -top
    s = 76 / span
    gx = 50 - 141.5 * s
    gy = 88
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Skynift">'
            f'<title>Skynift</title><rect width="100" height="100" rx="22" fill="{tile}"/>'
            f'<g transform="translate({f(gx)},{gy}) scale({s:.4f})"><path fill="{pal["ink"]}" d="{i_d}"/>' + ''.join(sp) + '</g></svg>')


def main():
    files = {
        'skynift-wordmark-light.svg': wordmark('light')[0],
        'skynift-wordmark-dark.svg': wordmark('dark')[0],
        'skynift-wordmark-mono.svg': wordmark('mono')[0],
        'skynift-wordmark-mono-cream.svg': wordmark('mono-cream')[0],
        'sprig-light.svg': sprig_only('light'),
        'sprig-dark.svg': sprig_only('dark'),
        'sprig-mono.svg': sprig_only('mono'),
        'skynift-app-icon.svg': app_icon('light'),
        'skynift-app-icon-dark.svg': app_icon('dark'),
    }
    for name, svg in files.items():
        with open(os.path.join(OUT, name), 'w') as fh:
            fh.write(svg + '\n')
    w, h = wordmark('light')[1]
    print(f'wrote {len(files)} files; wordmark aspect {w / h:.4f}')


if __name__ == '__main__':
    main()
