import { loadEnvConfig } from '@next/env'
import { defineCliConfig } from 'sanity/cli'

loadEnvConfig(process.cwd())

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing Sanity CLI environment variables')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})