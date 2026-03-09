import { promises as fs } from 'fs'
import path from 'path'
import { parseMarkdown } from '@/lib/markdown'
import { sanityClient } from '@/lib/sanity/client'
import {
  ARTICLES_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  ARTICLE_SLUGS_QUERY,
} from '@/lib/sanity/queries'

export interface ArticleListItem {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
  sort: number
  hidden?: boolean
  chinese?: boolean
}

export interface ArticlePageData extends ArticleListItem {
  body: string
}

interface SanityArticle {
  slug: string
  title: string
  date?: string
  description?: string
  tags?: string[]
  hidden?: boolean
  chinese?: boolean
  body?: string
}

const articlesDirectory = path.join(process.cwd(), 'app', 'thoughts', '_articles')

function formatDisplayDate(date?: string) {
  if (!date) return '-'
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.replaceAll('-', '.')
  }
  return date
}

function getSortValue(date?: string) {
  if (!date) return 0
  return Number(date.replaceAll('.', '').replaceAll('-', ''))
}

function mapSanityArticle(article: SanityArticle): ArticleListItem {
  const date = formatDisplayDate(article.date)

  return {
    slug: article.slug,
    title: article.title,
    date,
    description: article.description || '',
    tags: article.tags || [],
    sort: getSortValue(date),
    hidden: article.hidden || false,
    chinese: article.chinese || false,
  }
}

function mapSanityArticlePage(article: SanityArticle): ArticlePageData | null {
  if (!article.body) return null

  return {
    ...mapSanityArticle(article),
    body: article.body,
  }
}

async function listMarkdownFilenames() {
  return fs.readdir(articlesDirectory)
}

async function getMarkdownArticleBySlug(slug: string): Promise<ArticlePageData | null> {
  const mdFilePath = path.join(articlesDirectory, `${slug}.md`)

  try {
    const fileContent = await fs.readFile(mdFilePath, 'utf8')
    const parsed = parseMarkdown(fileContent)
    const date = parsed.metadata.date || '-'

    return {
      slug,
      title: parsed.metadata.title,
      date,
      description: parsed.metadata.description || '',
      tags: parsed.metadata.tags || [],
      sort: getSortValue(date),
      hidden: parsed.metadata.hidden || false,
      chinese: parsed.metadata.chinese || false,
      body: parsed.markdownContent,
    }
  } catch {
    return null
  }
}

async function getMarkdownArticles(): Promise<ArticleListItem[]> {
  const articles = await listMarkdownFilenames()
  const items: ArticleListItem[] = []
  const processedSlugs = new Set<string>()

  for (const article of articles) {
    if (!article.endsWith('.md')) continue

    const slug = article.replace(/\.md$/, '')

    if (processedSlugs.has(slug)) continue

    const page = await getMarkdownArticleBySlug(slug)
    processedSlugs.add(slug)

    if (!page || page.hidden) continue

    items.push({
      slug: page.slug,
      title: page.title,
      date: page.date,
      description: page.description,
      tags: page.tags,
      sort: page.sort,
      hidden: page.hidden,
      chinese: page.chinese,
    })
  }

  items.sort((left, right) => right.sort - left.sort)
  return items
}

async function getSanityArticles(): Promise<ArticleListItem[]> {
  try {
    const articles = await sanityClient.fetch<SanityArticle[]>(ARTICLES_QUERY)
    return articles.map(mapSanityArticle)
  } catch {
    return []
  }
}

async function getSanityArticleBySlug(slug: string): Promise<ArticlePageData | null> {
  try {
    const article = await sanityClient.fetch<SanityArticle | null>(ARTICLE_BY_SLUG_QUERY, { slug })
    if (!article) return null
    return mapSanityArticlePage(article)
  } catch {
    return null
  }
}

async function getSanitySlugs(): Promise<string[]> {
  try {
    const entries = await sanityClient.fetch<Array<{ slug?: string }>>(ARTICLE_SLUGS_QUERY)
    return entries.map((entry) => entry.slug).filter(Boolean) as string[]
  } catch {
    return []
  }
}

export async function getAllArticles() {
  const [markdownArticles, sanityArticles] = await Promise.all([
    getMarkdownArticles(),
    getSanityArticles(),
  ])

  const merged = new Map<string, ArticleListItem>()

  for (const article of markdownArticles) {
    merged.set(article.slug, article)
  }

  for (const article of sanityArticles) {
    merged.set(article.slug, article)
  }

  return [...merged.values()].sort((left, right) => right.sort - left.sort)
}

export async function getArticleBySlug(slug: string) {
  const sanityArticle = await getSanityArticleBySlug(slug)
  if (sanityArticle && !sanityArticle.hidden) return sanityArticle
  return getMarkdownArticleBySlug(slug)
}

export async function getAllArticleSlugs() {
  const [markdownArticles, sanitySlugs] = await Promise.all([
    getMarkdownArticles(),
    getSanitySlugs(),
  ])

  const slugs = new Set<string>()

  for (const article of markdownArticles) {
    slugs.add(article.slug)
  }

  for (const slug of sanitySlugs) {
    slugs.add(slug)
  }

  return [...slugs]
}