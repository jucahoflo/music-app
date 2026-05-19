import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Menu from '@/components/Menu'
import VisitTracker from '@/components/VisitTracker'
import SyncManager from '@/components/SyncManager'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MUSIC - Tu Biblioteca Musical',
  description: 'Reproduce música y letras organizadas por géneros',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes',
  themeColor: '#1a1a2e',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MUSIC',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <SyncManager />
        <VisitTracker />
        <Menu />
        <div className="lg:pl-64">
          {children}
        </div>
      </body>
    </html>
  )
}
