import type { Metadata } from 'next'
import './globals.css'
import Themify from './utils/theme'
import QueryProvider from './utils/react-query'

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
      <QueryProvider>
        <Themify>
          <body>{children}</body>
        </Themify>
      </QueryProvider>
    </html>
  )
}
