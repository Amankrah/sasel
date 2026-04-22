import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { syncPublications } from '@/lib/serpapi-sync'

// Vercel Cron hits this endpoint on the schedule defined in vercel.json.
// Also accessible via manual GET with the Authorization header for testing.

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes — SerpAPI round-trips per member can be slow.
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
    const result = await syncPublications({ serpApiKey, client })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
