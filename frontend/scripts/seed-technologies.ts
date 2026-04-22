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

const greenMeansGo = {
  _id: 'technology-green-means-go',
  _type: 'technology',
  title: 'Green Means Go',
  slug: { _type: 'slug', current: 'green-means-go' },
  tagline:
    'Life Cycle Assessment built for African food systems — helping farms and processors measure impact and reach global markets.',
  status: 'BETA',
  isFeatured: true,
  featuredOrder: 2,
  accentColor: 'blue',
  website: 'https://greenmeansgo.ai/',
  githubRepo: 'https://github.com/Amankrah/green_means_go',
  categories: [
    'Life Cycle Assessment',
    'Sustainability Assessment',
    'Agricultural Technology',
    'Supply Chain Analytics',
    'Decision Support',
  ],
  techStack: [
    'Next.js 15',
    'React 19',
    'TypeScript',
    'Tailwind CSS 4',
    'FastAPI',
    'Python 3.8+',
    'Rust',
    'Pydantic',
  ],
  keyFeatures: [
    '8 midpoint impact categories (climate, water, land, biodiversity, and more)',
    '3 endpoint categories (human health, ecosystem quality, resource scarcity)',
    'Farm-level assessments for cropping, soil, water, pest, and energy management',
    'Processing facility assessments for energy, water, waste, and emissions',
    'Country-specific impact factors with global fallbacks',
    'Data quality scoring and regional benchmarking',
    'Supports 9+ food categories and multiple facility types',
    'Rust core delivers sub-100 ms calculations',
    'Designed for EU CBAM, EUDR compliance, and AfCFTA alignment',
  ],
  targetUsers: [
    'Smallholder and family farms',
    'Commercial farms and agricultural cooperatives',
    'Food processing facilities and manufacturers',
    'Food distributors and exporters',
    'Certification bodies and policymakers',
  ],
  description: [
    para(
      'Green Means Go is a Life Cycle Assessment platform built for the African agri-food value chain. It helps smallholder and commercial farms, processors, and exporters understand the environmental footprint of their operations — and use that evidence to reach global markets that increasingly require verified sustainability data.',
    ),
    para(
      'The platform launches with country-specific support for Ghana and Nigeria, with expansion planned across the continent. Farm assessments complete in 15–20 minutes and processing assessments in 10–15 minutes, producing ISO 14040/14044-compliant results that align with EU CBAM, EUDR, and AfCFTA requirements.',
    ),
  ],
  methodology: [
    para('Life Cycle Assessment', 'h3'),
    para(
      'Assessments follow the ISO 14040 and ISO 14044 standards. Results are reported across eight midpoint impact categories — including climate (kg CO₂-equivalent), water use (m³), land use (m²-years), and biodiversity — and three endpoint categories: human health, ecosystem quality, and resource scarcity.',
    ),
    para('Africa-Specific Data', 'h3'),
    para(
      'Country-specific emission and resource factors are used wherever available, with transparent fallbacks to global datasets so users always get a result. Data-quality scoring surfaces how confident the assessment is and which inputs to improve next.',
    ),
    para('Three-Tier Architecture', 'h3'),
    para(
      'A Next.js frontend drives a FastAPI gateway that delegates calculations to a Rust core. The stateless API design supports horizontal scaling, and the Rust engine delivers sub-100 ms per-calculation performance even on complex farm or facility assessments.',
    ),
  ],
}

const proteinProcess = {
  _id: 'technology-proteinprocess',
  _type: 'technology',
  title: 'ProteinProcessIO',
  slug: { _type: 'slug', current: 'proteinprocess' },
  tagline:
    'Complete protein processing simulation — from raw seed to fractionated flour, with GPU-accelerated physics validated against NRC Canada experimental data.',
  status: 'LIVE',
  isFeatured: true,
  featuredOrder: 3,
  accentColor: 'amber',
  website: 'https://proteinprocess.io/',
  githubRepo: 'https://github.com/Amankrah/airclassifier',
  documentationUrl: 'https://proteinprocess.io/docs',
  categories: [
    'Process Simulation',
    'Plant Protein',
    'Dry Fractionation',
    'Computational Physics',
    'Research Tool',
  ],
  techStack: [
    'Python',
    'NVIDIA Warp (GPU)',
    'PySide6 / Qt6',
    'PyVista (3D visualization)',
    'NumPy / SciPy',
    'Inno Setup (Windows installer)',
  ],
  keyFeatures: [
    'Three coupled stages: RF pretreatment, hammer milling, and air classification',
    'GP-15 RF dielectric heating with 9-step multiphysics solver',
    'Hammer-mill simulation with energy-based comminution and real-time PSD (D10/D50/D90)',
    'Multi-stage air classifier with Lagrangian particle tracking up to 5,000g',
    'Validated against NRC Canada data (e.g., simulated D50 23.6 µm vs measured 23.7 µm)',
    'Material presets for yellow pea, faba bean, and red lentil',
    '40+ parametric 3D equipment components with interactive viewport',
    'Full mass-balance tracking across the pipeline with multi-pass recirculation',
    'VTK, CSV, JSON, and NumPy export; three cinematic camera modes',
    'Free for research and academic use',
  ],
  targetUsers: [
    'Academic researchers in agricultural and food process engineering',
    'Plant protein scientists and formulators',
    'Institutions studying dry fractionation',
    'Industry partners exploring process optimization before physical trials',
  ],
  description: [
    para(
      'ProteinProcessIO is a physics-based desktop simulation platform for plant protein fractionation. It couples three processing stages — RF dielectric pretreatment, hammer milling, and multi-stage air classification — into a single pipeline, letting researchers run virtual experiments that would be expensive, slow, or simply unobservable on physical equipment.',
    ),
    para(
      'The platform was developed at McGill University in partnership with the National Research Council Canada, with concept work starting in 2023 and a public release in 2025. It emphasizes scientific validation, GPU-accelerated performance, and accessibility — offered free for research and academic use.',
    ),
  ],
  methodology: [
    para('Coupled Multiphysics', 'h3'),
    para(
      'The pretreatment stage solves a 9-step physics loop: RF field evaluation at 27.12 MHz, volumetric dielectric heating, thermal conduction, Fickian moisture diffusion with temperature-dependent coefficients, evaporation kinetics, latent-heat release, and moisture-dependent thermal conductivity via the Luikov model. Adaptive PLC control tracks electrode gap, belt speed, temperature, and arc events.',
    ),
    para('Energy-Based Comminution', 'h3'),
    para(
      "The hammer mill uses calibrated selection and breakage functions with Rosin–Rammler daughter distributions, screen classification with (1-t)^4 passage taper, and real-time particle size distribution evolution. Thermal modeling of the 50 kg steel housing accounts for friction heating and convective cooling. Mass conservation is enforced throughout.",
    ),
    para('Lagrangian Air Classification', 'h3'),
    para(
      'The classifier tracks particles through venturi, zigzag preclassifier, wheel (up to 3,000 RPM), and a three-stage cyclone system. Drag uses Schiller–Naumann for spherical particles and Haider–Levenspiel for non-spherical shapes. Gravity, buoyancy, inelastic wall collisions, bag-filter exhaust cleaning, and configurable bypass ratios are all modeled. GPU-accelerated solvers (NVIDIA Warp) deliver interactive performance.',
    ),
    para('Validation', 'h3'),
    para(
      'Models are calibrated against NRC Canada experimental data — PLC logs, temperature measurements, NIR moisture analysis, and measured particle-size distributions — so simulation results track physical equipment closely.',
    ),
  ],
}

async function run() {
  const docs = [ecodish365, greenMeansGo, proteinProcess]
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
