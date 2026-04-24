/*
 * Dedupes publication documents in Sanity.
 *
 * Groups by (externalId || normalized title). For each group with more than
 * one doc, keeps the doc most likely to be canonical (numeric-id form first,
 * then most-complete) and merges the rest into it:
 *   - fields missing on the keeper are filled from the loser
 *   - authors are unioned
 *   - any project / news / technology / award / grant that references the
 *     loser via `relatedPublications` is repointed at the keeper
 *   - loser doc is deleted
 *
 * Used by:
 *   - scripts/dedupe-publications.ts (CLI, --apply flag controls commit)
 *   - src/app/api/cron/sync-publications/route.ts (always applies)
 */

import type { SanityClient } from 'next-sanity'

export interface DedupeOptions {
  client: SanityClient
  /** If false, reports what it would do without writing. Default true. */
  apply?: boolean
}

export interface DedupeResult {
  scanned: number
  duplicateGroups: number
  merged: number
  repointedReferences: number
  deleted: number
}

interface Pub {
  _id: string
  title?: string
  year?: number
  month?: number
  journal?: string
  conference?: string
  publisher?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  citation?: string
  abstract?: string
  externalId?: string
  externalAuthors?: string
  authors?: Array<{ _ref: string; _key?: string }>
  rawData?: string
}

const PUBLICATION_REF_FIELDS: Record<string, string[]> = {
  project: ['relatedPublications'],
  technology: ['relatedPublications'],
  news: ['relatedPublications'],
  award: ['relatedPublications'],
  grant: ['relatedPublications'],
  publication: [],
}

const FILLABLE_FIELDS: Array<keyof Pub> = [
  'journal',
  'conference',
  'publisher',
  'volume',
  'issue',
  'pages',
  'doi',
  'url',
  'citation',
  'abstract',
  'externalId',
  'externalAuthors',
  'rawData',
  'year',
  'month',
]

const normalize = (s: string | undefined) =>
  (s || '').trim().toLowerCase().replace(/\s+/g, ' ')

function scoreCompleteness(p: Pub): number {
  let score = 0
  for (const k of [
    'journal',
    'conference',
    'publisher',
    'volume',
    'issue',
    'pages',
    'doi',
    'url',
    'citation',
    'abstract',
    'externalAuthors',
  ] as const) {
    if (p[k]) score += 1
  }
  score += p.authors?.length || 0
  if (p.externalId) score += 2
  return score
}

function chooseKeeper(group: Pub[]): Pub {
  const numeric = group.filter((p) => /^publication-\d+$/.test(p._id))
  if (numeric.length === 1) return numeric[0]
  const candidates = numeric.length > 0 ? numeric : group
  return [...candidates].sort((a, b) => {
    const sa = scoreCompleteness(a)
    const sb = scoreCompleteness(b)
    if (sa !== sb) return sb - sa
    return a._id.localeCompare(b._id)
  })[0]
}

async function repointReferences(
  client: SanityClient,
  fromId: string,
  toId: string,
): Promise<number> {
  const referrers = await client.fetch<Array<Record<string, unknown>>>(
    `*[references($id)]{ ... }`,
    { id: fromId },
  )
  let patched = 0
  for (const ref of referrers) {
    const refType = String(ref._type)
    const fields = PUBLICATION_REF_FIELDS[refType] ?? []
    const refId = String(ref._id)
    for (const field of fields) {
      const arr = ref[field] as Array<{ _ref?: string; _key?: string }> | undefined
      if (!Array.isArray(arr)) continue
      const hits = arr.filter((v) => v?._ref === fromId)
      if (hits.length === 0) continue
      const already = arr.some((v) => v?._ref === toId)
      let patch = client.patch(refId).unset([`${field}[_ref=="${fromId}"]`])
      if (!already) {
        patch = patch.insert('after', `${field}[-1]`, [
          {
            _type: 'reference',
            _ref: toId,
            _key: `merge-${Math.random().toString(36).slice(2, 8)}`,
          },
        ])
      }
      await patch.commit({ autoGenerateArrayKeys: true })
      patched += 1
    }
  }
  return patched
}

async function mergeIntoKeeper(
  client: SanityClient,
  keeper: Pub,
  loser: Pub,
  apply: boolean,
) {
  const keeperAuthors = new Map<string, { _ref: string; _key?: string }>()
  for (const a of keeper.authors || []) keeperAuthors.set(a._ref, a)
  const newAuthors: Array<{ _ref: string; _key: string }> = []
  for (const a of loser.authors || []) {
    if (!keeperAuthors.has(a._ref)) {
      newAuthors.push({
        _ref: a._ref,
        _key: a._key || `auth-${Math.random().toString(36).slice(2, 8)}`,
      })
    }
  }

  const patches: Record<string, unknown> = {}
  for (const k of FILLABLE_FIELDS) {
    if (
      !keeper[k] &&
      loser[k] !== undefined &&
      loser[k] !== null &&
      loser[k] !== ''
    ) {
      patches[k] = loser[k]
    }
  }

  if (!apply) return
  let p = client.patch(keeper._id)
  if (Object.keys(patches).length > 0) p = p.setIfMissing(patches)
  if (newAuthors.length > 0) p = p.insert('after', 'authors[-1]', newAuthors)
  if (Object.keys(patches).length > 0 || newAuthors.length > 0) {
    await p.commit({ autoGenerateArrayKeys: true })
  }
}

export async function dedupePublications(
  opts: DedupeOptions,
): Promise<DedupeResult> {
  const { client } = opts
  const apply = opts.apply !== false

  const pubs = await client.fetch<Pub[]>(`*[_type == "publication"]{
    _id, title, year, month, journal, conference, publisher, volume, issue, pages,
    doi, url, citation, abstract, externalId, externalAuthors,
    authors[]{ _ref, _key }, rawData
  }`)

  const groups = new Map<string, Pub[]>()
  for (const p of pubs) {
    const key = p.externalId
      ? `ext:${p.externalId}`
      : `title:${normalize(p.title)}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }

  const result: DedupeResult = {
    scanned: pubs.length,
    duplicateGroups: 0,
    merged: 0,
    repointedReferences: 0,
    deleted: 0,
  }

  for (const [, group] of groups) {
    if (group.length < 2) continue
    result.duplicateGroups += 1
    const keeper = chooseKeeper(group)
    const losers = group.filter((p) => p._id !== keeper._id)
    for (const loser of losers) {
      await mergeIntoKeeper(client, keeper, loser, apply)
      result.merged += 1
      if (apply) {
        const rp = await repointReferences(client, loser._id, keeper._id)
        result.repointedReferences += rp
        await client.delete(loser._id)
        result.deleted += 1
      }
    }
  }

  return result
}
