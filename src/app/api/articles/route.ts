import { NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/markdown';

export async function GET() {
  const articles = getAllArticles();
  return NextResponse.json(articles);
}
