import { promises as fs } from 'fs'
import path from 'path'
import MarkdownRenderer from '@/components/markdown-renderer'
import { parseMarkdown } from '@/lib/markdown'

export const metadata = {
  title: 'Müzəffər Eyvazov',
}

export default async function Page() {
  const filePath = path.join(process.cwd(), 'app', '_contents', 'home.md')
  const fileContent = await fs.readFile(filePath, 'utf8')
  const { metadata: frontmatter, markdownContent } = parseMarkdown(fileContent)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{frontmatter.title}</h1>
      <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
    </div>
  )
}
