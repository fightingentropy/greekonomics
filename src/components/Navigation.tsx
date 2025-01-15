'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e2029] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              Greekonomics
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              href="/tweets" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/tweets' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Tweets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
