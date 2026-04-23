/*
 * Seeds research Project documents in Sanity.
 *
 * Usage (from frontend/):
 *   npm run seed:projects                   # idempotent; adds missing, skips existing
 *   npm run seed:projects -- --overwrite    # replaces defined docs with fresh content
 *   npm run seed:projects -- --reset        # DELETES every project document, then seeds
 *
 * Requires SANITY_WRITE_TOKEN in frontend/.env.local.
 */

import path from 'node:path'
import { createClient } from 'next-sanity'
import { loadEnvConfig } from '@next/env'

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
    'Missing SANITY_WRITE_TOKEN. Generate an Editor token at sanity.io/manage.',
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

// Portable-text helpers
let keyCounter = 0
const mkKey = () => `k${(keyCounter++).toString(36)}`

type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type Block = {
  _type: 'block'
  _key: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: unknown[]
  children: Span[]
}

const span = (text: string, marks: string[] = []): Span => ({
  _type: 'span',
  _key: mkKey(),
  text,
  marks,
})

const para = (text: string, style: 'normal' | 'h2' | 'h3' = 'normal'): Block => ({
  _type: 'block',
  _key: mkKey(),
  style,
  markDefs: [],
  children: [span(text)],
})

const bullet = (text: string): Block => ({
  _type: 'block',
  _key: mkKey(),
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: [span(text)],
})

// ---------------------------------------------------------------------------
// FCI4Africa
// ---------------------------------------------------------------------------

const fci4africa = {
  _id: 'project-fci4africa',
  _type: 'project',
  title: 'Food Convergence Innovation for Africa (FCI4Africa)',
  slug: { _type: 'slug', current: 'fci4africa' },
  shortDescription:
    'A four-year Horizon Europe initiative equipping African producers, policymakers, and trade actors with evidence, digital tools, and convergent innovation frameworks for climate-neutral, fair, and just agri-food trade. McGill leads Work Package 1.',
  status: 'ACTIVE',
  isFeatured: true,
  researchAreas: [
    'Food Convergence Innovation',
    'Climate-Neutral Food Systems',
    'Fair and Just Food Systems',
    'Non-Tariff Measures',
    'Africa-EU Trade',
    'AfCFTA',
    'EUDR',
    'Life Cycle Assessment',
    'Decision Analytics',
    'Digital Traceability',
    'Smallholder Farmers',
    'Aflatoxin Mitigation',
    'Micronutrient Fortification',
    'Tipping Points',
    'SynthEco',
  ],
  description: [
    para('Overview', 'h2'),
    para(
      'FCI4Africa is a four-year Horizon Europe research and innovation initiative that equips African producers, policymakers, and trade actors with the evidence, digital tools, and convergent innovation frameworks needed to meet emerging EU and intra-African standards for sustainability, fairness, and justness in agri-food trade.',
    ),
    para(
      'The project operates at the intersection of three pressures reshaping African food systems: the African Continental Free Trade Agreement (AfCFTA), new EU legislation on deforestation-free commodities and corporate sustainability due diligence, and the long-standing need to uplift smallholder, informal, and women-led actors across the continent. Rather than treating these requirements as barriers, FCI4Africa reframes them as an opportunity for African agri-food products to capture value addition through verifiable sustainability, fair trade, and climate-neutral credentials.',
    ),

    para('Rationale', 'h2'),
    para(
      'New EU trade rules, including the Deforestation Regulation (EUDR), the Corporate Sustainability Reporting Directive, and the Organic Farming Regulation (EU) 2018/848, are raising the bar for imported agri-food products. Meanwhile, the AfCFTA is creating the world\u2019s largest single market of 1.3 billion consumers, with the potential to harmonize non-tariff measures and open global value chains to African smallholders.',
    ),
    para(
      'Whether these converging shifts become a "bust" or a "boost" for African producers depends on the availability of credible assessment systems, accessible digital traceability infrastructure, and policy environments that recognize smallholder realities. FCI4Africa is designed to make it a boost.',
    ),

    para('Project Objectives', 'h2'),
    bullet(
      'Understand the impacts of land-use change on climate, biodiversity, and society across conventional and organic food production chains.',
    ),
    bullet(
      'Identify the status quo and gaps required to establish, accredit, and scale climate-neutral, fair, healthy, sustainable, and just African food supplies.',
    ),
    bullet(
      'Support the improvement of Non-Tariff Measure (NTM) regimes through simulation methods applicable to intra-African and EU-AU trade.',
    ),
    bullet(
      'Develop and deploy digital and analytical tools that enable chain actors, certification bodies, and policy enforcers to verify and certify compliance.',
    ),
    bullet(
      'Pilot, refine, and validate business models, tools, and best practices through real-world use cases in Nigeria, Ghana, Kenya, and Senegal.',
    ),
    bullet(
      'Collaborate with parallel initiatives on food safety, agroforestry, and urban agriculture to generate cross-project synergies.',
    ),

    para('Three Transversal Use Cases', 'h2'),
    bullet(
      'Food Safety: scaling proven aflatoxin-mitigation technologies and traceability systems across Nigeria, Ghana, and Kenya.',
    ),
    bullet(
      'Digital Compliance: deploying digital solutions for trade facilitation through compliance with integrated quality standards and NTMs, building on TechnoServe\u2019s Micronutrient Fortification Index in Nigeria and Kenya.',
    ),
    bullet(
      'Rural Resilience: strengthening rural communities against weather, economic, and sociodemographic shocks, anchored on the Resilient Community model being implemented in Senegal.',
    ),

    para('Cascaded Funding', 'h2'),
    para(
      'FCI4Africa will redistribute 600k EUR to third parties through two open calls: eight awards of up to 50k EUR each for research and technology actors testing trade-enhancing innovations, and four awards of up to 50k EUR each for convergence innovation hubs that provide mentoring and acceleration to first-round awardees.',
    ),

    para('Project Metadata', 'h2'),
    bullet('Funding programme: Horizon Europe, HORIZON-CL6-2024-FARM2FORK-01-11.'),
    bullet('Duration: 48 months.'),
    bullet('Coordinator: International Institute of Tropical Agriculture (IITA), Nigeria.'),
    bullet('Consortium size: 14 partners across Africa, Europe, and North America.'),
    bullet('Total consortium effort: 485 person-months.'),
    bullet('McGill effort: 150 person-months, the largest single-partner contribution.'),
    bullet(
      'Countries of implementation: Nigeria, Kenya, Ghana, Senegal, with extensions across West, East, Central, Southern, and Northern Africa.',
    ),
    bullet('McGill role: Work Package 1 Lead (Climate-Neutral, Fair and Just Food Systems).'),
  ],
  methodology: [
    para('The Food Convergence Innovation Approach', 'h2'),
    para(
      'At the core of the project sits the Food Convergence Innovation (FCI) theory of change, a framework developed over more than a decade by a research network led by McGill University. FCI treats food system transformation as a multi-scale, multi-actor process that integrates agricultural, economic, environmental, and social health outcomes rather than optimizing any single dimension in isolation.',
    ),
    para(
      'The approach combines human creativity, agency, empathy, and trust with digital-powered tools (AI and machine learning for data synthesis, IoT for real-time monitoring, blockchain for transparent transactions, and cloud computing for cross-border collaboration) to enable convergence across sectors, geographies, and jurisdictions.',
    ),

    para('WP1 Objectives (McGill Lead)', 'h2'),
    para(
      'McGill University leads Work Package 1, "Climate-Neutral, Fair and Just Food Systems," contributing 150 person-months (the largest single-partner allocation in the consortium) and co-leading activities in WP2, WP3, and WP5. WP1 pursues four objectives:',
    ),
    bullet(
      'Understand and validate the activities and identify missing reporting indicators for measuring the sustainability of African food systems subject to intra- or interregional trade.',
    ),
    bullet('Determine systemic tipping points capable of unlocking transformation in selected food systems.'),
    bullet('Leverage tipping points and FCI concepts to design and validate solutions that accelerate transformation.'),
    bullet(
      'Design and develop a decision analytics tool that promotes the diffusion of innovations and supports sustainable, fair, and just intra-African and inter-African to Europe trade.',
    ),

    para('Technical Workstreams', 'h2'),
    para('Extended value chain assessment (Task 1.1).', 'h3'),
    para(
      'The lab leads desk studies and in-depth literature reviews drawing on FAO Food Balance Sheets, CAADP reports, and national databases to map the regulatory architecture, actor interactions, and production volumes of selected commodity chains. Field validation with key informants refines the analysis. Validation data feeds into SynthEco, an open-source ecosystem that uses statistically representative synthetic populations derived from census data to cluster health, behavioural, and environmental variables at fine geospatial granularity. Extending SynthEco with African data is a novel contribution of this project.',
    ),
    para('Tipping point identification (Task 1.2, co-lead with Wageningen University).', 'h3'),
    para(
      'The lab identifies positive tipping points (fortification, aflatoxin-free commodities, traceability labels, and local best practices) situated in their structure-agency contexts. Drawing on institutional analysis frameworks, we assess which points are most amenable to transformation and where agency from leadership actors can accelerate change.',
    ),
    para('FCI solution design (Task 1.3, lead).', 'h3'),
    para(
      'The lab anchors solution co-design in the convergent space where stakeholder values overlap with the values underlying multilevel regulatory frameworks. We apply and further develop the "value in situ" method (Sethamo et al., 2022) to elicit shared values across businesses, communities, and civil society organizations, then design interventions that are technically sound and institutionally legitimate.',
    ),
    para('Extended sustainability assessment (Task 1.4, lead).', 'h3'),
    para(
      'The lab conducts a baseline assessment of each selected commodity chain and compares it to the FCI solutions from Task 1.3 using environmental life cycle assessment and systems thinking. The assessment spans climate neutrality, land use, biodiversity, fairness, justness, and efficient food supply at local, regional, intra-country, and inter-continental scales, accounting for positive and negative feedback among actors, drivers, enablers, and barriers.',
    ),
    para('Interactive decision analytics tool (Task 1.5, lead).', 'h3'),
    para(
      'The lab translates the assessment framework into an interactive online platform that supports food system analysis and predicts the impact of FCI solutions on sustainability indicators. The tool is built on environmental life cycle models and systems thinking algorithms and will be accompanied by training workshops, manuals, and video resources so that stakeholders in the selected value chains can adopt it for analysis and solution design.',
    ),

    para('Cross-Work-Package Contributions', 'h2'),
    para(
      'WP2 (Trade modelling and NTM impact assessment): contributions to GTAP-based computable general equilibrium modelling of EU-AU agricultural trade under non-tariff measures, systems dynamics models linking NTMs to nutrition, health, and environmental outcomes, and policy recommendations for AU countries. McGill leads or co-leads eight of the twelve WP2 tasks.',
    ),
    para(
      'WP3 (Digitization and traceability): lead on Task 3.1, prioritizing commodities for traceability and claim-verification methods, reviewing existing and prospective legislative and private requirements (EUDR, CSDD, organic, TSD) and identifying analytical methods for product-trait combinations including cocoa, peanut, palm oil, and bananas.',
    ),
    para(
      'WP5 (Use case analytics): supports use case partners with decision analytics for factory diagnostics, trade of fortified commodities, and fair and just trade scaling, feeding real-world use case data back into the WP1 framework.',
    ),
  ],
  outcomes: [
    para('Expected Outputs from McGill-led Work', 'h2'),
    bullet(
      'D1.1 Value chain performance report (M10): baseline vs. extended assessment with nutrient maps, knowledge transfer, and sustainability indicators.',
    ),
    bullet('D1.2 Tipping points analysis report (M22): technical report on positive tipping points for food system transformation.'),
    bullet(
      'D1.3 Food Convergence Innovation solutions (M24): design strategies positioning selected systems toward a convergence economy.',
    ),
    bullet(
      'D1.4 Sustainability evaluation of FCI solutions (M24): impact evaluation against climate, biodiversity, and social indicators.',
    ),
    bullet(
      'D1.5 Decision analytics tool (M30): deployed interactive tool for predicting FCI solution impacts on climate-neutral, fair, and just food supply.',
    ),

    para('Why This Matters', 'h2'),
    para(
      'The WP1 decision analytics tool is the analytical backbone of the entire project. It converts the tipping-point and convergence-innovation theory into a usable instrument that trade modellers (WP2), traceability developers (WP3), knowledge platform builders (WP4), and use case implementers (WP5) can plug into their workflows. By embedding environmental life cycle assessment, systems thinking, and shared-value elicitation into a single decision-support platform, the lab\u2019s contribution ensures that the project\u2019s outputs are not just evidence-based but convergence-based, attuned to the interconnected realities of African food systems rather than optimizing for any one dimension at the expense of others.',
    ),
  ],
  collaborators: [
    { name: 'International Institute of Tropical Agriculture (IITA)', institution: 'Nigeria (Coordinator)' },
    { name: 'Food Systems Transformation Solutions', institution: 'South Africa' },
    { name: 'Aglobe Development Center', institution: 'Nigeria' },
    { name: 'Universität der Bundeswehr München', institution: 'Germany' },
    { name: 'Ubuntoo BV', institution: 'Netherlands' },
    { name: 'Foodscale Hub', institution: 'Greece' },
    { name: 'University of Guelph', institution: 'Canada' },
    { name: 'Wageningen University', institution: 'Netherlands' },
    { name: 'Dolphin Data Development', institution: 'Canada' },
    { name: 'University of Pretoria', institution: 'South Africa' },
    { name: 'Stichting Wageningen Research', institution: 'Netherlands' },
    { name: 'TechnoServe Nigeria', institution: 'Nigeria' },
    { name: 'TechnoServe Kenya', institution: 'Kenya' },
  ].map((c) => ({ ...c, _key: mkKey() })),
  funding: [
    {
      _key: mkKey(),
      agency: 'European Commission, Horizon Europe',
      grantNumber: 'HORIZON-CL6-2024-FARM2FORK-01-11',
      currency: 'EUR',
    },
  ],
}

// ---------------------------------------------------------------------------
// DEFENSEFOOD
// ---------------------------------------------------------------------------

const defensefood = {
  _id: 'project-defensefood',
  _type: 'project',
  title: 'DEFENSEFOOD',
  slug: { _type: 'slug', current: 'defensefood' },
  shortDescription:
    'A Horizon Europe project building a resilient European food chain against intentional and accidental chemical, biological, and radiological contamination through AI, advanced detection, and multi-stakeholder collaboration. McGill leads two WP5 tasks on knowledge management and adaptive training.',
  status: 'ACTIVE',
  isFeatured: true,
  researchAreas: [
    'Food Safety',
    'Food Defense',
    'CBR Threats',
    'AI Knowledge Platform',
    'Food Systems Resilience',
    'Horizon Europe',
    'Biosecurity',
    'Large Language Models',
    'Adaptive Training',
    'Food Threat Blueprint',
    'HACCP',
    'TACCP',
    'VACCP',
    'Horizon Scanning',
    'Cereals',
    'Shellfish',
    'Water Safety',
  ],
  description: [
    para('Overview', 'h2'),
    para(
      'DEFENSEFOOD is a Horizon Europe project that addresses one of the most under-examined threats to European public health and critical infrastructure: the intentional and accidental contamination of the food supply chain with chemical, biological, and radiological (CBR) agents. The World Health Organization ranks food-system contamination among the primary global public health threats of the 21st century, and recent geopolitical developments, including hybrid warfare activity and climate-driven shifts in food systems, have sharpened the urgency.',
    ),
    para(
      'The project moves European food safety practice from a reactive posture to a proactive and preventive one. It integrates AI-driven horizon scanning, Earth observation, advanced laboratory detection, simulation-based decision support, behavioural science, and cross-border capacity building into a single resilience framework. The framework is tested on three high-vulnerability supply chains: cereals, shellfish, and water.',
    ),
    para(
      'The consortium brings together 13 partners across 9 countries, including national food safety authorities, research institutes, a defence university, and industry federations, with an External Expert Advisory Board that includes EFSA, Europol, OPCW, and IAEA.',
    ),

    para('Project Objectives', 'h2'),
    bullet('Develop an AI-driven horizon scanning dashboard for anticipating food system shocks.'),
    bullet('Develop rapid targeted and untargeted detection methods for CBR agents.'),
    bullet('Develop and test methodologies for reducing the impact of CBR threats and accelerating recovery.'),
    bullet('Enhance coordination among EU and international security authorities.'),
    bullet('Create knowledge management and decision-support tools for stakeholders across the chain.'),
    bullet('Improve awareness and preparedness of food system actors through training and capacity building.'),

    para('Resilience Framework', 'h2'),
    para(
      'DEFENSEFOOD is built around three measurable dimensions of food chain resilience: the time factors (incubation, detection, recovery), the degree of impact of a shock, and the degree of recovery. The project operationalises these dimensions across six thematic work packages that trace the full arc of a contamination event, from anticipation through detection, impact reduction, learning, and knowledge management.',
    ),

    para('Use Cases', 'h2'),
    para(
      'Three supply chains were selected for their distinct vulnerability profiles and combined reach across the wider food system.',
    ),
    bullet(
      'Cereals: staple crops with global food security implications, vulnerable to biological threats (including climate-exacerbated mycotoxin risk) and radiological contamination.',
    ),
    bullet(
      'Shellfish: filter feeders that concentrate waterborne chemical toxins and biological agents, often consumed raw or minimally processed.',
    ),
    bullet(
      'Water: a cross-cutting medium that can propagate contamination rapidly across multiple food chains and is increasingly stressed by climate change.',
    ),

    para('Why This Matters for the Lab', 'h2'),
    para(
      'DEFENSEFOOD extends the lab\u2019s ongoing work on AI-enabled decision support for food systems, linking directly to our programs on food systems financing intelligence, digital tools for agri-food traceability, and capacity building in food safety. The blueprint and training tool developed under DEFENSEFOOD will be reusable beyond the CBR context, applicable to broader food safety and food security challenges that the lab addresses across European and African contexts.',
    ),
    para(
      'Several consortium partners are already collaborators of the lab through related Horizon Europe projects, including FCI4Africa and FS4Africa (with WR, RFF, Ubuntoo, and UniBw Munich), providing strong foundations for cross-project synergy.',
    ),

    para('Project Metadata', 'h2'),
    bullet('Full title: Detection and Enhanced Food Safety and Security through Efficient Networks for Supply Chain Enhancement.'),
    bullet('Funding programme: Horizon Europe, Cluster 3 (Civil Security for Society, Disaster-Resilient Society for Europe).'),
    bullet('Call: HORIZON-CL3-2024-DRS-01-01.'),
    bullet('Duration: 48 months.'),
    bullet('Coordinator: Sustainable Criminal Justice Solutions Europe (SCJS), Belgium.'),
    bullet('Scientific coordinator: Syreon Research Institute, Hungary.'),
    bullet('Consortium size: 13 partners across 9 countries.'),
    bullet('McGill role: Work Package 5 task leader on Knowledge Management.'),
    bullet('McGill effort: 19 person-months (17.75 PM in WP5, 1.25 PM in WP6).'),
  ],
  methodology: [
    para('McGill Contribution', 'h2'),
    para(
      'McGill University leads two tasks in Work Package 5 (Knowledge Management) and contributes to three additional tasks across WP4, WP5, and WP6. The work sits at the intersection of systems thinking, AI-enabled knowledge synthesis, and adaptive capacity building, translating the scientific outputs of the consortium into usable tools for food system actors.',
    ),

    para('Lead Roles', 'h2'),
    para('T5.2 Food Threat Management Blueprint (M1 to M20).', 'h3'),
    para(
      'McGill leads the development of a comprehensive Food Threat Management Blueprint that synthesises knowledge and insights from the literature, the three use cases, and consortium-wide stakeholder consultation. The blueprint uses systems thinking and process mapping to create a holistic framework covering the key components, processes, and interventions needed for effective food threat anticipation, detection, response, and mitigation. Development proceeds through two stages: knowledge synthesis from the curated platform and stakeholder inputs, followed by expert-tuned consolidation into an augmented, operational blueprint.',
    ),
    para('T5.4 Food Threat Capability and Training Tool (M20 to M42).', 'h3'),
    para(
      'McGill leads the design and development of an adaptive learning tool that assesses organisational and individual capabilities in food threat management and delivers personalised training paths. The tool is built as three integrated components:',
    ),
    bullet(
      'Expert-curated training module documentation, based on a knowledge and competency mapping procedure, yielding scenario-based training material.',
    ),
    bullet(
      'An AI and LLM-powered interactive training dashboard that processes user competency profiles, experience data, knowledge gaps, and interests to generate personalised learning paths, with gamification features for retention.',
    ),
    bullet(
      'A training recommendation system that integrates, ethically and with proper API governance, relevant modules from trusted external platforms.',
    ),
    para(
      'The tool is designed to interface directly with the Knowledge Platform and Solution Engine (T5.1) and serves stakeholders across industry, policy, emergency response, academia, technology providers, and the public.',
    ),

    para('Contributing Roles', 'h2'),
    bullet(
      'T5.1 Knowledge Platform and Solution Engine: contributing to the design of the AI-enabled, expert-curated knowledge hub led by Ubuntoo.',
    ),
    bullet(
      'T5.3 Blueprint validation and iterative refinement: contributing to scenario-based stress testing and iterative validation of the blueprint.',
    ),
    bullet(
      'T4.1 Strategic Security Options: contributing to the analysis of strategic responses to intentional food threats, led by UniBw Munich.',
    ),
    bullet('T6.1 Dissemination, Exploitation and Communication: standard consortium-wide contribution.'),

    para('External Expert Advisory Board', 'h2'),
    para(
      'EFSA, Europol, OPCW, IAEA, and independent experts provide strategic, scientific, ethical, and security oversight.',
    ),
  ],
  outcomes: [
    para('McGill-led Deliverables', 'h2'),
    bullet('D5.2 Comprehensive Blueprint Document and Implementation Tool Kit (M20).'),
    bullet('D5.4 Interactive Training Platform with Skill Assessment and Certification (M42).'),
  ],
  collaborators: [
    { name: 'Sustainable Criminal Justice Solutions Europe (SCJS)', institution: 'Belgium (Coordinator)' },
    { name: 'Syreon Research Institute', institution: 'Hungary (Scientific Coordinator)' },
    { name: 'Stichting Wageningen Research (WFSR / WECR)', institution: 'Netherlands' },
    { name: 'Rijksinstituut voor Volksgezondheid en Milieu (RIVM)', institution: 'Netherlands' },
    { name: 'Ubuntoo BV', institution: 'Netherlands' },
    { name: 'Reframe Food (RFF)', institution: 'Greece' },
    { name: 'Sciensano', institution: 'Belgium' },
    { name: 'Universität der Bundeswehr München', institution: 'Germany' },
    { name: 'Consiglio Nazionale delle Ricerche (CNR)', institution: 'Italy' },
    { name: 'Federación Española de Industrias de la Alimentación y Bebidas (FIAB)', institution: 'Spain' },
    { name: 'Fraunhofer IGD', institution: 'Germany' },
    { name: 'National Food Chain Safety Office (Nebih)', institution: 'Hungary' },
  ].map((c) => ({ ...c, _key: mkKey() })),
  funding: [
    {
      _key: mkKey(),
      agency: 'European Commission, Horizon Europe (Cluster 3, Civil Security for Society)',
      grantNumber: 'HORIZON-CL3-2024-DRS-01-01',
      currency: 'EUR',
    },
  ],
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function run() {
  const overwrite = process.argv.includes('--overwrite')
  const reset = process.argv.includes('--reset')

  if (reset) {
    console.log('Resetting: deleting every existing project document...')
    const existing = await client.fetch<{ _id: string; title: string }[]>(
      `*[_type == "project"]{ _id, title }`,
    )
    for (const p of existing) {
      // Unset references from any document that points at this project.
      const referrers = await client.fetch<Array<Record<string, unknown>>>(
        `*[references($id)]{ ... }`,
        { id: p._id },
      )

      for (const ref of referrers) {
        const fieldCandidates = ['relatedProjects', 'projects']
        const unsetPaths: string[] = []
        for (const field of fieldCandidates) {
          const value = ref[field] as Array<{ _ref?: string }> | undefined
          if (Array.isArray(value) && value.some((v) => v?._ref === p._id)) {
            unsetPaths.push(`${field}[_ref=="${p._id}"]`)
          }
        }
        if (unsetPaths.length > 0) {
          await client.patch(ref._id as string).unset(unsetPaths).commit()
          console.log(
            `    · unlinked ${String(ref._type)} ${String(ref._id)} (${unsetPaths.join(', ')})`,
          )
        }
      }

      await client.delete(p._id)
      console.log(`  ✖ deleted ${p.title} (${p._id})`)
    }
    console.log(`  Removed ${existing.length} project document(s).`)
  }

  const docs = [fci4africa, defensefood]
  for (const doc of docs) {
    try {
      const result =
        overwrite || reset
          ? await client.createOrReplace(doc)
          : await client.createIfNotExists(doc)
      const tag = reset ? ' [after reset]' : overwrite ? ' [overwritten]' : ''
      console.log(`✔ ${doc.title} (${result._id})${tag}`)
    } catch (err) {
      console.error(`✖ Failed to seed ${doc.title}:`, err)
      process.exitCode = 1
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
