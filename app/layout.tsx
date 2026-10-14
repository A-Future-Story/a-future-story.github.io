import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { serif, sans } from '@/lib/fonts'
import './globals.css'

const TITLE = 'Skynift — Intelligence that grows with you'
const DESCRIPTION = 'Skynift builds AI that takes a real job off a business’s hands, and stays easy to understand while it does it. Home of Drac.'

export const metadata: Metadata = {
  metadataBase: new URL('https://skynift.com'),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  applicationName: 'Skynift',
  authors: [{ name: 'Skynift Private Limited' }],
  openGraph: {
    type: 'website',
    url: 'https://skynift.com',
    siteName: 'Skynift',
    locale: 'en_US',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  appleWebApp: { title: 'Skynift', statusBarStyle: 'default' },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#faf7f2',
}

// Runs before paint: pick the saved theme (else the system's) and mark that JS is on,
// so the scroll film lays out without a flash of the static layout.
const PRE_PAINT = `(function(){var d=document.documentElement;d.classList.add('js');var t;try{t=localStorage.getItem('skynift-theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t;if(t==='dark'){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#141210')}})();`

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Skynift',
  legalName: 'Skynift Private Limited',
  url: 'https://skynift.com',
  logo: 'https://skynift.com/icons/icon-512.png',
  email: 'contact@skynift.com',
  slogan: 'Intelligence that grows with you.',
  brand: { '@type': 'Brand', name: 'Drac', url: 'https://drac.ai' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZ8VSSR8');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PZ8VSSR8" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
        {children}
      </body>
    </html>
  )
}
