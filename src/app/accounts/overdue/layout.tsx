import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Overdue Accounts',
  description: 'Accounts of overdue users',
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
