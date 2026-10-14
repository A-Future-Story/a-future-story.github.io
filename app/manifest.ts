import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skynift',
    short_name: 'Skynift',
    description: 'Skynift builds AI that takes a real job off a business’s hands, and stays easy to understand while it does it.',
    start_url: '/',
    display: 'browser',
    background_color: '#faf7f2',
    theme_color: '#faf7f2',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
