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
    "The world's first environmental nutrition decision system, uniting nutrition science, environmental impact, and health outcomes.",
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
    'Food Compass Score (FCS): 9 domains, 54 attributes',
    'Healthy Eating Food Index (HEFI): 10 components',
    'Health & Nutritional Impact (HENI): DALY-based',
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
    'Life Cycle Assessment built for African food systems, helping farms and processors measure impact and reach global markets.',
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
      'Green Means Go is a Life Cycle Assessment platform built for the African agri-food value chain. It helps smallholder and commercial farms, processors, and exporters understand the environmental footprint of their operations, and use that evidence to reach global markets that increasingly require verified sustainability data.',
    ),
    para(
      'The platform launches with country-specific support for Ghana and Nigeria, with expansion planned across the continent. Farm assessments complete in 15–20 minutes and processing assessments in 10–15 minutes, producing ISO 14040/14044-compliant results that align with EU CBAM, EUDR, and AfCFTA requirements.',
    ),
  ],
  methodology: [
    para('Life Cycle Assessment', 'h3'),
    para(
      'Assessments follow the ISO 14040 and ISO 14044 standards. Results are reported across eight midpoint impact categories (including climate in kg CO₂-equivalent, water use in m³, land use in m²-years, and biodiversity) and three endpoint categories: human health, ecosystem quality, and resource scarcity.',
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
    'Complete protein processing simulation, from raw seed to fractionated flour, with GPU-accelerated physics validated against NRC Canada experimental data.',
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
      'ProteinProcessIO is a physics-based desktop simulation platform for plant protein fractionation. It couples three processing stages (RF dielectric pretreatment, hammer milling, and multi-stage air classification) into a single pipeline, letting researchers run virtual experiments that would be expensive, slow, or simply unobservable on physical equipment.',
    ),
    para(
      'The platform was developed at McGill University in partnership with the National Research Council Canada, with concept work starting in 2023 and a public release in 2025. It emphasizes scientific validation, GPU-accelerated performance, and accessibility, and is offered free for research and academic use.',
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
      'Models are calibrated against NRC Canada experimental data (PLC logs, temperature measurements, NIR moisture analysis, and measured particle-size distributions), so simulation results track physical equipment closely.',
    ),
  ],
}

const soyaFlow = {
  _id: 'technology-soyaflow',
  _type: 'technology',
  title: 'SoyaFlow',
  slug: { _type: 'slug', current: 'soyaflow' },
  tagline:
    'AI-powered soybean meal distribution platform combining predictive reorder forecasting, real-time inventory tracking, and optimized route planning.',
  status: 'LIVE',
  isFeatured: true,
  featuredOrder: 4,
  accentColor: 'indigo',
  website: 'https://soyaflow.com/en',
  githubRepo: 'https://github.com/Amankrah/soya_excel',
  categories: [
    'Supply Chain Optimization',
    'Machine Learning',
    'Logistics',
    'Route Planning',
    'Agricultural Technology',
  ],
  techStack: [
    'Next.js 14',
    'TypeScript',
    'Django 5.2',
    'Django REST Framework',
    'XGBoost',
    'DBSCAN / KMeans clustering',
    'Google Maps API',
    'JWT auth',
    'Tailwind CSS',
    'Shadcn UI',
  ],
  keyFeatures: [
    'XGBoost reorder-prediction model trained on 62 features, reaching 95% accuracy',
    'Replaces expensive IoT bin sensors (over $110K per site) with ML forecasts',
    'DBSCAN and KMeans clustering for delivery route optimization',
    'Google Maps integration with GPS tracking and delivery scheduling',
    'Client management with priority alerts and geocoding',
    'Order workflow from pending to delivered, with batch and expedition tracking',
    'Inventory control across product types (Trituro 44%, Dairy Trituro, Oil)',
    'Weekly distribution planning cycle (Tuesday planning, Friday finalization)',
    'KPI dashboards for efficiency, monthly usage trends, and low-stock alerts',
    'Scope 3 emissions tracking across the distribution fleet',
  ],
  targetUsers: [
    'Soya Excel distribution managers and planners',
    'Delivery drivers and dispatch teams',
    'Farmer clients receiving soybean meal shipments',
    'Operations leadership tracking fleet and inventory KPIs',
  ],
  description: [
    para(
      'SoyaFlow is a unified distribution and logistics platform built for Soya Excel, spanning operations across Canada, the United States, and Spain. It combines machine learning, GIS, and a modern web interface to coordinate soybean meal supply from inventory to farmer delivery.',
    ),
    para(
      'Instead of installing expensive IoT bin sensors at every customer site, SoyaFlow uses an XGBoost model trained on 62 historical and operational features to predict when each farmer will reorder. Managers get reorder alerts, drivers get optimized multi-stop routes, and leadership gets KPI dashboards that reveal fleet efficiency and demand trends.',
    ),
  ],
  methodology: [
    para('Predictive Reorder Modeling', 'h3'),
    para(
      'A gradient-boosted tree model (XGBoost) learns from 62 engineered features, including historical order cadence, seasonality, geography, product mix, and livestock-cycle signals. The model reaches roughly 95% accuracy on reorder prediction, giving the scheduling team a week of forward visibility without physical sensors.',
    ),
    para('Route Optimization', 'h3'),
    para(
      'Daily delivery routes are built by clustering farmer stops with DBSCAN and KMeans, then routed through Google Maps for drive-time and distance estimates. The system balances truck capacity, delivery windows, and clustering geometry to minimize empty miles.',
    ),
    para('Operational Workflow', 'h3'),
    para(
      'The platform runs a weekly cycle (Tuesday planning, Friday finalization) with role-scoped views for managers, drivers, and client-facing staff. Orders move through a pending-to-delivered workflow with batch and expedition tracking, while inventory and low-stock alerts keep production synced with demand.',
    ),
    para('Sustainability', 'h3'),
    para(
      'Scope 3 emissions tracking across the distribution fleet turns logistics data into a sustainability lens, supporting procurement and reporting requirements alongside operational efficiency.',
    ),
  ],
}

const fsfiRwanda = {
  _id: 'technology-fsfi-rwanda',
  _type: 'technology',
  title: 'FSFI (Rwanda)',
  slug: { _type: 'slug', current: 'fsfi-rwanda' },
  tagline:
    'Food Systems Financing Intelligence platform helping the Government of Rwanda and its development partners allocate funds strategically across food systems using 37 indicators aligned with PSTA 5.',
  status: 'LIVE',
  isFeatured: true,
  featuredOrder: 5,
  accentColor: 'rose',
  website: 'https://rwanda.fsfvi.ai/',
  githubRepo: 'https://github.com/Amankrah/fsfvi',
  categories: [
    'Public Finance',
    'Food Systems',
    'Decision Support',
    'Policy and Planning',
    'Budget Analytics',
  ],
  techStack: [
    'TypeScript',
    'Next.js',
    'Python',
    'Rust',
    'Django',
  ],
  keyFeatures: [
    'Food System Financing Stress Index (FSFSI) computed from 37 national indicators across 8 components',
    'National financing stress tracking for Crop Production, Animal Systems, Post-Harvest, Markets, Nutrition, Finance, Research, and Environment',
    'Programme-linked spending analysis with multi-year budget tracing',
    'Planning optimization and scenario stress-testing for policy trade-offs',
    'Geographic and fiscal-year trend monitoring',
    'Government credential authentication with role-scoped dashboards',
    'Alignment with Rwanda Strategic Plan for Agriculture Transformation (PSTA 5)',
    'Evidence base for donor coordination and alignment discussions',
  ],
  targetUsers: [
    'Rwanda Ministry of Agriculture and Animal Resources',
    'Other Rwandan government ministries and planning bodies',
    'Development partners and donors engaged in Rwanda',
    'International Food Policy Research Institute (IFPRI) and research partners',
    'National statistical and budget analysts',
  ],
  description: [
    para(
      'FSFI (Food Systems Financing Intelligence) is a decision-support platform created for the Government of Rwanda, developed collaboratively with the Ministry of Agriculture and Animal Resources, AKADEMIYA2063, IFPRI, and McGill University. It helps leaders see how public and partner funding flows across the food system, where stress is building up, and which programmes are moving the needle on national strategy.',
    ),
    para(
      'Food system budgets must cover many priorities at once. FSFI turns that complexity into clear answers: where money does the most good, how spending links to resilience, and how to explain trade-offs to development partners and the public.',
    ),
  ],
  methodology: [
    para('FSFSI Framework', 'h3'),
    para(
      'The platform computes the Food System Financing Stress Index (FSFSI), which aggregates 37 national indicators organized into 8 components: Crop Production, Animal Systems, Post-Harvest, Markets, Nutrition, Finance, Research, and Environment. Each component captures financing pressures and performance volatility relative to PSTA 5 targets.',
    ),
    para('Budget Mapping', 'h3'),
    para(
      'A budget-lines-to-indicators mapping traces every programme and budget line to the food-system indicators it influences, enabling multi-year spending analysis and scenario comparisons at both component and indicator level.',
    ),
    para('Scenario Stress-Testing', 'h3'),
    para(
      'Planning tools let users reallocate funds or adjust programme targets and see how the stress index shifts across components, supporting evidence-based budget negotiations and donor alignment.',
    ),
    para('Architecture', 'h3'),
    para(
      'The stack combines a Next.js and TypeScript frontend, a Python backend for pipelines and business logic, and a Rust computational layer for performance-critical index calculations. Government credential authentication and role-scoped dashboards keep sensitive budget data controlled.',
    ),
  ],
}

const fsvc = {
  _id: 'technology-fsvc',
  _type: 'technology',
  title: 'Food System Value Analytics (FSVC)',
  slug: { _type: 'slug', current: 'fsvc' },
  tagline:
    'Production-ready data collection and analytics platform for food system research, value chain analysis, and agricultural surveys, with offline-first tablet data capture.',
  status: 'LIVE',
  isFeatured: true,
  featuredOrder: 6,
  accentColor: 'slate',
  website: 'https://foodsystemsanalytics.com/',
  githubRepo: 'https://github.com/Amankrah/fsvc',
  documentationUrl: 'https://foodsystemsanalytics.com/app/',
  categories: [
    'Research Tool',
    'Data Collection',
    'Value Chain Analysis',
    'Survey Platform',
    'Analytics',
  ],
  techStack: [
    'Django 5.0',
    'Django REST Framework',
    'FastAPI (analytics microservice)',
    'PostgreSQL',
    'Celery',
    'Redis',
    'React Native',
    'Expo',
    'TypeScript',
    'Zustand',
    'Pandas',
    'NumPy',
    'SciPy',
    'Scikit-learn',
  ],
  keyFeatures: [
    'Offline-first mobile data collection with background sync and timestamp-based conflict resolution',
    '12+ question types including text, numeric, choice, rating, date, GPS location, and images',
    'Auto-generated respondent IDs, real-time validation, and progress tracking',
    'Project collaboration with 5 roles across 10 permissions and invitation tokens',
    'Response quality scoring, respondent tracking, and device metadata capture',
    'Analytics microservice providing descriptive, inferential, text, and qualitative analysis',
    'Drag-and-drop form builder with conditional logic and validation rules',
    'CSV export and data-visualization tools',
    'Tablet-optimized React Native client for field teams on iOS, Android, and web',
    'JWT authentication with encrypted token storage and automatic refresh',
  ],
  targetUsers: [
    'Food-system and value-chain researchers',
    'Universities and research institutes running field surveys',
    'Agricultural economists and sustainability analysts',
    'NGO and development-partner programme evaluators',
    'Field enumerators collecting data offline in the field',
  ],
  description: [
    para(
      'Food System Value Analytics (FSVC) is a production-ready platform that combines structured data collection with built-in analytics for food-system research, value chain analysis, and agricultural surveys. Researchers design studies, invite field teams, collect responses offline on tablets, and run statistical analysis from a single tool.',
    ),
    para(
      'The platform is built for real field conditions: poor connectivity, multi-enumerator teams, mixed question types including GPS and images, and the need to merge responses cleanly when devices reconnect. It ships with role-based project collaboration and a deployment-ready backend so research groups can stand up studies without engineering overhead.',
    ),
  ],
  methodology: [
    para('Offline-First Data Capture', 'h3'),
    para(
      'The React Native client stores responses locally and syncs in the background when connectivity returns. Timestamp-based conflict resolution reconciles edits across devices, so teams can work in the field without risking data loss or duplication.',
    ),
    para('Form Builder and Validation', 'h3'),
    para(
      'Researchers compose questionnaires using 12+ question types (text, numeric, single and multiple choice, rating scales, date and datetime, GPS location, images, and more), with drag-and-drop ordering, conditional logic, and validation rules. Auto-generated respondent IDs and real-time validation keep incoming data clean.',
    ),
    para('Analytics Microservice', 'h3'),
    para(
      'A dedicated FastAPI analytics service runs beside the Django core. It auto-detects variable types and suggests appropriate analyses, then runs descriptive statistics, inferential tests, text analysis (NLTK-backed), and visualizations, all without leaving the platform.',
    ),
    para('Collaboration and Security', 'h3'),
    para(
      'Projects use role-based access with five roles across ten permissions, plus expiring invitation tokens. Authentication is JWT with encrypted token storage on device and automatic refresh, following standard security practices for sensitive research data.',
    ),
  ],
}

const defenseFood = {
  _id: 'technology-defensefood',
  _type: 'technology',
  title: 'DefenseFood',
  slug: { _type: 'slug', current: 'defensefood' },
  tagline:
    'EU Food Fraud Vulnerability Intelligence System that detects supply-chain fraud risks using 43 quantitative models across commodity dependency, trade anomalies, hazard propagation, and network exposure.',
  status: 'IN_DEVELOPMENT',
  isFeatured: false,
  featuredOrder: 7,
  accentColor: 'indigo',
  githubRepo: 'https://github.com/Amankrah/defensefood',
  categories: [
    'Food Fraud',
    'Risk Intelligence',
    'Trade Analytics',
    'Network Analysis',
    'Policy Support',
  ],
  techStack: [
    'Next.js',
    'React 19',
    'TypeScript',
    'FastAPI',
    'Python 3.10+',
    'Rust (PyO3 / Maturin)',
    'Pandas',
    'NumPy',
    'Pydantic',
  ],
  keyFeatures: [
    '43 quantitative formulas organized across 7 model groups',
    'Commodity dependency metrics (IDR, OCS, BDI, HHI, SSR, SCI)',
    'Hazard intensity modeling with time decay and RASFF integration (HIS, HDI, DGI)',
    'Trade-flow anomaly detection (z-scores, mirror trade discrepancy)',
    'Network exposure graph analysis (ORPS, ACEP)',
    'Composite vulnerability scoring with weighted linear, geometric, or hybrid modes',
    '638 scored trade corridors across 60 network nodes',
    '1,746 RASFF notifications processed into the hazard layer',
    '17 REST endpoints with live parameter reconfiguration',
    '75 unit tests validating calculations against PDF worked examples',
  ],
  targetUsers: [
    'EU food safety and trade regulators',
    'National competent authorities and customs analysts',
    'Food-fraud researchers and policy advisors',
    'Commodity supply-chain risk managers',
  ],
  description: [
    para(
      'DefenseFood is a food-fraud vulnerability intelligence system built around a mathematical framework of 43 formulas across 7 model groups. It ingests bilateral trade flows from UN Comtrade, hazard notifications from RASFF, and production and consumption data from FAOSTAT and Eurostat, then scores European food trade corridors for fraud vulnerability.',
    ),
    para(
      'The platform is in active development as a research deliverable, aimed at regulators and policy analysts who need defensible, reproducible risk scores rather than black-box intuition. Each formula is unit-tested against worked examples, and the scoring configuration can be adjusted live through the API without restarting the pipeline.',
    ),
  ],
  methodology: [
    para('Quantitative Risk Framework', 'h3'),
    para(
      'The Rust engine implements six computational modules: commodity dependency (IDR, OCS, BDI, HHI, SSR, SCI), consumption and demand (PCC, CRS, DIS), hazard intensity (HIS, HDI, DGI), trade-flow anomalies (z-scores, mirror trade discrepancy), network exposure (ORPS, ACEP), and composite scoring with normalization. Each module is exposed to Python through PyO3 bindings for low-latency recomputation.',
    ),
    para('Data Integration', 'h3'),
    para(
      'Ingestion pipelines pull bilateral trade flows from UN Comtrade, hazard notifications from the RASFF Window, and production and consumption series from FAOSTAT and Eurostat. A Python orchestration layer harmonizes identifiers, handles missing data, and prepares inputs for the Rust engine.',
    ),
    para('Corridor Scoring and Network View', 'h3'),
    para(
      'The system scores individual trade corridors (HS code, destination, origin) and rolls them up into a network view. Composite scoring supports weighted linear, geometric mean, or hybrid approaches, with time-decayed hazard intensity so recent notifications dominate the signal. 638 scored corridors across 60 nodes seed the initial European network.',
    ),
    para('Three-Tier Architecture', 'h3'),
    para(
      'The stack separates concerns: a Next.js and TypeScript dashboard on port 3000, a FastAPI service on port 8000 with 17 REST endpoints and 7 routers, and a Rust core (defensefood_core) compiled via Maturin. Scoring parameters can be updated through the API for live what-if analysis.',
    ),
  ],
}

async function run() {
  const overwrite = process.argv.includes('--overwrite')
  const docs = [ecodish365, greenMeansGo, proteinProcess, soyaFlow, fsfiRwanda, fsvc, defenseFood]
  for (const doc of docs) {
    try {
      const result = overwrite
        ? await client.createOrReplace(doc)
        : await client.createIfNotExists(doc)
      console.log(`✔ ${doc.title} (${result._id})${overwrite ? ' [overwritten]' : ''}`)
    } catch (err) {
      console.error(`✖ Failed to seed ${doc.title}:`, err)
      process.exitCode = 1
    }
  }
}

run()
