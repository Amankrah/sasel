/*
 * Deduplicates publication documents in Sanity.
 *
 * Groups publications by (externalId || normalized title). For each group
 * with more than one doc, keeps the one most likely to be the canonical
 * record (numeric-id form first, then whichever has more filled-in fields)
 * and merges the rest into it:
 *   - any project / news / technology / publication reference pointing at
 *     the losing doc is patched to point at the kept doc
 *   - authors from the losing doc are unioned into the kept doc
 *   - fields missing on the kept doc are filled from the losing doc
 *   - losing doc is deleted
 *
 * Usage (from frontend/):
 *   npm run dedupe:publications               # dry run, prints plan
 *   npm run dedupe:publications -- --apply    # actually merge and delete
 */

import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token,
  useCdn: false,
})

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

const normalize = (s: string | undefined) =>
  (s || '').trim().toLowerCase().replace(/\s+/g, ' ')

function scoreCompleteness(p: Pub): number {
  let score = 0
  for (const k of [
    'journal', 'conference', 'publisher', 'volume', 'issue', 'pages',
    'doi', 'url', 'citation', 'abstract', 'externalAuthors',
  ] as const) {
    if (p[k]) score += 1
  }
  score += (p.authors?.length || 0)
  if (p.externalId) score += 2
  return score
}

function chooseKeeper(group: Pub[]): Pub {
  // Prefer numeric-id docs (Django import form: publication-<int>)
  const numeric = group.filter((p) => /^publication-\d+$/.test(p._id))
  if (numeric.length === 1) return numeric[0]
  const candidates = numeric.length > 0 ? numeric : group
  // Then the most-complete doc; tiebreak by oldest _id alphabetically
  return [...candidates].sort((a, b) => {
    const sa = scoreCompleteness(a)
    const sb = scoreCompleteness(b)
    if (sa !== sb) return sb - sa
    return a._id.localeCompare(b._id)
  })[0]
}

async function findReferrers(id: string) {
  return client.fetch<Array<Record<string, unknown>>>(
    `*[references($id)]{ ... }`,
    { id },
  )
}

// Which reference-array fields could point at a publication?
const PUBLICATION_REF_FIELDS: Record<string, string[]> = {
  project: ['relatedPublications'],
  technology: ['relatedPublications'],
  news: ['relatedPublications'],
  award: ['relatedPublications'],
  grant: ['relatedPublications'],
  publication: [],
}

async function repointReferences(fromId: string, toId: string): Promise<number> {
  const referrers = await findReferrers(fromId)
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
      // unset old refs, then append new one (dedupes if the target already exists)
      const already = arr.some((v) => v?._ref === toId)
      let patch = client
        .patch(refId)
        .unset(hits.map((_, i) => `${field}[_ref=="${fromId}"]`).slice(0, 1))
      if (!already) {
        patch = patch.insert('after', `${field}[-1]`, [
          { _type: 'reference', _ref: toId, _key: `merge-${Math.random().toString(36).slice(2, 8)}` },
        ])
      }
      await patch.commit({ autoGenerateArrayKeys: true })
      patched += 1
      console.log(`    · repointed ${refType} ${refId}.${field}: ${fromId} -> ${toId}`)
    }
  }
  return patched
}

async function mergeIntoKeeper(keeper: Pub, loser: Pub, apply: boolean) {
  // Union authors
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

  // Fill missing fields
  const fillable: Array<keyof Pub> = [
    'journal', 'conference', 'publisher', 'volume', 'issue', 'pages',
    'doi', 'url', 'citation', 'abstract', 'externalId',
    'externalAuthors', 'rawData', 'year', 'month',
  ]
  const patches: Record<string, unknown> = {}
  for (const k of fillable) {
    if (!keeper[k] && loser[k] !== undefined && loser[k] !== null && loser[k] !== '') {
      patches[k] = loser[k]
    }
  }

  console.log(`  merging ${loser._id} -> ${keeper._id}`)
  console.log(`    new authors: ${newAuthors.length}, fields filled: ${Object.keys(patches).length}`)

  if (!apply) return
  // Apply field fills and author union
  let p = client.patch(keeper._id)
  if (Object.keys(patches).length > 0) p = p.setIfMissing(patches)
  if (newAuthors.length > 0) p = p.insert('after', 'authors[-1]', newAuthors)
  if (Object.keys(patches).length > 0 || newAuthors.length > 0) {
    await p.commit({ autoGenerateArrayKeys: true })
  }
}

async function run() {
  const apply = process.argv.includes('--apply')
  if (!apply) console.log('DRY RUN. Pass --apply to commit changes.')

  const pubs = await client.fetch<Pub[]>(`*[_type == "publication"]{
    _id, title, year, month, journal, conference, publisher, volume, issue, pages,
    doi, url, citation, abstract, externalId, externalAuthors,
    authors[]{ _ref, _key }, rawData
  }`)
  console.log(`Scanning ${pubs.length} publication docs`)

  // Group: primary key externalId, fallback to normalized title
  const groups = new Map<string, Pub[]>()
  for (const p of pubs) {
    const key = p.externalId ? `ext:${p.externalId}` : `title:${normalize(p.title)}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }

  let groupsWithDupes = 0
  let totalDeletions = 0
  for (const [key, group] of groups) {
    if (group.length < 2) continue
    groupsWithDupes += 1
    const keeper = chooseKeeper(group)
    const losers = group.filter((p) => p._id !== keeper._id)
    console.log('')
    console.log(`Group (${key}): ${group.length} docs`)
    console.log(`  keep:   ${keeper._id}`)
    for (const loser of losers) {
      console.log(`  loser:  ${loser._id}`)
      await mergeIntoKeeper(keeper, loser, apply)
      if (apply) {
        await repointReferences(loser._id, keeper._id)
        await client.delete(loser._id)
        console.log(`    ✖ deleted ${loser._id}`)
        totalDeletions += 1
      }
    }
  }

  console.log('')
  console.log(`Groups with duplicates: ${groupsWithDupes}`)
  console.log(`Deletions committed:    ${totalDeletions}`)
  if (!apply && groupsWithDupes > 0) {
    console.log('\nRe-run with --apply to commit.')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
