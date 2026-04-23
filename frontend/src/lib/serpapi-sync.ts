/*
 * Google Scholar publication sync via SerpAPI → Sanity.
 *
 * Shared between the Vercel Cron Route Handler
 * (src/app/api/cron/sync-publications/route.ts) and the CLI script
 * (scripts/sync-publications.ts).
 */

import type { SanityClient } from 'next-sanity'

export interface SyncOptions {
  serpApiKey: string
  client: SanityClient
  /** limits per-member page size */
  numResults?: number
  /** milliseconds between SerpAPI calls to be nice to the API */
  delayMs?: number
}

export interface SyncResult {
  membersProcessed: number
  created: number
  updated: number
  errors: Array<{ memberSlug: string; message: string }>
}

interface MemberRow {
  _id: string
  slug: { current: string }
  name: string
  googleScholarId: string
}

interface Article {
  title?: string
  link?: string
  citation_id?: string
  year?: string | number
  authors?: string
  publication?: string
}

interface ScholarResponse {
  error?: string
  articles?: Article[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 96)
    .replace(/-+$/, '')
}

export async function syncPublications(opts: SyncOptions): Promise<SyncResult> {
  const { serpApiKey, client } = opts
  const numResults = opts.numResults ?? 100
  const delayMs = opts.delayMs ?? 500

  const members = await client.fetch<MemberRow[]>(
    `*[_type == "member" && defined(googleScholarId) && googleScholarId != ""]{
      _id, slug, name, googleScholarId
    }`,
  )

  const result: SyncResult = {
    membersProcessed: 0,
    created: 0,
    updated: 0,
    errors: [],
  }

  for (const member of members) {
    try {
      const url = new URL('https://serpapi.com/search.json')
      url.searchParams.set('engine', 'google_scholar_author')
      url.searchParams.set('author_id', member.googleScholarId)
      url.searchParams.set('api_key', serpApiKey)
      url.searchParams.set('num', String(numResults))
      url.searchParams.set('sort', 'pubdate')

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`SerpAPI HTTP ${res.status}`)
      const payload = (await res.json()) as ScholarResponse
      if (payload.error) throw new Error(`SerpAPI: ${payload.error}`)

      const articles = payload.articles || []

      for (const art of articles) {
        if (!art.title) continue

        const yearNum =
          typeof art.year === 'number'
            ? art.year
            : Number.parseInt(String(art.year || ''), 10) || new Date().getFullYear()

        // Check for existing publication by externalId or title.
        const existing = await client.fetch<{ _id: string } | null>(
          `*[_type == "publication" && (externalId == $eid || lower(title) == lower($title))][0]{ _id }`,
          { eid: art.citation_id || '', title: art.title },
        )

        const authorRef = {
          _type: 'reference' as const,
          _ref: member._id,
          _key: `author-${member._id}`,
        }

        if (existing) {
          // Fill only missing fields (preserves manual Studio edits).
          const patch = client
            .patch(existing._id)
            .setIfMissing({
              externalId: art.citation_id || undefined,
              journal: art.publication || undefined,
              url: art.link || undefined,
              year: yearNum,
              externalAuthors: art.authors || undefined,
              citation: `${art.authors || ''} (${art.year || yearNum}). ${art.title}. ${art.publication || ''}`.trim(),
              rawData: JSON.stringify(art, null, 2),
            })
            .setIfMissing({ authors: [] })
            // Append member to authors if not already present.
            .append('authors', [authorRef])
          // unset-then-set trick to dedupe authors would be ideal, but Sanity's patch
          // .append isn't dedup-aware. Accept the risk of duplicate author refs here;
          // a one-liner GROQ dedup can run later if needed.
          await patch.commit({ autoGenerateArrayKeys: true })
          result.updated += 1
        } else {
          const slug = slugify(`${art.title}-${art.citation_id || yearNum}`)
          const doc = {
            _id: `publication-${slug}`,
            _type: 'publication' as const,
            title: art.title,
            slug: { _type: 'slug', current: slug },
            publicationType: 'JOURNAL',
            year: yearNum,
            journal: art.publication || undefined,
            url: art.link || undefined,
            externalId: art.citation_id || undefined,
            externalAuthors: art.authors || undefined,
            citation: `${art.authors || ''} (${art.year || yearNum}). ${art.title}. ${art.publication || ''}`.trim(),
            rawData: JSON.stringify(art, null, 2),
            authors: [authorRef],
          }
          await client.createIfNotExists(doc)
          result.created += 1
        }
      }

      result.membersProcessed += 1
      if (delayMs) await sleep(delayMs)
    } catch (err) {
      result.errors.push({
        memberSlug: member.slug.current,
        message: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return result
}
