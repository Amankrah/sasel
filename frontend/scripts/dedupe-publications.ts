/*
 * CLI wrapper around src/lib/dedupe-publications.ts
 *
 * Usage (from frontend/):
 *   npm run dedupe:publications               # dry run, prints plan
 *   npm run dedupe:publications -- --apply    # commit merges and deletions
 */

import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import { dedupePublications } from '../src/lib/dedupe-publications'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset || !token) {
  console.error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_WRITE_TOKEN.',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

async function run() {
  const apply = process.argv.includes('--apply')
  if (!apply) console.log('DRY RUN. Pass --apply to commit changes.')

  const result = await dedupePublications({ client, apply })
  console.log(JSON.stringify(result, null, 2))
  if (!apply && result.duplicateGroups > 0) {
    console.log('\nRe-run with --apply to commit.')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
