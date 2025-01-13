'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import CategoriesNav from './CategoriesNav';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
}

export default function MainLayout({ children, onSearch, onCategoryChange }: MainLayoutProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const pathname = usePathname();
  const isArticlePage = pathname.startsWith('/articles/');

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <div className="min-h-screen bg-[rgb(26,26,26)]">
      <div className="sticky top-0 z-10 bg-[rgb(18,18,18)]">
        <Header onSearch={onSearch} showSearch={!isArticlePage} />
        {!isArticlePage && (
          <CategoriesNav
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </div>
      <main className="pt-16">
        <div className="container mx-auto px-4">
          <div className="mt-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
