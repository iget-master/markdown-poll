import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Markdown Poll',
  description: 'Embed polls in markdown in 1 minute!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 min-h-screen">
              {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
              <div className="mx-auto max-w-3xl">{children}</div>
          </div>
      </body>
    </html>
  )
}
