import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users List',
  description: 'List of users currently using the system',
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
