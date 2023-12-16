import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Account',
  description: 'Create a new account for a user',
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
