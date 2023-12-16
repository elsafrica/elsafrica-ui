import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Packages',
  description: 'List all packages created on the system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
