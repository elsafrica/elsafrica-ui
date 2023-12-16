import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suspended Accounts',
  description: 'Accounts of suspended users',
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
