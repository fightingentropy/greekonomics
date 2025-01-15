'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  body: string;
  categories: string[];
  url: string;
  imageurl: string;
  published_on: number;
  source: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data.Data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Error fetching news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();

    // Fetch news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1e2029] rounded-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e2029] rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
          >
            <div className="relative w-full h-48">
              <Image
                src={item.imageurl}
                alt={item.title}
                fill
                className="object-cover"
                priority={index < 3} // Prioritize first three images (above the fold)
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {item.body.slice(0, 150)}...
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{item.source}</span>
                <span>
                  {new Date(item.published_on * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
