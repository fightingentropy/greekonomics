This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

hh
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Greekonomics Blog

A modern finance blog built with Next.js, focusing on cryptocurrency, investing, and personal finance.

## Publishing Articles

### Article Structure

Articles are written in Markdown format and stored in `src/content/articles/`. Each article needs a frontmatter section with the following fields:

```markdown
---
title: "Your Article Title"
description: "A brief description of your article"
date: "YYYY-MM-DD"
category: "category-name"
author:
  name: "Erlin"
  image: "/images/authors/erlin.jpg"
---

Your article content goes here...
```

### Categories

Available categories:
- crypto
- investing
- personal-finance

### Writing Guidelines

1. **Article Format**
   - Write content in Markdown format
   - Use h2 (`##`) for main sections
   - Add `&nbsp;` between sections for better spacing
   - Don't include the title in the content (it's already in the frontmatter)

2. **File Naming**
   - Use kebab-case for filenames (e.g., `getting-started-with-crypto.md`)
   - Files must have `.md` extension

3. **Images**
   - Store article images in `/public/images/articles/`
   - Reference images using markdown: `![Alt text](/images/articles/your-image.jpg)`

### Publishing Steps

1. Create a new `.md` file in `src/content/articles/`
2. Add the required frontmatter
3. Write your content using Markdown
4. Save the file
5. The article will automatically appear on the site

### Example Article Structure

```markdown
---
title: "Investment Strategies for Beginners"
description: "Learn the fundamental principles of investing"
date: "2025-01-12"
category: "investing"
author:
  name: "Erlin"
  image: "/images/authors/erlin.jpg"
---

Introduction paragraph here...

&nbsp;

## First Section

Content here...

&nbsp;

## Second Section

More content here...
```

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
