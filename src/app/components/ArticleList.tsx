'use client';

import PostCard from './PostCard';
import { type Article } from '@/utils/markdown';

interface ArticleListProps {
  initialArticles: Article[];
  searchQuery?: string;
  activeCategory?: string;
}

export default function ArticleList({ 
  initialArticles, 
  searchQuery = '', 
  activeCategory = 'all' 
}: ArticleListProps) {  
  const filteredArticles = initialArticles
    .filter(article => {
      if (!searchQuery) return true;
      const searchContent = `${article.title} ${article.description}`.toLowerCase();
      return searchContent.includes(searchQuery.toLowerCase());
    })
    .filter(article => {
      if (activeCategory === 'all') return true;
      const normalizedCategory = article.category.toLowerCase().replace(' ', '-');
      return normalizedCategory === activeCategory;
    });

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4">
      {filteredArticles.map((article) => (
        <PostCard key={article.slug} article={article} />
      ))}
      {filteredArticles.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No articles found. Try a different search term.
        </div>
      )}
    </div>
  );
}
