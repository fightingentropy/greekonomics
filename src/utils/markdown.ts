import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

interface Author {
  name: string;
  image?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: Author;
  content: string;
}

export function renderMarkdown(content: string): string {
  return md.render(content);
}

const articlesDirectory = join(process.cwd(), 'src/content/articles');

export function getAllArticles(): Article[] {
  const fileNames = readdirSync(articlesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      return getArticleBySlug(slug);
    })
    .filter((article): article is Article => article !== undefined)
    .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  try {
    const fullPath = join(articlesDirectory, `${slug}.md`);
    const fileContents = readFileSync(fullPath, 'utf8');
    
    const { data, content } = matter(fileContents);

    // Remove any heading that matches the title
    const titleEscaped = data.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titlePattern = new RegExp(`^#\\s*${titleEscaped}\\s*?\n`, 'm');
    const contentWithoutTitle = content.replace(titlePattern, '');

    return {
      slug,
      title: data.title,
      description: data.description || '',
      date: data.date,
      category: data.category || 'Uncategorized',
      author: {
        name: data.author?.name || 'Anonymous',
        image: data.author?.image
      },
      content: renderMarkdown(contentWithoutTitle.trim())
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return undefined;
  }
}
