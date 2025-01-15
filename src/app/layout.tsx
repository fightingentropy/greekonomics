import type { Metadata } from 'next'
import './globals.css'
import { CryptoPriceWidget } from '../components/BTCPriceWidget'
import RootLayoutClient from './components/RootLayoutClient'

export const metadata: Metadata = {
  title: {
    default: 'Greekonomics',
    template: '%s | Greekonomics'
  },
  description: 'Your comprehensive guide to finance, cryptocurrency, and economics. Learn about investing, budgeting, and managing your financial future.',
  keywords: ['finance', 'cryptocurrency', 'investing', 'personal finance', 'budgeting', 'economics'],
  authors: [{ name: 'Erlin' }],
  metadataBase: new URL('https://www.greekonomics.org'),
  openGraph: {
    title: 'Greekonomics',
    description: 'Your comprehensive guide to finance, cryptocurrency, and economics',
    url: 'https://www.greekonomics.org',
    siteName: 'Greekonomics',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Greekonomics - Your guide to finance and economics'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greekonomics',
    description: 'Your comprehensive guide to finance, cryptocurrency, and economics',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
        <script 
          async 
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
          strategy="afterInteractive"
        />
      </head>
      <RootLayoutClient>
        <CryptoPriceWidget />
        {children}
      </RootLayoutClient>
    </html>
  )
}
