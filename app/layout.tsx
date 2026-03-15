import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fora — Advisor Success Platform',
  description: 'Your journey to Booking #1 starts here.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fora-cream font-body">{children}</body>
    </html>
  )
}
