/*
 * Seeds the `partner` document type in Sanity from project + technology partners.
 *
 * Usage (from frontend/):
 *   npm run seed:partners                   # add missing; skip existing
 *   npm run seed:partners -- --overwrite    # replace every defined doc with fresh content
 *   npm run seed:partners -- --reset        # DELETE every partner then seed fresh
 *
 * Uploads any local logos in public/images/partners/ referenced by `logoFile`
 * into Sanity as image assets (cached across runs via logoFile name).
 *
 * Requires SANITY_WRITE_TOKEN in frontend/.env.local.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

const projectDir = path.resolve(__dirname, '..')
loadEnvConfig(projectDir)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const logosDir = path.resolve(projectDir, 'public', 'images', 'partners')

// Cache uploaded asset ids across the seed so a logo is uploaded once.
const assetCache = new Map<string, string>()
async function uploadLogo(
  logoFile: string | undefined,
): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  if (!logoFile) return null
  if (assetCache.has(logoFile)) {
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetCache.get(logoFile)! },
    }
  }
  const abs = path.join(logosDir, logoFile)
  if (!fs.existsSync(abs)) {
    console.warn(`  missing logo file: ${abs}`)
    return null
  }
  const stream = fs.createReadStream(abs)
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(abs),
  })
  assetCache.set(logoFile, asset._id)
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

type Category = 'FUNDER' | 'ACADEMIC' | 'GOVERNMENT' | 'INDUSTRY' | 'ADVISORY'

interface PartnerInput {
  slug: string
  name: string
  category: Category
  country?: string
  website?: string
  logoFile?: string
  description?: string
  isFeatured?: boolean
  featuredOrder?: number
}

const partners: PartnerInput[] = [
  // ----- Funders & Sponsors (top row candidates) -----
  { slug: 'horizon-europe', name: 'Horizon Europe', category: 'FUNDER', country: 'European Union', website: 'https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en', logoFile: 'horizon-europe.png', isFeatured: true, featuredOrder: 10 },
  { slug: 'mastercard-foundation', name: 'Mastercard Foundation', category: 'FUNDER', country: 'Canada', website: 'https://mastercardfdn.org/', isFeatured: true, featuredOrder: 20, description: 'Young Africa Works strategy. Funds the Nkabom Collaborative.' },
  { slug: 'frq', name: 'Fonds de Recherche du Québec', category: 'FUNDER', country: 'Canada', website: 'https://frq.gouv.qc.ca/en/', logoFile: 'quebec.jpg', isFeatured: true, featuredOrder: 30, description: 'Science Diplomacy Research Chairs Program.' },
  { slug: 'nrc-canada', name: 'National Research Council of Canada', category: 'FUNDER', country: 'Canada', website: 'https://nrc.canada.ca/', logoFile: 'canada-nrc.jpg', isFeatured: true, featuredOrder: 40, description: 'Funds and collaborates on CSTIP and the NRC Saskatoon pulse program.' },
  { slug: 'nserc', name: 'NSERC / CRSNG', category: 'FUNDER', country: 'Canada', website: 'https://www.nserc-crsng.gc.ca/', logoFile: 'nserc.jpg', isFeatured: true, featuredOrder: 50 },
  { slug: 'mitacs', name: 'Mitacs', category: 'FUNDER', country: 'Canada', website: 'https://www.mitacs.ca/', logoFile: 'mitacs.jpg', isFeatured: true, featuredOrder: 60 },
  { slug: 'sshrc', name: 'SSHRC / CRSH', category: 'FUNDER', country: 'Canada', website: 'https://www.sshrc-crsh.gc.ca/', logoFile: 'sshrc.png', isFeatured: true, featuredOrder: 70 },
  { slug: 'new-frontiers', name: 'New Frontiers in Research Fund', category: 'FUNDER', country: 'Canada', website: 'https://www.sshrc-crsh.gc.ca/funding-financement/nfrf-fnfr/index-eng.aspx', logoFile: 'new-frontiers.jpg', isFeatured: true, featuredOrder: 80 },
  { slug: 'ifad', name: 'International Fund for Agricultural Development (IFAD)', category: 'FUNDER', country: 'Rome, Italy', website: 'https://www.ifad.org/', featuredOrder: 90, description: 'Funder of the FSFI (Rwanda) platform.' },
  { slug: 'danone', name: 'Danone', category: 'INDUSTRY', country: 'France', website: 'https://www.danone.com/', logoFile: 'danone.png', featuredOrder: 100 },

  // ----- Academic & Research -----
  { slug: 'iita', name: 'International Institute of Tropical Agriculture (IITA)', category: 'ACADEMIC', country: 'Nigeria', website: 'https://www.iita.org/', featuredOrder: 10, description: 'Coordinator of the FCI4Africa consortium.' },
  { slug: 'wageningen-university', name: 'Wageningen University & Research', category: 'ACADEMIC', country: 'Netherlands', website: 'https://www.wur.nl/', featuredOrder: 20, description: 'FCI4Africa and DEFENSEFOOD consortium partner.' },
  { slug: 'university-of-pretoria', name: 'University of Pretoria', category: 'ACADEMIC', country: 'South Africa', website: 'https://www.up.ac.za/', featuredOrder: 30, description: 'DSI-NRF Centre of Excellence in Food Security. Science Diplomacy co-chair.' },
  { slug: 'university-of-ghana', name: 'University of Ghana', category: 'ACADEMIC', country: 'Ghana', website: 'https://www.ug.edu.gh/', featuredOrder: 40, description: 'Nkabom Collaborative national nutrition database lead.' },
  { slug: 'knust', name: 'Kwame Nkrumah University of Science and Technology (KNUST)', category: 'ACADEMIC', country: 'Ghana', website: 'https://www.knust.edu.gh/', logoFile: 'knust.jpg', featuredOrder: 50, description: 'Nkabom Collaborative sustainability module co-development.' },
  { slug: 'ashesi-university', name: 'Ashesi University', category: 'ACADEMIC', country: 'Ghana', website: 'https://www.ashesi.edu.gh/', featuredOrder: 60 },
  { slug: 'uhas', name: 'University of Health and Allied Sciences (UHAS)', category: 'ACADEMIC', country: 'Ghana', website: 'https://www.uhas.edu.gh/', featuredOrder: 70 },
  { slug: 'unibw-munich', name: 'Universität der Bundeswehr München', category: 'ACADEMIC', country: 'Germany', website: 'https://www.unibw.de/', featuredOrder: 80, description: 'FCI4Africa and DEFENSEFOOD consortium partner.' },
  { slug: 'university-of-guelph', name: 'University of Guelph', category: 'ACADEMIC', country: 'Canada', website: 'https://www.uoguelph.ca/', featuredOrder: 90 },
  { slug: 'university-of-ottawa', name: 'University of Ottawa, Telfer School of Management', category: 'ACADEMIC', country: 'Canada', website: 'https://telfer.uottawa.ca/', featuredOrder: 100 },
  { slug: 'university-of-arkansas', name: 'University of Arkansas', category: 'ACADEMIC', country: 'United States', website: 'https://www.uark.edu/', logoFile: 'university-arkansas.jpg', featuredOrder: 110 },
  { slug: 'syreon', name: 'Syreon Research Institute', category: 'ACADEMIC', country: 'Hungary', website: 'https://www.syreon.eu/', featuredOrder: 120, description: 'DEFENSEFOOD scientific coordinator.' },
  { slug: 'cnr-italy', name: 'Consiglio Nazionale delle Ricerche (CNR)', category: 'ACADEMIC', country: 'Italy', website: 'https://www.cnr.it/', featuredOrder: 130 },
  { slug: 'fraunhofer-igd', name: 'Fraunhofer IGD', category: 'ACADEMIC', country: 'Germany', website: 'https://www.igd.fraunhofer.de/', featuredOrder: 140 },
  { slug: 'csir-ghana', name: 'CSIR Science and Technology Policy Research Institute', category: 'ACADEMIC', country: 'Ghana', website: 'https://stepri.csir.org.gh/', featuredOrder: 150, description: 'Science Diplomacy co-chair.' },
  { slug: 'ifpri', name: 'International Food Policy Research Institute (IFPRI)', category: 'ACADEMIC', country: 'Washington, DC', website: 'https://www.ifpri.org/', logoFile: 'ifpri.jpg', featuredOrder: 160, description: 'Science Diplomacy co-chair. FSFI Rwanda collaborator.' },
  { slug: 'akademiya2063', name: 'AKADEMIYA2063', category: 'ACADEMIC', country: 'Rwanda', website: 'https://akademiya2063.org/', featuredOrder: 170, description: 'Pan-African research organization. FSFI Rwanda partner.' },
  { slug: 'consortium-rita', name: 'Consortium RITA', category: 'ACADEMIC', country: 'Quebec, Canada', featuredOrder: 180, description: 'Research collaboration that anchors SoyaFlow.' },

  // ----- Government & Agencies -----
  { slug: 'rwanda-minagri', name: 'Rwanda Ministry of Agriculture and Animal Resources', category: 'GOVERNMENT', country: 'Rwanda', website: 'https://www.minagri.gov.rw/', featuredOrder: 10, description: 'FSFI Rwanda program owner.' },
  { slug: 'ghana-mofa', name: 'Ghana Ministry of Food and Agriculture', category: 'GOVERNMENT', country: 'Ghana', website: 'https://mofa.gov.gh/', featuredOrder: 20 },
  { slug: 'ghana-moh', name: 'Ghana Ministry of Health', category: 'GOVERNMENT', country: 'Ghana', website: 'https://www.moh.gov.gh/', featuredOrder: 30 },
  { slug: 'sciensano', name: 'Sciensano', category: 'GOVERNMENT', country: 'Belgium', website: 'https://www.sciensano.be/', featuredOrder: 40, description: 'DEFENSEFOOD partner.' },
  { slug: 'rivm', name: 'National Institute for Public Health and the Environment (RIVM)', category: 'GOVERNMENT', country: 'Netherlands', website: 'https://www.rivm.nl/', featuredOrder: 50 },
  { slug: 'nebih', name: 'National Food Chain Safety Office (Nebih)', category: 'GOVERNMENT', country: 'Hungary', website: 'https://portal.nebih.gov.hu/en/', featuredOrder: 60 },
  { slug: 'mapaq', name: "Ministère de l'Agriculture, des Pêcheries et de l'Alimentation du Québec (MAPAQ)", category: 'GOVERNMENT', country: 'Canada', website: 'https://www.mapaq.gouv.qc.ca/', featuredOrder: 70 },
  { slug: 'agriculture-canada', name: 'Agriculture and Agri-Food Canada', category: 'GOVERNMENT', country: 'Canada', website: 'https://agriculture.canada.ca/', logoFile: 'agriculture-canada.png', featuredOrder: 80 },
  { slug: 'nrc-saskatoon', name: 'NRC Saskatoon (National Research Council)', category: 'GOVERNMENT', country: 'Canada', website: 'https://nrc.canada.ca/', featuredOrder: 90, description: 'Validation partner for ProteinProcessIO and the Digital Twin pulse program.' },

  // ----- Industry & NGOs -----
  { slug: 'ubuntoo', name: 'Ubuntoo', category: 'INDUSTRY', country: 'Netherlands', website: 'https://www.ubuntoo.com/', logoFile: 'ubuntoo.png', featuredOrder: 10, description: 'FCI4Africa and DEFENSEFOOD knowledge-platform partner.' },
  { slug: 'foodscale-hub', name: 'Foodscale Hub', category: 'INDUSTRY', country: 'Greece', website: 'https://foodscalehub.com/', featuredOrder: 20 },
  { slug: 'reframe-food', name: 'Reframe Food (RFF)', category: 'INDUSTRY', country: 'Greece', featuredOrder: 30, description: 'DEFENSEFOOD partner.' },
  { slug: 'soya-excel', name: 'Soya Excel', category: 'INDUSTRY', country: 'Canada', website: 'https://www.soya-excel.com/', featuredOrder: 40, description: 'SoyaFlow industry partner. Operations across Canada, United States, and Spain.' },
  { slug: 'technoserve-nigeria', name: 'TechnoServe Nigeria', category: 'INDUSTRY', country: 'Nigeria', website: 'https://www.technoserve.org/', featuredOrder: 50 },
  { slug: 'technoserve-kenya', name: 'TechnoServe Kenya', category: 'INDUSTRY', country: 'Kenya', website: 'https://www.technoserve.org/', featuredOrder: 60 },
  { slug: 'fiab-spain', name: 'Federación Española de Industrias de la Alimentación y Bebidas (FIAB)', category: 'INDUSTRY', country: 'Spain', website: 'https://fiab.es/', featuredOrder: 70 },
  { slug: 'agi-ghana', name: 'Association of Ghana Industries (AGI)', category: 'INDUSTRY', country: 'Ghana', website: 'https://www.agighana.org/', featuredOrder: 80, description: 'Industry access for Nkabom SME sustainability audits.' },
  { slug: 'fsts', name: 'Food Systems Transformation Solutions', category: 'INDUSTRY', country: 'Senegal / South Africa', featuredOrder: 90, description: 'Led by Dr. Fadel Ndiame.' },
  { slug: 'aglobe-development', name: 'Aglobe Development Center', category: 'INDUSTRY', country: 'Nigeria', featuredOrder: 100 },
  { slug: 'dolphin-data', name: 'Dolphin Data Development', category: 'INDUSTRY', country: 'Canada', featuredOrder: 110 },
  { slug: 'scjs-europe', name: 'Sustainable Criminal Justice Solutions Europe (SCJS)', category: 'INDUSTRY', country: 'Belgium', featuredOrder: 120, description: 'DEFENSEFOOD project coordinator.' },
  { slug: 'jefo', name: 'JEFO', category: 'INDUSTRY', country: 'Canada', website: 'https://jefo.ca/', logoFile: 'jefo.jpg', featuredOrder: 130 },

  // ----- Advisory Boards (DEFENSEFOOD external advisory) -----
  { slug: 'efsa', name: 'European Food Safety Authority (EFSA)', category: 'ADVISORY', country: 'European Union', website: 'https://www.efsa.europa.eu/', featuredOrder: 10 },
  { slug: 'europol', name: 'Europol', category: 'ADVISORY', country: 'European Union', website: 'https://www.europol.europa.eu/', featuredOrder: 20 },
  { slug: 'opcw', name: 'Organisation for the Prohibition of Chemical Weapons (OPCW)', category: 'ADVISORY', country: 'The Hague', website: 'https://www.opcw.org/', featuredOrder: 30 },
  { slug: 'iaea', name: 'International Atomic Energy Agency (IAEA)', category: 'ADVISORY', country: 'Vienna', website: 'https://www.iaea.org/', featuredOrder: 40 },
]

async function findReferrers(id: string) {
  return client.fetch<Array<Record<string, unknown>>>(`*[references($id)]{ ... }`, { id })
}

async function run() {
  const overwrite = process.argv.includes('--overwrite')
  const reset = process.argv.includes('--reset')

  if (reset) {
    console.log('Resetting: deleting every existing partner document...')
    const existing = await client.fetch<{ _id: string; name: string }[]>(
      `*[_type == "partner"]{ _id, name }`,
    )
    for (const p of existing) {
      const referrers = await findReferrers(p._id)
      if (referrers.length > 0) {
        console.warn(`  skipping delete of ${p.name}: ${referrers.length} referrer(s).`)
        continue
      }
      await client.delete(p._id)
      console.log(`  ✖ deleted ${p.name} (${p._id})`)
    }
  }

  for (const p of partners) {
    try {
      const logo = await uploadLogo(p.logoFile)
      const doc: Record<string, unknown> = {
        _id: `partner-${p.slug}`,
        _type: 'partner',
        name: p.name,
        slug: { _type: 'slug', current: p.slug },
        category: p.category,
        country: p.country,
        website: p.website,
        description: p.description,
        isFeatured: Boolean(p.isFeatured),
        featuredOrder: p.featuredOrder ?? 100,
      }
      if (logo) doc.logo = logo
      const result =
        overwrite || reset
          ? await client.createOrReplace(doc as { _id: string; _type: string })
          : await client.createIfNotExists(doc as { _id: string; _type: string })
      const tag = reset ? ' [after reset]' : overwrite ? ' [overwritten]' : ''
      console.log(`✔ ${p.name} (${result._id})${tag}`)
    } catch (err) {
      console.error(`✖ Failed to seed ${p.name}:`, err)
      process.exitCode = 1
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
