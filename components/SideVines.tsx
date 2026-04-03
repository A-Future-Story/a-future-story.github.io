'use client'

export default function SideVines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden hidden md:block" aria-hidden="true">
      {/* Left ivy creeper */}
      <svg
        className="absolute left-0 top-0 w-[100px] h-full"
        viewBox="0 0 100 2400"
        fill="none"
        preserveAspectRatio="xMinYMin slice"
        style={{ opacity: 0.14 }}
      >
        {/* Main trunk — hugs left edge */}
        <path
          d="M 8 0 C 12 80 6 160 10 240 C 14 320 8 400 12 480 C 16 560 6 640 10 720 C 14 800 8 880 12 960 C 16 1040 6 1120 10 1200 C 14 1280 8 1360 12 1440 C 16 1520 6 1600 10 1680 C 14 1760 8 1840 12 1920 C 16 2000 6 2080 10 2160 C 14 2240 8 2320 12 2400"
          stroke="rgba(87, 107, 71, 1)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Branches reaching inward — organic lengths */}
        <path d="M 10 120 C 20 115 35 118 48 110" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 12 320 C 22 312 40 316 55 308" stroke="rgba(87, 107, 71, 0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 520 C 18 514 30 518 42 510" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 14 700 C 24 694 38 698 52 690" stroke="rgba(87, 107, 71, 0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 10 920 C 22 914 36 918 50 910" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 12 1100 C 24 1094 38 1098 54 1088" stroke="rgba(87, 107, 71, 0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 1320 C 20 1312 34 1316 48 1308" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 14 1500 C 26 1494 40 1498 56 1488" stroke="rgba(87, 107, 71, 0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 10 1720 C 22 1714 36 1718 50 1708" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 12 1900 C 24 1892 40 1896 56 1886" stroke="rgba(87, 107, 71, 0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 2120 C 20 2112 34 2116 50 2106" stroke="rgba(87, 107, 71, 0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Ivy leaves — pointed teardrop shapes at branch tips */}
        <path d="M 48 110 C 58 102 62 108 56 116 C 50 120 46 116 48 110 Z" fill="rgba(87, 107, 71, 0.7)" />
        <path d="M 42 108 C 48 98 54 102 50 112 C 46 118 40 114 42 108 Z" fill="rgba(87, 107, 71, 0.5)" />

        <path d="M 55 308 C 65 300 70 306 64 314 C 58 320 53 314 55 308 Z" fill="rgba(87, 107, 71, 0.6)" />

        <path d="M 42 510 C 52 502 56 508 50 516 C 44 520 40 516 42 510 Z" fill="rgba(87, 107, 71, 0.7)" />
        <path d="M 36 508 C 42 498 48 502 44 512 C 40 518 34 514 36 508 Z" fill="rgba(87, 107, 71, 0.4)" />

        <path d="M 52 690 C 62 682 66 688 60 696 C 54 700 50 696 52 690 Z" fill="rgba(87, 107, 71, 0.6)" />

        <path d="M 50 910 C 60 902 64 908 58 916 C 52 920 48 916 50 910 Z" fill="rgba(87, 107, 71, 0.7)" />
        <path d="M 44 908 C 50 898 56 902 52 912 C 48 918 42 914 44 908 Z" fill="rgba(87, 107, 71, 0.45)" />

        <path d="M 54 1088 C 64 1080 68 1086 62 1094 C 56 1098 52 1094 54 1088 Z" fill="rgba(87, 107, 71, 0.6)" />

        <path d="M 48 1308 C 58 1300 62 1306 56 1314 C 50 1318 46 1314 48 1308 Z" fill="rgba(87, 107, 71, 0.65)" />
        <path d="M 42 1306 C 48 1296 54 1300 50 1310 C 46 1316 40 1312 42 1306 Z" fill="rgba(87, 107, 71, 0.4)" />

        <path d="M 56 1488 C 66 1480 70 1486 64 1494 C 58 1498 54 1494 56 1488 Z" fill="rgba(87, 107, 71, 0.6)" />

        <path d="M 50 1708 C 60 1700 64 1706 58 1714 C 52 1718 48 1714 50 1708 Z" fill="rgba(87, 107, 71, 0.7)" />

        <path d="M 56 1886 C 66 1878 70 1884 64 1892 C 58 1896 54 1892 56 1886 Z" fill="rgba(87, 107, 71, 0.55)" />
        <path d="M 50 1884 C 56 1874 62 1878 58 1888 C 54 1894 48 1890 50 1884 Z" fill="rgba(87, 107, 71, 0.35)" />

        <path d="M 50 2106 C 60 2098 64 2104 58 2112 C 52 2116 48 2112 50 2106 Z" fill="rgba(87, 107, 71, 0.6)" />

        {/* Curling tendrils — thin spirals */}
        <path d="M 10 200 C 18 195 22 200 20 206 C 18 210 14 208 16 203" stroke="rgba(87, 107, 71, 0.4)" strokeWidth="0.8" fill="none" />
        <path d="M 12 600 C 20 595 24 600 22 606 C 20 610 16 608 18 603" stroke="rgba(87, 107, 71, 0.35)" strokeWidth="0.8" fill="none" />
        <path d="M 10 1000 C 18 995 22 1000 20 1006 C 18 1010 14 1008 16 1003" stroke="rgba(87, 107, 71, 0.4)" strokeWidth="0.8" fill="none" />
        <path d="M 12 1400 C 20 1395 24 1400 22 1406 C 20 1410 16 1408 18 1403" stroke="rgba(87, 107, 71, 0.35)" strokeWidth="0.8" fill="none" />
        <path d="M 10 1800 C 18 1795 22 1800 20 1806 C 18 1810 14 1808 16 1803" stroke="rgba(87, 107, 71, 0.4)" strokeWidth="0.8" fill="none" />
      </svg>

      {/* Right ivy creeper — mirrored, slightly different rhythm */}
      <svg
        className="absolute right-0 top-0 w-[100px] h-full"
        viewBox="0 0 100 2400"
        fill="none"
        preserveAspectRatio="xMaxYMin slice"
        style={{ opacity: 0.14, transform: 'scaleX(-1)' }}
      >
        {/* Main trunk */}
        <path
          d="M 8 40 C 12 120 6 200 10 280 C 14 360 8 440 12 520 C 16 600 6 680 10 760 C 14 840 8 920 12 1000 C 16 1080 6 1160 10 1240 C 14 1320 8 1400 12 1480 C 16 1560 6 1640 10 1720 C 14 1800 8 1880 12 1960 C 16 2040 6 2120 10 2200 C 14 2280 8 2360 12 2400"
          stroke="rgba(140, 90, 85, 0.9)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Branches */}
        <path d="M 10 180 C 22 174 36 178 50 168" stroke="rgba(140, 90, 85, 0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M 12 400 C 24 392 40 396 56 386" stroke="rgba(140, 90, 85, 0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 600 C 20 594 34 598 48 588" stroke="rgba(140, 90, 85, 0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M 14 800 C 26 794 40 798 54 788" stroke="rgba(140, 90, 85, 0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 10 1020 C 22 1014 36 1018 52 1008" stroke="rgba(140, 90, 85, 0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M 12 1220 C 24 1212 40 1216 56 1206" stroke="rgba(140, 90, 85, 0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 1440 C 22 1432 36 1436 50 1426" stroke="rgba(140, 90, 85, 0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M 14 1640 C 26 1632 42 1636 58 1626" stroke="rgba(140, 90, 85, 0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 10 1860 C 24 1852 38 1856 52 1846" stroke="rgba(140, 90, 85, 0.6)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M 12 2080 C 24 2072 40 2076 56 2066" stroke="rgba(140, 90, 85, 0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Ivy leaves at branch tips */}
        <path d="M 50 168 C 60 160 64 166 58 174 C 52 178 48 174 50 168 Z" fill="rgba(140, 90, 85, 0.6)" />
        <path d="M 44 166 C 50 156 56 160 52 170 C 48 176 42 172 44 166 Z" fill="rgba(140, 90, 85, 0.4)" />

        <path d="M 56 386 C 66 378 70 384 64 392 C 58 396 54 392 56 386 Z" fill="rgba(140, 90, 85, 0.55)" />

        <path d="M 48 588 C 58 580 62 586 56 594 C 50 598 46 594 48 588 Z" fill="rgba(140, 90, 85, 0.6)" />
        <path d="M 42 586 C 48 576 54 580 50 590 C 46 596 40 592 42 586 Z" fill="rgba(140, 90, 85, 0.35)" />

        <path d="M 54 788 C 64 780 68 786 62 794 C 56 798 52 794 54 788 Z" fill="rgba(140, 90, 85, 0.55)" />

        <path d="M 52 1008 C 62 1000 66 1006 60 1014 C 54 1018 50 1014 52 1008 Z" fill="rgba(140, 90, 85, 0.6)" />

        <path d="M 56 1206 C 66 1198 70 1204 64 1212 C 58 1216 54 1212 56 1206 Z" fill="rgba(140, 90, 85, 0.5)" />
        <path d="M 50 1204 C 56 1194 62 1198 58 1208 C 54 1214 48 1210 50 1204 Z" fill="rgba(140, 90, 85, 0.3)" />

        <path d="M 50 1426 C 60 1418 64 1424 58 1432 C 52 1436 48 1432 50 1426 Z" fill="rgba(140, 90, 85, 0.6)" />

        <path d="M 58 1626 C 68 1618 72 1624 66 1632 C 60 1636 56 1632 58 1626 Z" fill="rgba(140, 90, 85, 0.55)" />

        <path d="M 52 1846 C 62 1838 66 1844 60 1852 C 54 1856 50 1852 52 1846 Z" fill="rgba(140, 90, 85, 0.6)" />
        <path d="M 46 1844 C 52 1834 58 1838 54 1848 C 50 1854 44 1850 46 1844 Z" fill="rgba(140, 90, 85, 0.35)" />

        <path d="M 56 2066 C 66 2058 70 2064 64 2072 C 58 2076 54 2072 56 2066 Z" fill="rgba(140, 90, 85, 0.55)" />

        {/* Tendrils */}
        <path d="M 10 300 C 18 295 22 300 20 306 C 18 310 14 308 16 303" stroke="rgba(140, 90, 85, 0.35)" strokeWidth="0.8" fill="none" />
        <path d="M 12 700 C 20 695 24 700 22 706 C 20 710 16 708 18 703" stroke="rgba(140, 90, 85, 0.3)" strokeWidth="0.8" fill="none" />
        <path d="M 10 1100 C 18 1095 22 1100 20 1106 C 18 1110 14 1108 16 1103" stroke="rgba(140, 90, 85, 0.35)" strokeWidth="0.8" fill="none" />
        <path d="M 12 1540 C 20 1535 24 1540 22 1546 C 20 1550 16 1548 18 1543" stroke="rgba(140, 90, 85, 0.3)" strokeWidth="0.8" fill="none" />
        <path d="M 10 1960 C 18 1955 22 1960 20 1966 C 18 1970 14 1968 16 1963" stroke="rgba(140, 90, 85, 0.35)" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  )
}
