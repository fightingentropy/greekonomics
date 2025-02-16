'use client';

import Link from 'next/link';
import { Search, LineChart, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSearch } from '../context/SearchContext';
import { useState } from 'react';

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = true }: HeaderProps) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[rgb(26,26,26)]">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-white hover:opacity-90 transition-opacity">
          <LineChart className="h-6 w-6" />
          <span>Greekonomics</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-white hover:bg-gray-700 rounded-md"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link 
              href="/markets" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/markets' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Markets
            </Link>
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
            <Link 
              href="/news" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/news' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              News
            </Link>
            <Link 
              href="/mindmap" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/mindmap' 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Mindmap
            </Link>
          </nav>

          {/* Search - Desktop */}
          {showSearch && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Greekonomics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          lg:hidden fixed inset-0 bg-[rgb(26,26,26)] z-50 transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-white" onClick={() => setIsMenuOpen(false)}>
                <LineChart className="h-6 w-6" />
                <span>Greekonomics</span>
              </Link>
              <button 
                className="p-2 text-white hover:bg-gray-700 rounded-md"
                onClick={toggleMenu}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            {showSearch && (
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search Greekonomics"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col p-4">
              <Link 
                href="/markets" 
                className={`px-4 py-3 rounded-md text-sm font-medium mb-2 ${
                  pathname === '/markets' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Markets
              </Link>
              <Link 
                href="/tweets" 
                className={`px-4 py-3 rounded-md text-sm font-medium mb-2 ${
                  pathname === '/tweets' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tweets
              </Link>
              <Link 
                href="/news" 
                className={`px-4 py-3 rounded-md text-sm font-medium mb-2 ${
                  pathname === '/news' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link 
                href="/mindmap" 
                className={`px-4 py-3 rounded-md text-sm font-medium mb-2 ${
                  pathname === '/mindmap' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mindmap
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
