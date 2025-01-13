import { type Article } from '@/utils/markdown';

let cachedArticles: Article[] | null = null;

export async function getArticles(): Promise<Article[]> {
  if (cachedArticles) return cachedArticles;
  
  const response = await fetch('/api/articles', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  
  const articles = await response.json();
  cachedArticles = articles;
  return articles;
}
