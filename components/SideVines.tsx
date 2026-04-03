'use client'

/**
 * Persistent decorative vines running down both sides of the page.
 * These are fixed-position SVG elements that scroll with parallax,
 * giving the feeling of organic growth throughout the entire experience.
 */
export default function SideVines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Left vine */}
      <svg
        className="absolute left-0 top-0 w-[120px] h-full opacity-[0.12]"
        viewBox="0 0 120 2000"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Main stem */}
        <path
          d="M 60 0 C 50 100 70 200 40 300 S 80 500 50 600 S 30 800 70 900 S 40 1100 60 1200 S 80 1400 40 1500 S 50 1700 70 1800 S 40 1900 60 2000"
          stroke="rgba(139, 157, 119, 1)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tendrils branching right */}
        <path d="M 50 200 C 70 190 90 200 100 180" stroke="rgba(139, 157, 119, 0.6)" strokeWidth="1.2" fill="none" />
        <path d="M 70 400 C 85 380 100 390 110 370" stroke="rgba(139, 157, 119, 0.5)" strokeWidth="1" fill="none" />
        <path d="M 40 600 C 60 580 85 590 95 570" stroke="rgba(139, 157, 119, 0.6)" strokeWidth="1.2" fill="none" />
        <path d="M 60 800 C 80 790 95 800 105 780" stroke="rgba(139, 157, 119, 0.5)" strokeWidth="1" fill="none" />
        <path d="M 50 1000 C 70 980 90 990 100 970" stroke="rgba(139, 157, 119, 0.6)" strokeWidth="1.2" fill="none" />
        <path d="M 70 1200 C 85 1180 100 1190 110 1170" stroke="rgba(139, 157, 119, 0.5)" strokeWidth="1" fill="none" />
        <path d="M 40 1400 C 60 1380 80 1390 95 1370" stroke="rgba(139, 157, 119, 0.6)" strokeWidth="1.2" fill="none" />
        <path d="M 60 1600 C 80 1580 95 1590 105 1570" stroke="rgba(139, 157, 119, 0.5)" strokeWidth="1" fill="none" />
        <path d="M 50 1800 C 70 1780 90 1790 100 1770" stroke="rgba(139, 157, 119, 0.6)" strokeWidth="1.2" fill="none" />
        {/* Leaf buds */}
        <circle cx="100" cy="178" r="4" fill="rgba(139, 157, 119, 0.5)" />
        <circle cx="95" cy="568" r="5" fill="rgba(196, 112, 110, 0.4)" />
        <circle cx="100" cy="968" r="4" fill="rgba(139, 157, 119, 0.5)" />
        <circle cx="95" cy="1368" r="5" fill="rgba(212, 168, 67, 0.4)" />
        <circle cx="100" cy="1768" r="4" fill="rgba(139, 157, 119, 0.5)" />
        {/* Small clusters */}
        <circle cx="55" cy="150" r="3" fill="rgba(196, 112, 110, 0.3)" />
        <circle cx="45" cy="450" r="3" fill="rgba(139, 157, 119, 0.4)" />
        <circle cx="65" cy="750" r="3" fill="rgba(212, 168, 67, 0.3)" />
        <circle cx="45" cy="1050" r="3" fill="rgba(196, 112, 110, 0.3)" />
        <circle cx="65" cy="1350" r="3" fill="rgba(139, 157, 119, 0.4)" />
        <circle cx="45" cy="1650" r="3" fill="rgba(212, 168, 67, 0.3)" />
        <circle cx="55" cy="1950" r="3" fill="rgba(196, 112, 110, 0.3)" />
      </svg>

      {/* Right vine — mirrored */}
      <svg
        className="absolute right-0 top-0 w-[120px] h-full opacity-[0.12]"
        viewBox="0 0 120 2000"
        fill="none"
        preserveAspectRatio="none"
        style={{ transform: 'scaleX(-1)' }}
      >
        {/* Main stem (same as left, mirrored via scaleX) */}
        <path
          d="M 60 0 C 50 80 70 180 40 280 S 80 450 50 580 S 30 750 70 880 S 40 1050 60 1180 S 80 1350 40 1480 S 50 1650 70 1780 S 40 1880 60 2000"
          stroke="rgba(196, 112, 110, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tendrils */}
        <path d="M 50 180 C 70 170 90 180 100 160" stroke="rgba(196, 112, 110, 0.5)" strokeWidth="1.2" fill="none" />
        <path d="M 70 380 C 85 360 100 370 110 350" stroke="rgba(196, 112, 110, 0.4)" strokeWidth="1" fill="none" />
        <path d="M 40 580 C 60 560 85 570 95 550" stroke="rgba(196, 112, 110, 0.5)" strokeWidth="1.2" fill="none" />
        <path d="M 60 780 C 80 770 95 780 105 760" stroke="rgba(196, 112, 110, 0.4)" strokeWidth="1" fill="none" />
        <path d="M 50 980 C 70 960 90 970 100 950" stroke="rgba(196, 112, 110, 0.5)" strokeWidth="1.2" fill="none" />
        <path d="M 70 1180 C 85 1160 100 1170 110 1150" stroke="rgba(196, 112, 110, 0.4)" strokeWidth="1" fill="none" />
        <path d="M 40 1380 C 60 1360 80 1370 95 1350" stroke="rgba(196, 112, 110, 0.5)" strokeWidth="1.2" fill="none" />
        <path d="M 60 1580 C 80 1560 95 1570 105 1550" stroke="rgba(196, 112, 110, 0.4)" strokeWidth="1" fill="none" />
        <path d="M 50 1780 C 70 1760 90 1770 100 1750" stroke="rgba(196, 112, 110, 0.5)" strokeWidth="1.2" fill="none" />
        {/* Leaf buds */}
        <circle cx="100" cy="158" r="4" fill="rgba(196, 112, 110, 0.4)" />
        <circle cx="95" cy="548" r="5" fill="rgba(212, 168, 67, 0.4)" />
        <circle cx="100" cy="948" r="4" fill="rgba(196, 112, 110, 0.4)" />
        <circle cx="95" cy="1348" r="5" fill="rgba(139, 157, 119, 0.4)" />
        <circle cx="100" cy="1748" r="4" fill="rgba(196, 112, 110, 0.4)" />
        {/* Small clusters */}
        <circle cx="55" cy="100" r="3" fill="rgba(212, 168, 67, 0.3)" />
        <circle cx="45" cy="400" r="3" fill="rgba(196, 112, 110, 0.3)" />
        <circle cx="65" cy="700" r="3" fill="rgba(139, 157, 119, 0.3)" />
        <circle cx="45" cy="1000" r="3" fill="rgba(212, 168, 67, 0.3)" />
        <circle cx="65" cy="1300" r="3" fill="rgba(196, 112, 110, 0.3)" />
        <circle cx="45" cy="1600" r="3" fill="rgba(139, 157, 119, 0.3)" />
        <circle cx="55" cy="1900" r="3" fill="rgba(212, 168, 67, 0.3)" />
      </svg>
    </div>
  )
}
