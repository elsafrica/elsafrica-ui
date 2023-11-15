import type { Metadata } from 'next'
import './globals.css'
import Themify from './providers/theme'
import QueryProvider from './providers/react-query'
import ContextProvider from './providers/context'

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
      <ContextProvider>
        <QueryProvider>
          <Themify>
            <body>{children}</body>
          </Themify>
        </QueryProvider>
      </ContextProvider>
    </html>
  )
}
