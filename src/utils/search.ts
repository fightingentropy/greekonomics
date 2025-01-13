import { Article } from './markdown';

export function searchArticles(articles: Article[], query: string): Article[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return articles;
  
  return articles.filter(article => {
    const searchableText = [
      article.title,
      article.description,
      article.category,
      article.author,
      article.content
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}
