/*
 * Imports a Django export into Sanity.
 *
 * Preconditions:
 *   1. `python manage.py export_all` was run in backend/
 *   2. frontend/.env.local has SANITY_WRITE_TOKEN (Editor role)
 *
 * Usage (from frontend/):
 *   npm run import:django
 *
 * Idempotent: uses createIfNotExists + stable _ids keyed on Django slugs.
 * Safe to re-run. Existing edits in Studio are preserved by virtue of
 * createIfNotExists skipping documents that already exist.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Generate an Editor token at sanity.io/manage.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const repoRoot = path.resolve(projectDir, '..')
const exportRoot = path.join(repoRoot, 'backend', 'exports')
const exportJson = path.join(exportRoot, 'export.json')
const mediaRoot = path.join(exportRoot, 'media')

if (!fs.existsSync(exportJson)) {
  console.error(`Missing ${exportJson}. Run: python manage.py export_all`)
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(exportJson, 'utf-8'))

// Slug → _id helpers (stable across runs)
const memberId = (slug: string) => `member-${slug}`
const projectId_ = (slug: string) => `project-${slug}`
// Publications use Django numeric id because titles/slugs routinely exceed
// Sanity's 128-char document-ID limit.
const publicationId = (id: number) => `publication-${id}`
const grantId = (slug: string) => `grant-${slug}`
const awardId = (slug: string) => `award-${slug}`
const collaborationId = (slug: string) => `collaboration-${slug}`
const partnershipId = (slug: string) => `partnership-${slug}`

// Django 'PROF' → Sanity 'PI' for the PI. Everyone else keeps their Django value.
const PI_SLUGS = new Set(['ebenezer-miezah-kwofie'])

// Convert a Django text (description/bio) into Sanity portable-text blocks.
let keyCounter = 0
const mkKey = () => `k${(keyCounter++).toString(36)}`

const toBlocks = (text: string | null | undefined) => {
  if (!text || !text.trim()) return undefined
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: mkKey(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: mkKey(), text: para, marks: [] }],
    }))
}

// Upload a local media file and return a Sanity image reference object.
// Returns null if the file is missing.
const imageCache = new Map<string, string>()

async function uploadImage(
  relPath: string | null | undefined,
  altText: string,
): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string }; alt?: string } | null> {
  if (!relPath) return null
  const abs = path.join(mediaRoot, relPath)
  if (!fs.existsSync(abs)) {
    console.warn(`  missing media file: ${abs}`)
    return null
  }
  let assetId = imageCache.get(abs)
  if (!assetId) {
    const stream = fs.createReadStream(abs)
    const asset = await client.assets.upload('image', stream, {
      filename: path.basename(abs),
    })
    assetId = asset._id
    imageCache.set(abs, assetId)
  }
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: altText,
  }
}

const ref = (_ref: string) => ({ _type: 'reference', _ref, _key: mkKey() })

async function run() {
  console.log('\n--- Importing members ---')
  for (const m of data.members) {
    const memberTypeValue = PI_SLUGS.has(m.slug) ? 'PI' : m.member_type
    const image = await uploadImage(m.image, m.name)
    const doc: Record<string, unknown> = {
      _id: memberId(m.slug),
      _type: 'member',
      name: m.name,
      slug: { _type: 'slug', current: m.slug },
      memberType: memberTypeValue,
      position: m.position,
      email: m.email || undefined,
      googleScholarId: m.google_scholar_id || undefined,
      website: m.website || undefined,
      joinedDate: m.joined_date || undefined,
      leftDate: m.left_date || undefined,
      isActive: Boolean(m.is_active),
      order: m.order ?? 0,
    }
    const bio = toBlocks(m.bio)
    if (bio) doc.bio = bio
    if (image) doc.image = image
    const result = await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${m.name} → ${result._id}`)
  }

  console.log('\n--- Importing projects ---')
  for (const p of data.projects) {
    const image = await uploadImage(p.image, p.title)
    const doc: Record<string, unknown> = {
      _id: projectId_(p.slug),
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      shortDescription: p.description?.slice(0, 300) || undefined,
      status: p.is_active ? 'ACTIVE' : 'COMPLETED',
      startDate: p.start_date || undefined,
      endDate: p.end_date || undefined,
      website: p.website || undefined,
      githubRepo: p.github_repo || undefined,
      members: (p.members || []).map((slug: string) => ref(memberId(slug))),
    }
    const description = toBlocks(p.description)
    if (description) doc.description = description
    if (image) doc.featuredImage = image
    const result = await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${p.title} → ${result._id}`)
  }

  console.log('\n--- Importing publications ---')
  let pubCount = 0
  for (const pub of data.publications) {
    const doc: Record<string, unknown> = {
      _id: publicationId(pub.id),
      _type: 'publication',
      title: pub.title,
      slug: { _type: 'slug', current: pub.slug },
      publicationType: pub.publication_type || 'JOURNAL',
      abstract: pub.abstract || undefined,
      year: pub.year,
      month: pub.month ?? undefined,
      journal: pub.journal || undefined,
      conference: pub.conference || undefined,
      publisher: pub.publisher || undefined,
      volume: pub.volume || undefined,
      issue: pub.issue || undefined,
      pages: pub.pages || undefined,
      doi: pub.doi || undefined,
      url: pub.url || undefined,
      citation: pub.citation || undefined,
      externalId: pub.external_id || undefined,
      rawData: pub.raw_data ? JSON.stringify(pub.raw_data, null, 2) : undefined,
      externalAuthors: pub.external_authors || undefined,
      authors: (pub.authors || []).map((slug: string) => ref(memberId(slug))),
      relatedProjects: (pub.projects || []).map((slug: string) => ref(projectId_(slug))),
    }
    await client.createIfNotExists(doc as { _id: string; _type: string })
    pubCount++
    if (pubCount % 20 === 0) console.log(`  ${pubCount} / ${data.publications.length}`)
  }
  console.log(`  ${pubCount} publications imported`)

  console.log('\n--- Importing grants ---')
  for (const g of data.grants) {
    const image = await uploadImage(g.image, g.title)
    const doc: Record<string, unknown> = {
      _id: grantId(g.slug),
      _type: 'grant',
      title: g.title,
      slug: { _type: 'slug', current: g.slug },
      fundingAgency: g.funding_agency || undefined,
      description: toBlocks(g.description),
      amount: g.amount ?? undefined,
      currency: g.currency || 'CAD',
      startDate: g.start_date || undefined,
      endDate: g.end_date || undefined,
      isActive: Boolean(g.is_active),
      principalInvestigators: (g.principal_investigators || []).map((s: string) => ref(memberId(s))),
      coInvestigators: (g.co_investigators || []).map((s: string) => ref(memberId(s))),
      relatedProjects: (g.projects || []).map((s: string) => ref(projectId_(s))),
    }
    if (image) doc.image = image
    await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${g.title}`)
  }

  console.log('\n--- Importing awards ---')
  for (const a of data.awards) {
    const image = await uploadImage(a.image, a.title)
    const doc: Record<string, unknown> = {
      _id: awardId(a.slug),
      _type: 'award',
      title: a.title,
      slug: { _type: 'slug', current: a.slug },
      awardingBody: a.awarding_body || undefined,
      description: toBlocks(a.description),
      dateReceived: a.date_received || undefined,
      recipients: (a.recipients || []).map((s: string) => ref(memberId(s))),
      relatedProjects: (a.projects || []).map((s: string) => ref(projectId_(s))),
    }
    if (image) doc.image = image
    await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${a.title}`)
  }

  console.log('\n--- Importing collaborations ---')
  for (const c of data.collaborations) {
    const image = await uploadImage(c.image, c.name)
    const doc: Record<string, unknown> = {
      _id: collaborationId(c.slug),
      _type: 'collaboration',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      collaborationType: c.collaboration_type || undefined,
      institution: c.institution || undefined,
      description: toBlocks(c.description),
      startDate: c.start_date || undefined,
      endDate: c.end_date || undefined,
      isActive: Boolean(c.is_active),
      website: c.website || undefined,
      relatedProjects: (c.projects || []).map((s: string) => ref(projectId_(s))),
    }
    if (image) doc.image = image
    await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${c.name}`)
  }

  console.log('\n--- Importing partnerships ---')
  for (const p of data.partnerships) {
    const image = await uploadImage(p.image, p.name)
    const doc: Record<string, unknown> = {
      _id: partnershipId(p.slug),
      _type: 'partnership',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      organization: p.organization || undefined,
      description: toBlocks(p.description),
      startDate: p.start_date || undefined,
      endDate: p.end_date || undefined,
      isActive: Boolean(p.is_active),
      website: p.website || undefined,
      contactName: p.contact_name || undefined,
      contactEmail: p.contact_email || undefined,
      relatedProjects: (p.projects || []).map((s: string) => ref(projectId_(s))),
    }
    if (image) doc.image = image
    await client.createIfNotExists(doc as { _id: string; _type: string })
    console.log(`  ${p.name}`)
  }

  console.log('\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
