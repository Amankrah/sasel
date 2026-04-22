# SASEL Lab Website

> **Sustainable Agri-food Systems and Environment Lab**
> McGill University

A Next.js + Sanity CMS site showcasing the research, members, publications, and software platforms of the SASEL Lab at McGill University.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

The site surfaces:

- Lab members (PI, postdocs, PhDs, Masters students, staff, alumni)
- Research projects
- Technologies, software platforms built by the lab (e.g. [EcoDish365](https://ecodish365.com/))
- Publications, auto-synced from Google Scholar via SerpAPI
- Grants, awards, collaborations, partnerships
- News and announcements

Content is authored in **Sanity Studio** (embedded at `/studio`). There is no separate backend, the site is a single Next.js app that reads from Sanity's managed CDN.

## Technology stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, React 19, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **CMS**: [Sanity](https://www.sanity.io/) (managed, embedded Studio at `/studio`)
- **Publication sync**: [SerpAPI](https://serpapi.com/) Google Scholar Author endpoint, scheduled via Vercel Cron
- **Hosting**: Vercel (frontend + Sanity CDN)

## Project structure

```
sasel_lab/
├── frontend/                              # Next.js app (single deployable)
│   ├── src/
│   │   ├── app/                           # App Router pages
│   │   │   ├── page.tsx                   # Home
│   │   │   ├── members/                   # /members and /members/[slug]
│   │   │   ├── projects/                  # /projects and /projects/[slug]
│   │   │   ├── technologies/              # /technologies and /technologies/[slug]
│   │   │   ├── publications/              # /publications
│   │   │   ├── news/                      # /news and /news/[slug]
│   │   │   ├── studio/                    # Sanity Studio (embedded)
│   │   │   └── api/cron/sync-publications # Vercel Cron route handler
│   │   ├── components/                    # Reusable React components
│   │   ├── lib/serpapi-sync.ts            # Google Scholar → Sanity sync logic
│   │   └── sanity/
│   │       ├── schemaTypes/               # member, project, technology, publication,
│   │       │                              # grant, award, collaboration, partnership, news
│   │       ├── lib/                       # Sanity client, GROQ queries, TS types
│   │       └── structure.ts               # Studio navigation
│   ├── scripts/
│   │   ├── seed-technologies.ts           # One-off seed for Technology documents
│   │   ├── import-from-django.ts          # Historical Django → Sanity migration
│   │   └── sync-publications.ts           # Manual Scholar sync (mirror of the cron)
│   ├── vercel.json                        # Vercel cron schedule
│   ├── .env.example                       # Required env vars template
│   └── package.json
└── README.md
```

## Getting started

### Prerequisites

- **Node.js** 18.17+
- **npm**
- A **Sanity** project (dataset id, project id, and an Editor-role API token)

### Setup

```bash
cd frontend
cp .env.example .env.local   # then fill in the values
npm install
npm run dev
```

The site runs at `http://localhost:3000`. The Sanity Studio is embedded at `http://localhost:3000/studio`.

### Environment variables

All defined in `frontend/.env.local` (see `frontend/.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_WRITE_TOKEN` | Editor-role token, needed for seed scripts and the publication sync |
| `SERPAPI_KEY` | Required for the Google Scholar sync |
| `CRON_SECRET` | Any random high-entropy string, used to authenticate Vercel Cron calls |

## Authoring content

Open `/studio` in the running app (or the deployed URL) and sign in to Sanity. The Studio exposes:

- **Lab Members**, grouped by PI / Current / Alumni
- **Publications**, filterable by type (journal, conference, book, etc.)
- **Projects**, filterable by status (active, completed, upcoming)
- **Technologies**, filterable by lifecycle (live, beta, in development, deprecated)
- **Grants & Partnerships**, grants, awards, collaborations, partnerships
- **News & Announcements**
- **Site Settings** (singleton)

## Publication sync (Google Scholar → Sanity)

Publications are kept in sync automatically via a **Vercel Cron** that fires the `/api/cron/sync-publications` route weekly (Mondays 03:00 UTC, configured in `frontend/vercel.json`).

For each member in Sanity that has a `googleScholarId`, the route fetches their Scholar author page from SerpAPI and upserts publications into Sanity. The sync uses `setIfMissing` so any field you've curated in Studio is **never** overwritten.

### Manual run (local)

```bash
cd frontend
npm run sync:publications
```

### Manual run (production)

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://<your-site>/api/cron/sync-publications
```

## One-off scripts

| Script | Purpose |
|---|---|
| `npm run seed:technologies` | Create the EcoDish365 Technology document (idempotent) |
| `npm run import:django` | Import data from a legacy Django export (no longer needed; retained for reference) |
| `npm run sync:publications` | Trigger the Scholar sync locally |

All scripts require `SANITY_WRITE_TOKEN`; `sync:publications` also requires `SERPAPI_KEY`.

## Development

```bash
npm run dev       # start with Turbopack at :3000
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
```

## Deployment

The site deploys to **Vercel** as a single Next.js app:

1. Import the repo into Vercel.
2. Set the project root to `frontend/`.
3. Add environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_WRITE_TOKEN`, `SERPAPI_KEY`, `CRON_SECRET`) in Project Settings → Environment Variables.
4. Deploy. `frontend/vercel.json` registers the weekly Scholar sync cron automatically.

## Contributing

1. Branch: `git checkout -b feature/your-feature`
2. Commit: `git commit -m "your change"`
3. Push and open a Pull Request.

## License

MIT.

## Contact

SASEL Lab, Sustainable Agri-food Systems and Environment Lab, McGill University. For questions, contact the lab directly.
