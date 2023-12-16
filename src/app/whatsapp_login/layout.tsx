import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WhatsApp Services',
  description: 'Services entailing whatsapp messaging',
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
