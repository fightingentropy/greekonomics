'use client';

import { usePathname } from 'next/navigation';
import CategoriesNav from './CategoriesNav';

interface MainLayoutProps {
  children: React.ReactNode;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function MainLayout({ 
  children, 
  activeCategory = 'all',
  onCategoryChange 
}: MainLayoutProps) {
  const pathname = usePathname();
  const isArticlePage = pathname.startsWith('/articles/');

  return (
    <div className="min-h-screen bg-[rgb(26,26,26)]">
      <div className="sticky top-[80px] z-10 bg-[rgb(18,18,18)]">
        {!isArticlePage && (
          <CategoriesNav
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />
        )}
      </div>
      <main>
        <div className="container mx-auto px-4">
          <div className="mt-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
