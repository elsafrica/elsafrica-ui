import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Asset',
  description: 'Create a new asset',
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
