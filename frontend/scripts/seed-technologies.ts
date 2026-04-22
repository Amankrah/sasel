/*
 * One-off seed script for Technology documents.
 *
 * Usage (from /frontend):
 *   1. In frontend/.env.local, set:
 *        SANITY_WRITE_TOKEN=<Editor-role token from sanity.io/manage>
 *   2. Run: npm run seed:technologies
 *
 * Idempotent: uses createIfNotExists with a stable _id per technology.
 */

import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'
import path from 'node:path'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error(
    'Missing SANITY_WRITE_TOKEN. Generate an Editor-role token at sanity.io/manage and add it to frontend/.env.local',
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

type PortableBlock = {
  _type: 'block'
  _key: string
  style?: string
  markDefs?: unknown[]
  children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }>
}

let keyCounter = 0
const mkKey = () => `k${(keyCounter++).toString(36)}`
const para = (text: string, style: 'normal' | 'h3' = 'normal'): PortableBlock => ({
  _type: 'block',
  _key: mkKey(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: mkKey(), text, marks: [] }],
})

const ecodish365 = {
  _id: 'technology-ecodish365',
  _type: 'technology',
  title: 'EcoDish365',
  slug: { _type: 'slug', current: 'ecodish365' },
  tagline:
    "The world's first environmental nutrition decision system — uniting nutrition science, environmental impact, and health outcomes.",
  status: 'LIVE',
  isFeatured: true,
  featuredOrder: 1,
  accentColor: 'emerald',
  website: 'https://ecodish365.com/',
  githubRepo: 'https://github.com/Amankrah/ecodish365',
  categories: [
    'Life Cycle Assessment',
    'Nutrition Science',
    'Environmental Impact',
    'Decision Support',
  ],
  techStack: [
    'Next.js 15',
    'TypeScript',
    'Django',
    'Python 3.10+',
    'Rust (PyO3 / Maturin)',
  ],
  keyFeatures: [
    "5,000+ foods from Canada's Nutrient File (CNF)",
    '150+ nutrition and health metrics',
    '18 environmental impact categories',
    'Health Star Rating (HSR)',
    'Food Compass Score (FCS) — 9 domains, 54 attributes',
    'Healthy Eating Food Index (HEFI) — 10 components',
    'Health & Nutritional Impact (HENI) — DALY-based',
    'ReCiPe 2016 midpoint LCA with Canadian regionalization',
    'Environmental monetization in CAD',
    'Custom meal planning with instant scoring',
  ],
  targetUsers: [
    'Individuals and families seeking healthier food choices',
    'Nutrition and sustainability researchers',
    'Policymakers developing dietary and sustainability initiatives',
    'Organizational decision-makers',
  ],
  description: [
    para(
      "EcoDish365 is a comprehensive digital platform that integrates nutrition science, environmental impact assessment, and health outcomes into a single decision-support tool. It brings together Canada's Nutrient File, leading nutrient profiling systems, and life-cycle environmental data so users can evaluate food choices and meals across multiple dimensions at once.",
    ),
    para(
      'The platform serves three stakeholder groups: individuals seeking healthier and more sustainable food choices, researchers investigating the nutrition-environment intersection, and policymakers developing evidence-based dietary and sustainability initiatives.',
    ),
  ],
  methodology: [
    para('Life Cycle Assessment', 'h3'),
    para(
      'Environmental impact is quantified using the ReCiPe 2016 midpoint method across 18 impact categories, normalized per 100 kcal and regionalized for Canadian conditions. Results are also monetized in Canadian dollars to support policy and procurement decisions.',
    ),
    para('Nutrient Profiling', 'h3'),
    para(
      'Nutritional quality is assessed through multiple complementary systems: the Health Star Rating (HSR), the Food Compass Score (FCS) across 9 domains and 54 attributes, and the Healthy Eating Food Index (HEFI) with 10 Canadian-dietary-guideline components.',
    ),
    para('Health Impact', 'h3'),
    para(
      'The Health and Nutritional Impact (HENI) method estimates the effect of foods on health outcomes in Disability-Adjusted Life Years (DALYs), supporting comparisons between dietary choices at a population level.',
    ),
  ],
}

async function run() {
  const docs = [ecodish365]
  for (const doc of docs) {
    try {
      const result = await client.createIfNotExists(doc)
      console.log(`✔ ${doc.title} (${result._id})`)
    } catch (err) {
      console.error(`✖ Failed to seed ${doc.title}:`, err)
      process.exitCode = 1
    }
  }
}

run()
