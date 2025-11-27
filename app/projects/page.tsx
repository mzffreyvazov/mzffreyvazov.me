import { promises as fs } from 'fs'
import path from 'path'
import MarkdownRenderer from '@/components/markdown-renderer'
import { parseMarkdown } from '@/lib/markdown'

export const metadata = {
  title: 'Projects',
}

export default async function Page() {
  const filePath = path.join(process.cwd(), 'app', '_contents', 'projects.md')
  const fileContent = await fs.readFile(filePath, 'utf8')
  const { markdownContent } = parseMarkdown(fileContent)

  return <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
}
