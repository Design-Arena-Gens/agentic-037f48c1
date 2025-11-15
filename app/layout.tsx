import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TaskFlow ? Personal Task Dashboard',
  description: 'Modern personal task dashboard with categories, progress, scores, and calendar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
