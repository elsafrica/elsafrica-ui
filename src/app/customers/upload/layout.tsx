import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upload users',
  description: 'Upload users from a CSV file',
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
