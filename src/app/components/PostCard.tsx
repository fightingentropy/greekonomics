'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type Article } from '@/utils/markdown';

interface PostCardProps {
  article: Article;
}

export default function PostCard({ article }: PostCardProps) {
  return (
    <Link 
      href={`/articles/${article.slug}`}
      className="block p-6 bg-[rgb(32,32,32)] rounded-3xl hover:bg-[rgb(38,38,38)] transition-colors"
    >
      <article className="space-y-4">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
            {article.title}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {article.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {article.author.image && (
              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium text-white">
                {article.author.name}
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-[rgb(26,26,26)] rounded-full text-sm text-gray-300">
            #{article.category}
          </div>
        </div>
      </article>
    </Link>
  );
}
