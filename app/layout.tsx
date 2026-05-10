import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Menu from '@/components/Menu'
import VisitTracker from '@/components/VisitTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MUSIC - Organizador Musical',
  description: 'Organiza tu biblioteca musical por géneros',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <VisitTracker />
        <Menu />
        <div className="lg:pl-64">
          {children}
        </div>
      </body>
    </html>
  )
}
