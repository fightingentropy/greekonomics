'use client';

import { Inter } from 'next/font/google'
import Header from './Header'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <body className={`${inter.className} main-body bg-[rgb(26,26,26)] text-gray-50 relative`.trim()}>
      <Header onSearch={setSearchQuery} />
      <main>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>&copy; 2025 Greekonomics. All rights reserved.</p>
        </div>
      </footer>
    </body>
  );
}
