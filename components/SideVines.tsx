'use client'

/**
 * Persistent creeper vines running down both sides of the page.
 * Features actual leaf shapes, tendrils, and flower buds.
 */
export default function SideVines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Left creeper vine */}
      <svg
        className="absolute left-0 top-0 w-[160px] h-full opacity-[0.22]"
        viewBox="0 0 160 2000"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Main thick stem */}
        <path
          d="M 80 0 C 60 60 90 120 50 200 S 100 350 60 450 S 40 550 90 650 S 50 750 70 850 S 100 950 50 1050 S 40 1150 80 1250 S 60 1350 90 1450 S 50 1550 70 1650 S 100 1750 60 1850 S 50 1950 80 2000"
          stroke="rgba(139, 157, 119, 1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Secondary thinner vine intertwining */}
        <path
          d="M 70 20 C 90 80 50 150 80 250 S 40 400 70 500 S 100 600 60 700 S 80 800 50 900 S 70 1000 90 1100 S 50 1200 70 1300 S 90 1400 60 1500 S 40 1600 80 1700 S 60 1800 70 1900"
          stroke="rgba(139, 157, 119, 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Leaf shapes — actual leaf SVG paths, not circles */}
        {/* Leaf at y=180 */}
        <path d="M 55 180 C 35 165 25 170 30 185 C 35 200 55 195 55 180 Z" fill="rgba(139, 157, 119, 0.6)" />
        <line x1="55" y1="180" x2="32" y2="182" stroke="rgba(139, 157, 119, 0.3)" strokeWidth="0.5" />

        {/* Leaf at y=350 */}
        <path d="M 85 350 C 105 335 115 340 110 355 C 105 370 85 365 85 350 Z" fill="rgba(139, 157, 119, 0.5)" />
        <line x1="85" y1="350" x2="108" y2="352" stroke="rgba(139, 157, 119, 0.3)" strokeWidth="0.5" />

        {/* Leaf at y=500 */}
        <path d="M 65 500 C 40 485 30 490 38 508 C 46 526 65 518 65 500 Z" fill="rgba(196, 112, 110, 0.4)" />

        {/* Tendril curl at y=600 */}
        <path d="M 88 620 C 100 610 110 615 108 625 C 106 635 95 630 100 620" stroke="rgba(139, 157, 119, 0.4)" strokeWidth="1" fill="none" />

        {/* Leaf at y=700 */}
        <path d="M 50 700 C 25 685 15 692 25 710 C 35 728 50 718 50 700 Z" fill="rgba(139, 157, 119, 0.55)" />
        <line x1="50" y1="700" x2="28" y2="705" stroke="rgba(139, 157, 119, 0.3)" strokeWidth="0.5" />

        {/* Small flower bud at y=850 */}
        <circle cx="70" cy="845" r="5" fill="rgba(196, 112, 110, 0.35)" />
        <circle cx="65" cy="840" r="3" fill="rgba(196, 112, 110, 0.25)" />
        <circle cx="75" cy="842" r="3" fill="rgba(196, 112, 110, 0.25)" />

        {/* Leaf at y=950 */}
        <path d="M 55 950 C 30 935 20 942 30 960 C 40 978 55 968 55 950 Z" fill="rgba(139, 157, 119, 0.5)" />

        {/* Tendril curl at y=1050 */}
        <path d="M 82 1050 C 95 1040 105 1045 102 1055 C 99 1065 88 1058 92 1048" stroke="rgba(139, 157, 119, 0.4)" strokeWidth="1" fill="none" />

        {/* Leaf at y=1200 */}
        <path d="M 78 1200 C 100 1185 110 1192 102 1210 C 94 1228 78 1218 78 1200 Z" fill="rgba(212, 168, 67, 0.4)" />
        <line x1="78" y1="1200" x2="100" y2="1205" stroke="rgba(212, 168, 67, 0.2)" strokeWidth="0.5" />

        {/* Leaf at y=1400 */}
        <path d="M 60 1400 C 35 1385 25 1392 35 1410 C 45 1428 60 1418 60 1400 Z" fill="rgba(139, 157, 119, 0.5)" />

        {/* Flower bud at y=1550 */}
        <circle cx="75" cy="1545" r="6" fill="rgba(212, 168, 67, 0.3)" />
        <circle cx="68" cy="1540" r="3.5" fill="rgba(212, 168, 67, 0.2)" />
        <circle cx="80" cy="1540" r="3.5" fill="rgba(212, 168, 67, 0.2)" />

        {/* Leaf at y=1700 */}
        <path d="M 70 1700 C 45 1685 35 1692 45 1710 C 55 1728 70 1718 70 1700 Z" fill="rgba(139, 157, 119, 0.55)" />
        <line x1="70" y1="1700" x2="48" y2="1705" stroke="rgba(139, 157, 119, 0.3)" strokeWidth="0.5" />

        {/* Leaf at y=1900 */}
        <path d="M 60 1900 C 80 1885 90 1892 82 1910 C 74 1928 60 1918 60 1900 Z" fill="rgba(196, 112, 110, 0.4)" />
      </svg>

      {/* Right creeper vine — mirrored */}
      <svg
        className="absolute right-0 top-0 w-[160px] h-full opacity-[0.22]"
        viewBox="0 0 160 2000"
        fill="none"
        preserveAspectRatio="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        {/* Main thick stem */}
        <path
          d="M 80 30 C 60 90 90 160 50 250 S 100 380 60 480 S 40 590 90 690 S 50 790 70 890 S 100 990 50 1090 S 40 1190 80 1290 S 60 1390 90 1490 S 50 1590 70 1690 S 100 1790 60 1890 S 50 1950 80 2000"
          stroke="rgba(196, 112, 110, 0.8)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Secondary vine */}
        <path
          d="M 70 50 C 90 110 50 190 80 290 S 40 430 70 540 S 100 640 60 740 S 80 840 50 940 S 70 1040 90 1140 S 50 1240 70 1340 S 90 1440 60 1540 S 40 1640 80 1740 S 60 1840 70 1940"
          stroke="rgba(196, 112, 110, 0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Leaves — rose-colored theme */}
        <path d="M 55 230 C 35 215 25 222 33 240 C 41 258 55 248 55 230 Z" fill="rgba(196, 112, 110, 0.5)" />
        <line x1="55" y1="230" x2="35" y2="235" stroke="rgba(196, 112, 110, 0.25)" strokeWidth="0.5" />

        <path d="M 85 420 C 105 405 115 412 107 430 C 99 448 85 438 85 420 Z" fill="rgba(196, 112, 110, 0.45)" />

        <path d="M 50 600 C 25 585 18 592 28 610 C 38 628 50 618 50 600 Z" fill="rgba(212, 168, 67, 0.4)" />
        <line x1="50" y1="600" x2="30" y2="604" stroke="rgba(212, 168, 67, 0.2)" strokeWidth="0.5" />

        {/* Tendril */}
        <path d="M 88 750 C 100 740 110 745 108 755 C 106 765 95 760 100 750" stroke="rgba(196, 112, 110, 0.35)" strokeWidth="1" fill="none" />

        <path d="M 60 880 C 35 865 25 872 35 890 C 45 908 60 898 60 880 Z" fill="rgba(196, 112, 110, 0.5)" />

        {/* Flower bud */}
        <circle cx="72" cy="1020" r="5" fill="rgba(139, 157, 119, 0.35)" />
        <circle cx="66" cy="1015" r="3" fill="rgba(139, 157, 119, 0.25)" />
        <circle cx="78" cy="1017" r="3" fill="rgba(139, 157, 119, 0.25)" />

        <path d="M 80 1180 C 100 1165 110 1172 102 1190 C 94 1208 80 1198 80 1180 Z" fill="rgba(196, 112, 110, 0.45)" />
        <line x1="80" y1="1180" x2="98" y2="1185" stroke="rgba(196, 112, 110, 0.25)" strokeWidth="0.5" />

        <path d="M 55 1380 C 30 1365 22 1372 32 1390 C 42 1408 55 1398 55 1380 Z" fill="rgba(212, 168, 67, 0.4)" />

        {/* Flower bud */}
        <circle cx="68" cy="1550" r="6" fill="rgba(196, 112, 110, 0.3)" />
        <circle cx="62" cy="1544" r="3.5" fill="rgba(196, 112, 110, 0.2)" />
        <circle cx="75" cy="1546" r="3.5" fill="rgba(196, 112, 110, 0.2)" />

        <path d="M 70 1720 C 45 1705 38 1712 48 1730 C 58 1748 70 1738 70 1720 Z" fill="rgba(139, 157, 119, 0.5)" />
        <line x1="70" y1="1720" x2="50" y2="1725" stroke="rgba(139, 157, 119, 0.25)" strokeWidth="0.5" />

        <path d="M 60 1900 C 80 1885 90 1892 82 1910 C 74 1928 60 1918 60 1900 Z" fill="rgba(196, 112, 110, 0.45)" />
      </svg>
    </div>
  )
}
