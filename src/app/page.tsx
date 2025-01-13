'use client';

import { useState, useEffect } from 'react';
import MainLayout from './components/MainLayout';
import ArticleList from './components/ArticleList';
import { getArticles } from './api/articles';
import { type Article } from '@/utils/markdown';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      onSearch={setSearchQuery}
      onCategoryChange={setActiveCategory}
    >
      <ArticleList
        initialArticles={articles}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />
    </MainLayout>
  );
}
