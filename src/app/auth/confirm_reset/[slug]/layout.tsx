import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confirm Reset',
  description: 'Confirm your password reset',
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
