import { defineConfig, isDev } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || import.meta.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing Sanity Studio environment variables')
}

export default defineConfig({
  name: 'default',
  title:
    process.env.SANITY_STUDIO_PROJECT_TITLE ||
    import.meta.env.SANITY_STUDIO_PROJECT_TITLE ||
    'Content Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: isDev ? [structureTool(), visionTool()] : [structureTool()],
  schema: {
    types: schemaTypes,
  },
})