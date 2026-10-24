# Proper AI Suite — Engineering Journal

A running log of every change made to the suite. Newest entries at the bottom.

---

## 2026-10-24 — Session 1: Repo Resurrection + Unified Deploy

**Operator:** Bruce (AI Consultant) · **Agent context:** Genspark sandbox
**Repo:** `Jasvong43/Proper-AI-Suite` @ `main`
**Baseline commit:** `b46c372` — "Resolve merge conflict in ProperOS/index.html and keep local state management logic"

### State of the union at session start

| Metric | Value |
|---|---|
| Tracked files | 655 |
| Files that are `node_modules` | 626 (95.6%) |
| Repo size | 6.1 MB |
| Apps shipped | 8 single-file HTML SPAs |
| Build pipeline | none |
| `.gitignore` | **did not exist** |
| Cross-app navigation | **none — 8 islands** |
| Deploy target | none configured |

### Findings

**F1 — ProperOS was completely broken (CRITICAL).**
`ProperOS/index.html:638` contained an orphaned merge-conflict marker `>>>>>>> origin/main`,
sitting *inside* the `<script>` block, immediately after `console.error('Failed to update agent status', e);`
and before the `catch` block's closing brace. A bare `>>>>>>> origin/main` token is invalid JavaScript,
so the entire script for ProperOS threw a `SyntaxError` at parse time and **none** of its logic ran.
Prior commit claimed to "resolve merge conflict" — it removed the opening `<<<<<<<` and `=======`
but left the trailing `>>>>>>>`. Classic.

**F2 — 626 vendored dependency files committed to git.** `ProperOS/backend/node_modules` was
fully tracked with no `.gitignore` in the repo at all.

**F3 — Stale duplicate app files with literal backticks in the filename.**
`ProperFuzion/`, `ProperOS/`, `ProperPixelz/`, `ProperStory/` each contained an `index.html\`` file.
These were *not* identical to the live file — they were earlier drafts (older titles such as
"ProperPixelz — AI Visual Studio" vs the current "AI Visual Engine"; ProperStory's copy missing the
`html2pdf` CDN import; ProperOS's copy using the old `showView()` router). All four were introduced
in the initial commit `9942d6a` and never subsequently modified. Superseded, dead weight.

**F4 — Backend cannot run at the edge.** `ProperOS/backend/server.js` (91 lines, Express) does
synchronous `fs.appendFileSync` writes into a hardcoded Windows path
`C:/Users/jsmit/Documents/ProperAI_Vault`. No filesystem on Cloudflare Workers, and the path is meaningless
on any machine but the original dev box.

**F5 — Hardcoded `localhost` in shipped frontend.** `ProperOS/index.html:618` fetched
`http://localhost:3000/api/status`. In production the browser resolves that to the *visitor's own machine*, so
agent status would always fail in the deployed app.

**F6 — No cross-app linking.** No `href` anywhere points at another app in the suite.

### Decisions taken

- **Phase A** — purge stale backtick drafts, repair the ProperOS syntax error, add `.gitignore`,
  untrack `node_modules` (leave on disk).
- **Phase B** — serve the suite locally on port 3000, verify every app boots.
- **Phase C** — port the Express backend to Hono on Cloudflare Pages; replace Obsidian filesystem
  writes with D1 (edge-safe); build a suite launcher shell; make all app URLs relative.

---

## 2026-10-24 — Session 1, continued: Phases B & C

### Phase C — Express → Hono on Workers (deploy-target decision)

**Deploy lane chosen: Genspark hosted** (`gsk hosted deploy` → Workers for Platform,
managed Cloudflare account). This changed the target from Pages to a **Worker**,
which forced a rebuild of the toolchain.

**Why the Vite/Pages toolchain was thrown away.**
The first pass used `@hono/vite-cloudflare-pages` + `pages_build_output_dir` + `_worker.js`.
The hosted pipeline deploys a **Worker**, not a Pages project, so that config was
invalid for the chosen lane. Checking `src/index.tsx` showed **zero JSX** — the whole
entry point is `c.html()` template strings — so Vite added nothing but a build step.
Dropped Vite and `@hono/vite-cloudflare-pages` entirely; Wrangler now bundles
`src/index.ts` directly. Two fewer dependencies, one fewer failure mode.

**Backend port — Express `server.js` → `src/routes/api.ts`**

| Original (Express) | Port (Hono + D1) |
|---|---|
| `let systemState = { projects, agents }` in memory | `agents` + `projects` D1 tables |
| `writeToObsidian()` → `fs.appendFileSync` into `C:/Users/jsmit/Documents/ProperAI_Vault` | `kb_entries` D1 table (`/api/kb` reads it back) |
| `app.get('/api/status')` | same path, same response shape |
| `app.post('/api/execute')` | same path, plus D1 persistence |
| `app.post('/api/sync')` | same path, batches all agents |
| — | `GET /api/health`, `GET /api/stats`, `GET /api/projects`, `PATCH /api/projects/:id` |

The in-memory-object → D1 move is not cosmetic: Workers instances are ephemeral and
horizontally scaled, so `systemState` would have silently reset on every isolate recycle.
The Obsidian move is unavoidable — there is no filesystem on the edge, and the original
path was meaningless on any machine other than the one developer box.

`/api/status` deliberately preserves the original response shape
(`{ vital: { status, kbVersion, lastUpdated } }`) so ProperOS's existing
`updateAgentStatus()` needs no changes.

**Custom domain is NOT used.** No `custom_domain_add` — the hosted worker URL is the
delivery surface for now.

### Launcher shell (`src/index.tsx`)

The 8 apps had **no cross-app links at all** — no `href` anywhere pointed at another app.
Built a launcher at `/` in the suite's own visual language (Midnight Slate `#020617`,
Neon Cyan `#00f3ff`): ambient radial field, masked grid, staggered card entrance,
hover glow via a `--accent` custom property per app, reduced-motion guard.
Stats strip hydrates from `/api/stats` and degrades silently if the API is cold.

### Static asset strategy

Apps stay at repo root (each beside its `CLAUDE.md`); `scripts/sync-apps.mjs` copies
`Proper*/index.html` → `public/apps/<Name>/index.html` at build time. `wrangler.jsonc`
uses `assets.directory = ./public` with assets-first serving, so app pages are served
as static assets and *never* invoke the Worker.

The sync script does real work beyond copying: it rewrites any
`http://localhost:3000/api` baked into shipped frontend to a relative `/api`.
That fix is required — a browser resolving `localhost` hits the *visitor's own machine*.
It caught and repaired exactly one: `ProperOS/index.html:618`.

### Bugs found and fixed during the port

**B1 — Campaign-name parser yielded garbage.** `"launch a new campaign for X"` returned
`"a new campaign for X"`. First cause: regex alternation `(launch|a new campaign|...)`
backtracks to the shortest branch. Second, self-inflicted: while repairing it I replaced
the whole helper with the call site and deleted the function definition, leaving a
`ReferenceError` at request time. Fixed by moving `deriveCampaignName()` to module scope
with an explicitly ordered longest-first `LEAD_PHRASES` list.
Verified: `"launch a new campaign for AI real estate agents"` → `"AI real estate agents"`.

**B2 — Stale worker holding the port.** `pm2 restart` on a wrangler process orphans the
`workerd` child, which keeps the listening socket while the rebuilt worker is never
served. Symptom: a fix appears to have no effect and mirrors pre-fix output exactly.
Always kill by port (`fuser -k 3000/tcp`), not only via PM2.

**B3 — Self-killing shell.** `pkill -f workerd` matched the bash invocation that contained
the string "workerd", terminating its own session. Kill by port instead.

**B4 — Empty D1 on hosted deploy.** `seed.sql` never runs during a hosted deploy, so the
agent registry would render blank. `ensureSchema()` now self-seeds the 7 agent rows when
the `agents` table is empty, on first request.

### Phase B — local verification (Worker runtime)

Rebuilt and restarted on `wrangler dev`. Verified end-to-end:

- Launcher `/` → 200, `<title>Proper AI Suite</title>`
- All 8 apps `/apps/<Name>/` → **200** (ProperOS, ProperViral, ProperStory, ProperVoCaL,
  ProperPixelz, ProperFuzion, ProperSocialz, ProperFlux)
- `GET /api/health` → `{ok:true, runtime:"cloudflare-workers"}`
- `GET /api/status` → 7 seeded agents
- `POST /api/execute` (workflow) → project created, KB entry written, viral status updated
- `POST /api/sync` → `synced: 7`
- `PATCH /api/projects/:id` → status flipped to `Complete`
- `GET /api/stats` → live counts from D1
- `npx tsc --noEmit` → **exit 0**

Build output: `_worker.js` 39.34 kB (Vite) → direct Wrangler bundle, no dist step.

### Deploy attempt — BLOCKED (plan gate, not a code failure)

`gsk hosted deploy` → `code: membership_required`

```
Hosted deployment is only available for Plus-or-higher members.
result: { project_id: 3cc043a3-..., membership_required: "plus_or_higher" }
retryable: false
```

This is an **account-plan gate**, not a build or config problem. The worker bundle
validated cleanly immediately before it:

- `npx wrangler deploy --dry-run` → **97.33 KiB total / 25.51 KiB gzip**
- D1 binding `DB` resolved
- `npx tsc --noEmit` → exit 0
- All 8 apps + launcher + API verified on `wrangler dev` locally

The deployment itself is code-complete and deploy-ready. Nothing was retried —
the gate is `retryable: false` and retrying before an upgrade would just burn time.

**Standing options (pick one):**
1. **Upgrade to Plus** → hosted deploy works unchanged, no code edits needed.
2. **BYOK** → deploy the same Worker/Pages bundle to Bruce's own Cloudflare account
   via API token (`cf-byok-deploy`). Requires a Cloudflare API token in the Deploy panel.
   Note: the hosted-only constraints (no KV, no cron) would then relax.
3. **Local only** → suite already runs fully at `localhost:3000`.

**Not yet done because it was gated:** creating the production D1, binding the real
`database_id`, and publishing. `wrangler.jsonc` still carries the placeholder
`database_id: "00000000-..."`, which the hosted pipeline rewrites on provision.
