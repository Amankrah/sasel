/*
 * Manual publication sync. Mirrors the Vercel Cron route handler, but runs
 * locally so the first-time sync can be done before the cron is deployed.
 *
 * Usage (from frontend/):
 *   npm run sync:publications
 *
 * Requires in frontend/.env.local:
 *   SERPAPI_KEY
 *   SANITY_WRITE_TOKEN
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 */

import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { syncPublications } from '../src/lib/serpapi-sync'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const serpApiKey = process.env.SERPAPI_KEY
const writeToken = process.env.SANITY_WRITE_TOKEN
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

const missing: string[] = []
if (!serpApiKey) missing.push('SERPAPI_KEY')
if (!writeToken) missing.push('SANITY_WRITE_TOKEN')
if (!projectId) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) missing.push('NEXT_PUBLIC_SANITY_DATASET')

if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`)
  console.error('Add them to frontend/.env.local and retry.')
  process.exit(1)
}

const client = createClient({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  token: writeToken,
  useCdn: false,
})

async function run() {
  console.log('Syncing Google Scholar publications → Sanity…')
  const result = await syncPublications({ serpApiKey: serpApiKey!, client })
  console.log(JSON.stringify(result, null, 2))
  if (result.errors.length > 0) process.exitCode = 1
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
