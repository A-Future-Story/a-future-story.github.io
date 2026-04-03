import type { Metadata } from 'next'
import { serif, sans } from '@/lib/fonts'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/Navbar'
import SideVines from '@/components/SideVines'
import FloatingCreatures from '@/components/FloatingCreatures'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skynift — Intelligence that grows with you',
  description: 'AI-powered products for customer service, ad campaigns, and business automation. Home of Helpexa and Drac AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>
          <Navbar />
          <SideVines />
          <FloatingCreatures />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
