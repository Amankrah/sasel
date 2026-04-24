import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { syncPublications } from '@/lib/serpapi-sync'
import { dedupePublications } from '@/lib/dedupe-publications'

// Vercel Cron hits this endpoint on the schedule defined in vercel.json.
// Also accessible via manual GET with the Authorization header for testing.
//
// Pipeline:
//   1. Pull fresh Google Scholar results via SerpAPI and upsert into Sanity
//      (setIfMissing so manual Studio edits are preserved).
//   2. Dedupe by externalId || normalized title: merge any duplicates the
//      sync produced back into their canonical doc, repointing references
//      from projects / news / technologies / awards / grants.

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes; SerpAPI round-trips per member can be slow.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const serpApiKey = process.env.SERPAPI_KEY
  const writeToken = process.env.SANITY_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

  if (!cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 },
    )
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!serpApiKey || !writeToken || !projectId || !dataset) {
    return NextResponse.json(
      { error: 'Missing required env vars (SERPAPI_KEY, SANITY_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET)' },
      { status: 500 },
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  })

  try {
    const sync = await syncPublications({ serpApiKey, client })
    const dedupe = await dedupePublications({ client, apply: true })
    return NextResponse.json({ sync, dedupe })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
