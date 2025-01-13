'use client';

import Link from 'next/link';
import { Search, LineChart } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ onSearch, showSearch = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[rgb(26,26,26)]">
      <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-3xl font-semibold text-white hover:opacity-90 transition-opacity">
          <LineChart className="h-8 w-8" />
          <span>Greekonomics</span>
        </Link>

        {/* Search */}
        {showSearch && (
          <div className="w-72">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Greekonomics"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[rgb(26,26,26)] border border-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
