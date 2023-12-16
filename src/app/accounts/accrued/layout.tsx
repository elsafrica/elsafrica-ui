import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accrued Accounts',
  description: 'Accounts of accrued users',
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
