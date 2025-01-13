import { NextResponse } from 'next/server';
import { getArticleBySlug, renderMarkdown } from '@/utils/markdown';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return new NextResponse('Article not found', { status: 404 });
  }

  // Render markdown content
  article.content = renderMarkdown(article.content);
  
  return NextResponse.json(article);
}
