'use client';

import React from 'react'
import { Inter } from 'next/font/google'
import Header from './Header'
import { SearchProvider } from '../context/SearchContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchProvider>
      <body className={`${inter.className} main-body bg-[rgb(26,26,26)] text-gray-50 relative`.trim()}>
        <Header />
        <main>
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2025 Greekonomics. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </SearchProvider>
  );
}
