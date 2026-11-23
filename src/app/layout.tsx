import type { Metadata, Viewport } from 'next'
import { Navbar } from '@/components/Layout'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Monaarchx — Trading Journal & Analytics',
  description: 'Journal your trades, track win rate, and discover the best pairs for your strategy.',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}
