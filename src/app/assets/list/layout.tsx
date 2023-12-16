import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assets List',
  description: 'List of assets currently deployed',
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
