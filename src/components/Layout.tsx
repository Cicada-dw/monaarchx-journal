import Link from 'next/link'
import React from 'react'

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Journal', href: '/journal' },
  { label: 'Trades', href: '/trades' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Certificate', href: '/certificate' },
]

export function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
              <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
              Monaarchx
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title = 'Monaarchx Journal' }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>}
        <div className="mb-6">{children}</div>
      </main>
    </>
  )
}
