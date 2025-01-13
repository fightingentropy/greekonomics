'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/app/components/MainLayout';
import { type Article } from '@/utils/markdown';

async function getArticle(slug: string): Promise<Article> {
  const response = await fetch(`/api/articles/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  
  return response.json();
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticle(params.slug)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p>The article you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4">
        <div className="card-bg rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-16">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            {article.author.image && (
              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium text-white">
                {article.author.name}
              </div>
              <div className="text-gray-400">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 text-sm font-medium text-blue-400 card-bg rounded-full">
                #{article.category}
              </span>
            </div>
          </div>

          <div className="text-lg text-gray-400 mb-24">
            {article.description}
          </div>

          <div 
            className="prose prose-lg prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:mb-6 prose-p:text-gray-400
              prose-li:marker:text-blue-500
              prose-a:text-blue-500 hover:prose-a:text-blue-600
              prose-strong:text-gray-900 prose-strong:dark:text-white
              prose-blockquote:border-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>
      </article>
    </MainLayout>
  );
}
