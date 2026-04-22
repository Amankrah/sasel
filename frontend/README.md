# SASEL Lab Website (Frontend)

Next.js 15 app for the SASEL Lab site. Reads content from Sanity; authoring happens in the embedded Studio at `/studio`. No separate backend.

## Prerequisites

- Node.js 18.17+
- A Sanity project (project id, dataset, Editor-role API token)

## Setup

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Studio is at [http://localhost:3000/studio](http://localhost:3000/studio).

## Environment variables

See `.env.example`. At minimum you need:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (e.g. `2024-01-01`)
- `SANITY_WRITE_TOKEN`, only needed for seed scripts and the publication sync (Editor role)
- `SERPAPI_KEY`, required for the Google Scholar sync
- `CRON_SECRET`, any random high-entropy string used by the Vercel Cron route

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed:technologies` | Seed the EcoDish365 Technology document |
| `npm run import:django` | Import a legacy Django export (historical) |
| `npm run sync:publications` | Pull latest Google Scholar publications into Sanity |

## Project structure

- `src/app/`, App Router pages (members, projects, technologies, publications, news, studio, api/cron)
- `src/components/`, Reusable React components
- `src/sanity/`, Sanity schemas, client, GROQ queries, TS types, Studio structure
- `src/lib/serpapi-sync.ts`, Shared logic for the Google Scholar sync (used by both the cron route and the CLI script)
- `scripts/`, One-off Node scripts (`tsx`-run)
- `vercel.json`, Weekly cron schedule for `/api/cron/sync-publications`

## Publication sync

`/api/cron/sync-publications` is a Route Handler fired weekly by Vercel Cron (Mondays 03:00 UTC). It authenticates via `Authorization: Bearer ${CRON_SECRET}`, fetches every member with a `googleScholarId` from Sanity, and upserts their publications via SerpAPI. It uses `setIfMissing`, so any fields you've edited in Studio are **never** overwritten.

Trigger manually:

```bash
# locally
npm run sync:publications

# on the deployed site
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-site>/api/cron/sync-publications
```

## Deployment

Deploy to Vercel with `frontend/` as the project root. Set all env vars in Project Settings → Environment Variables. `vercel.json` picks up the cron schedule automatically.
