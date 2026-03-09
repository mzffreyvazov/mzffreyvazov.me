import process from 'node:process'
import { defineCliConfig } from 'sanity/cli'

for (const envFile of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(envFile)
  } catch {}
}

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