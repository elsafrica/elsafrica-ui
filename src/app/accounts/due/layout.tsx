import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Due Accounts',
  description: 'Accounts of due users',
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
