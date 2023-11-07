import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Elsafrica Group',
  description: 'Elsafrica systems manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
