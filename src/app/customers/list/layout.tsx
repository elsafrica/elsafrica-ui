import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Accounts',
  description: 'Accounts of all customers registered',
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
