import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing Sanity client environment variables')
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || '2026-03-10',
  useCdn: true,
  perspective: 'published',
})