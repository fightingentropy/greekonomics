import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Greekonomics',
  description: 'Your guide to finance and economics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[rgb(26,26,26)] dark-theme">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
        />
      </head>
      <body className={`${inter.className} main-body bg-[rgb(26,26,26)] text-gray-50`}>
        {children}
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2025 Greekonomics. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
