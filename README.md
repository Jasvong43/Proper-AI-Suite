# Proper AI Suite

Eight specialized AI agents behind one orchestrator, deployed as a single edge Worker.

## Project Overview

- **Name**: Proper AI Suite (`proper-ai-suite`)
- **Goal**: Unify eight standalone AI-agent apps into one navigable suite with a shared
  backend — running on Cloudflare Workers instead of a Node server.
- **Stack**: Hono + TypeScript on Cloudflare Workers · D1 (SQLite) · static assets
- **Theme**: Midnight Slate `#020617` / Neon Cyan `#00f3ff` (suite standard)

## URLs

| Surface | Path |
|---|---|
| Launcher | `/` |
| ProperOS | `/apps/ProperOS/` |
| ProperViral | `/apps/ProperViral/` |
| ProperStory | `/apps/ProperStory/` |
| ProperVoCaL | `/apps/ProperVoCaL/` |
| ProperPixelz | `/apps/ProperPixelz/` |
| ProperFuzion | `/apps/ProperFuzion/` |
| ProperSocialz | `/apps/ProperSocialz/` |
| ProperFlux | `/apps/ProperFlux/` |
| Journal | `JOURNAL.md` |

Production URL is returned by `gsk hosted worker_get` after deploy.

## The Suite

| App | Role |
|---|---|
| **ProperOS** | Orchestrator — commands the six specialist agents, runs the full-suite pipeline |
| **ProperViral** | YouTube ideation, niche analysis, growth blueprint |
| **ProperStoryz** | Viral script architect, production packets, PDF export |
| **ProperVoCaL** | Voice synthesis and audio engineering |
| **ProperPixelz** | Image/video generation studio, batch processing |
| **ProperFuzion** | AI video producer |
| **ProperSocialz** | Multi-platform social orchestration (7 networks) |
| **ProperFlux** | Trading dashboard and Web3 / Token-NFT engine |

## API Reference

All JSON. Base path `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness + runtime check |
| `GET` | `/status` | Agent registry — `{ viral: { name, status, kbVersion, lastUpdated } }` |
| `POST` | `/execute` | `{ command, type }`. `type:"workflow"` creates a project, writes a KB entry, marks Viral processing |
| `POST` | `/sync` | Touch every agent, write a sync marker per agent |
| `GET` | `/projects?limit=` | Recent campaigns (default 50, max 200) |
| `PATCH` | `/projects/:id` | `{ status }` — e.g. `Complete` |
| `GET` | `/kb?agent=&limit=` | Knowledge-base entries (the Obsidian replacement) |
| `GET` | `/stats` | `{ projects, kbEntries, activeAgents }` |

`/api/status` preserves the original Express response shape, so ProperOS's existing
`updateAgentStatus()` works unchanged.

## Data Architecture

Three D1 tables. **D1 is the only storage** — no KV, no R2, no cron.

| Table | Purpose |
|---|---|
| `agents` | Agent registry: `key`, `name`, `status`, `kb_version`, `last_updated` |
| `projects` | Campaigns: `id`, `name`, `command`, `status`, timestamps |
| `kb_entries` | Knowledge base: `agent`, `content`, `mapping` (JSON), timestamp |

The `kb_entries` table replaces the original `writeToObsidian()` function, which did
`fs.appendFileSync` into a hardcoded `C:/Users/jsmit/Documents/ProperAI_Vault` path.
There is no filesystem on Workers, and that path never existed anywhere but one dev box.

The schema self-bootstraps: `ensureSchema()` creates the tables and seeds the seven agent
rows on first request if `agents` is empty. Migrations also exist in `migrations/` for
local work.

## How It's Wired

```
Proper*/index.html            ← source apps (each beside its CLAUDE.md)
        │  scripts/sync-apps.mjs  (npm run build → "sync:apps")
        ▼
public/apps/<Name>/index.html ← static assets
        │  wrangler "assets" (assets-first serving)
        ▼
/  → Hono worker (launcher + /api/*)      /apps/X/ → static file, worker not invoked
```

The sync script also rewrites any `http://localhost:3000/api` baked into shipped frontend
to a relative `/api` — a browser resolving `localhost` otherwise hits the visitor's own
machine. It repairs exactly one: `ProperOS/index.html`.

## User Guide

1. Open `/` — the launcher lists all eight agents with roles and descriptions.
2. Click any card to open that agent.
3. In **ProperOS**, use the command center:
   - `launch a new campaign for <topic>` → creates a project, kicks the 6-agent pipeline
   - `status` → reports suite health
4. Watch the pipeline animate Viral → Storyz → VoCaL → Pixelz → Fuzion → Socialz.

## Local Development

```bash
npm install
npm run build                    # sync apps into public/apps
npm run db:migrate:local         # apply migrations
npm run db:seed                  # seed agent rows
npm run dev                      # wrangler dev on :3000
```

Serve as a daemon:

```bash
fuser -k 3000/tcp; pm2 start ecosystem.config.cjs
pm2 logs proper-ai-suite --nostream
```

> **Restart trap:** `pm2 restart` orphans the `workerd` child, which keeps the listening
> socket while the rebuilt worker never gets served — a fix appears to have no effect.
> Kill by port (`fuser -k 3000/tcp`), not only via PM2.

## Deployment

- **Platform**: Cloudflare Workers for Platform (Genspark-managed account)
- **Command**: `gsk hosted deploy` (approval handshake) → `gsk hosted action_wait --id <id>`
- **Bindings**: exactly one D1 (`DB`). No KV / cron / DO / queues — unsupported on the
  hosted pipeline.
- **Status**: see `JOURNAL.md` for the deployed URL

## Known Gaps / Next Steps

- **Auth is absent.** Every API route is public. `/api/execute` and `/api/sync` are writes
  with no protection. Before real traffic, gate them (hosted access rules or in-app auth).
- **`simulateCampaign` is client-side.** The ProperOS pipeline animation uses `setTimeout`
  and random scores in the browser; nothing calls `/api/execute`. The backend is ready —
  wiring the UI to it is the next real step.
- **No agent intelligence yet.** The eight agents are UI shells; no LLM calls are wired.
- **ProperFlux and ProperViral** are not in the original six-agent pipeline; they're in the
  registry for completeness.
- **Express backend retained** at `ProperOS/backend/server.js` for reference only. It cannot
  run on the edge and is superseded by `src/routes/api.ts`.

## Repository

`github.com/Jasvong43/Proper-AI-Suite`
Query `gsk hosted worker_get` for the live URL.

---
**Last Updated**: 2026-10-24 · See `JOURNAL.md` for the full engineering log.
