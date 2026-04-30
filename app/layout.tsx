import type { Metadata } from 'next'
import Script from 'next/script'
import { serif, sans } from '@/lib/fonts'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/Navbar'
import FloatingCreatures from '@/components/FloatingCreatures'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skynift — Intelligence that grows with you',
  description: 'AI-powered products for customer service, ad campaigns, and business automation. Home of Helpexa and Drac AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PZ8VSSR8" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <SmoothScroll>
          <Navbar />
          <FloatingCreatures />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
