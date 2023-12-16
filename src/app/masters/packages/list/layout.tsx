import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Package',
  description: 'Create a package to be used when onboarding users',
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
